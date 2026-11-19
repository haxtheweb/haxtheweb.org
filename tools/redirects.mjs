// Writes a small page at each old address in redirects.json that sends
// visitors (and search engines, through the canonical link) to where that
// content lives now. Static hosts such as GitHub Pages have no server
// redirects, so each old address gets its own index.html.
// Run from the site folder after changing redirects.json: node tools/redirects.mjs
import fs from "node:fs";
import path from "node:path";

const map = JSON.parse(fs.readFileSync("redirects.json", "utf8"));
const site = JSON.parse(fs.readFileSync("site.json", "utf8"));
const live = new Set(site.items.map((item) => item.slug));
const esc = (text) =>
  String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

for (const [from, to] of Object.entries(map)) {
  if (!/^[a-z0-9-]+(\/[a-z0-9-]+)*$/.test(from)) {
    throw new Error(`not a page address: ${from}`);
  }
  if (live.has(from)) {
    throw new Error(`${from} is a page on this site; it cannot also redirect`);
  }
  if (!/^(\/[a-z0-9-/]*|https:\/\/[^\s"<>]+)$/.test(to)) {
    throw new Error(`not a place to send people: ${to}`);
  }
  const target = to.startsWith("/") ? `https://haxtheweb.org${to}` : to;
  fs.mkdirSync(from, { recursive: true });
  fs.writeFileSync(
    path.join(from, "index.html"),
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>This page has moved</title>
    <link rel="canonical" href="${esc(target)}" />
    <meta http-equiv="refresh" content="0; url=${esc(to)}" />
    <meta name="robots" content="noindex" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <p>This page has moved. <a href="${esc(to)}">Go to its new home</a>.</p>
  </body>
</html>
`,
  );
}
console.log(`${Object.keys(map).length} redirects written`);
