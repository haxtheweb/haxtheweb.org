#!/usr/bin/env node
/**
 * Accessibility scan: serves a folder of static pages, opens each page in
 * headless Chromium and runs axe-core against WCAG 2.0 and 2.1 A and AA.
 *
 *   node .github/a11y/a11y-scan.mjs --root <dir> [--entry <file>]
 *     [--site-json <file>] [--pages <file>] [--baseline <file>]
 *     [--update-baseline]
 *
 * --root       folder to serve as the site root
 * --entry      page served for any path that is not a file (HAXsite
 *              routing); default index.html
 * --site-json  HAXsite outline: scans "/" and every item's slug
 * --pages      text file listing paths to scan, one per line (# comments)
 * --baseline   JSON file of known violations, { "<path>": { "<rule>": n } }.
 *              The scan fails only when a page has a rule that is not in
 *              the baseline for it, or more failing elements for a rule
 *              than the baseline records. Fixing things never fails it.
 * --update-baseline  write the current results to --baseline and pass
 *
 * Findings go to stdout and, in GitHub Actions, the job summary.
 * Exit code 1 on any new violation or on a page that fails to load.
 */
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".vtt": "text/vtt",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      i++;
    }
  }
  return args;
}

const args = parseArgs(process.argv.slice(2));
if (!args.root || (!args["site-json"] && !args.pages)) {
  console.error(
    "Usage: a11y-scan.mjs --root <dir> [--entry <file>] (--site-json <file> | --pages <file>) [--baseline <file>] [--update-baseline]",
  );
  process.exit(2);
}
const root = path.resolve(args.root);
const entry = path.join(root, args.entry || "index.html");

function pagesToScan() {
  const list = [];
  if (args["site-json"]) {
    const site = JSON.parse(fs.readFileSync(args["site-json"], "utf8"));
    list.push("/");
    for (const item of site.items || []) {
      if (item.slug) list.push("/" + String(item.slug).replace(/^\/+/, ""));
    }
  }
  if (args.pages) {
    for (const line of fs.readFileSync(args.pages, "utf8").split("\n")) {
      const p = line.replace(/#.*/, "").trim();
      if (p) list.push(p.startsWith("/") ? p : "/" + p);
    }
  }
  return [...new Set(list)];
}

// Static server. Requests are resolved inside root only; anything that is
// not a file falls back to the entry page, the way a HAXsite deploy does.
function serve() {
  const server = http.createServer((req, res) => {
    let rel;
    try {
      rel = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    } catch (e) {
      res.writeHead(400);
      res.end();
      return;
    }
    let file = path.resolve(root, "." + rel);
    if (file !== root && !file.startsWith(root + path.sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) {
      file = path.join(file, "index.html");
    }
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      // a missing asset (has an extension) is a real 404; a route is not
      if (path.extname(rel) && path.extname(rel) !== ".html") {
        res.writeHead(404);
        res.end();
        return;
      }
      file = entry;
    }
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "content-type": type });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

// make text safe inside a Markdown table cell and inline code span
function cell(text) {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/`/g, "'")
    .replace(/[\r\n]+/g, " ");
}

function summary(text) {
  console.log(text);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
  }
}

const server = await serve();
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const results = {};
const loadFailures = [];
const pages = pagesToScan();
for (const p of pages) {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  try {
    await page.goto(base + p, { waitUntil: "load", timeout: 60000 });
    // HAX renders client side: let the autoloader and theme settle
    await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const axe = await new AxeBuilder({ page }).withTags(TAGS).analyze();
    const rules = {};
    for (const v of axe.violations) {
      rules[v.id] = {
        count: v.nodes.length,
        impact: v.impact,
        help: v.help,
        url: v.helpUrl,
        targets: v.nodes.slice(0, 3).map((n) => n.target.join(" ")),
      };
    }
    results[p] = rules;
  } catch (e) {
    loadFailures.push({ page: p, error: String(e.message || e).split("\n")[0] });
  }
  await context.close();
}
await browser.close();
server.close();

const baselineFile = args.baseline;
if (args["update-baseline"]) {
  if (!baselineFile) {
    console.error("--update-baseline needs --baseline <file>");
    process.exit(2);
  }
  const out = {};
  for (const p of Object.keys(results).sort()) {
    const rules = results[p];
    if (!Object.keys(rules).length) continue;
    out[p] = {};
    for (const r of Object.keys(rules).sort()) out[p][r] = rules[r].count;
  }
  fs.writeFileSync(baselineFile, JSON.stringify(out, null, 2) + "\n");
  console.log(`Wrote ${baselineFile}: ${Object.keys(out).length} page(s) with known violations.`);
}
const baseline =
  baselineFile && fs.existsSync(baselineFile) && !args["update-baseline"]
    ? JSON.parse(fs.readFileSync(baselineFile, "utf8"))
    : {};

const fresh = [];
let known = 0;
for (const [p, rules] of Object.entries(results)) {
  for (const [rule, info] of Object.entries(rules)) {
    const allowed = (baseline[p] && baseline[p][rule]) || 0;
    if (args["update-baseline"] || info.count <= allowed) {
      known += info.count;
    } else {
      fresh.push({ page: p, rule, ...info, allowed });
    }
  }
}

summary("### Accessibility scan (axe-core, WCAG 2.0/2.1 A and AA)\n");
summary(`${Object.keys(results).length} of ${pages.length} page(s) scanned; ${known} known failing element(s) in the baseline.\n`);
if (loadFailures.length) {
  summary(`**${loadFailures.length} page(s) failed to load**\n`);
  for (const f of loadFailures) summary(`- \`${f.page}\`: ${f.error}`);
  summary("");
}
if (fresh.length) {
  summary(`**${fresh.length} new violation(s)**\n`);
  summary("| Page | Rule | Impact | Elements | Example |");
  summary("| --- | --- | --- | --- | --- |");
  for (const f of fresh) {
    const ex = cell(f.targets[0] || "");
    summary(`| \`${f.page}\` | [${f.rule}](${f.url}) | ${f.impact} | ${f.count} (baseline ${f.allowed}) | \`${ex}\` |`);
  }
  summary("\nFix these, or if a maintainer accepts them, re-run with `--update-baseline` and commit the baseline.");
} else if (!loadFailures.length) {
  summary("No new violations.");
}
process.exit(fresh.length || loadFailures.length ? 1 : 0);
