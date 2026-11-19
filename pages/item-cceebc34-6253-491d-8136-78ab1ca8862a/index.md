1\. In your browser, right now
------------------------------

Nothing to install. HAX runs in the page and saves to a folder on your computer.

2\. On your computer, in one line
---------------------------------

You need Node.js. Then install the HAX command line tool:

Make a site and open it:

Or start from one of the starters on the home page:

3\. Hand it to an agent
-----------------------

Open a fresh agent in an empty folder and paste this. The same words work in each of them.

<a11y-tabs aria-label="Agent"><a11y-tab label="Claude Code"><p>Paste into Claude Code:</p><code-sample copy-clipboard-button="" type="text"><template>Set up HAX on this computer and make me a site.
1. Check Node.js: node --version
   If it is missing, tell me how to install the current LTS, then stop.
2. Install the HAX command line tool:
   npm install --global @haxtheweb/create
3. Install the HAX skills so you know how to work with it:
   hax skills install --skill-name all --y --no-i
4. Read the rules for working with HAX:
   https://github.com/haxtheweb/praw/blob/main/AGENTS.md
5. Ask me what the site is for and what to call it. Then make it:
   hax site NAME --y --no-i
6. Tell me how to open it: cd NAME, then hax serve
Always use the hax command, never npx hax.
Never edit site.json by hand; use hax site commands.</template></code-sample></a11y-tab><a11y-tab label="OpenAI Codex"><p>Paste into OpenAI Codex:</p><code-sample copy-clipboard-button="" type="text"><template>Set up HAX on this computer and make me a site.
1. Check Node.js: node --version
   If it is missing, tell me how to install the current LTS, then stop.
2. Install the HAX command line tool:
   npm install --global @haxtheweb/create
3. Install the HAX skills so you know how to work with it:
   hax skills install --skill-name all --y --no-i
4. Read the rules for working with HAX:
   https://github.com/haxtheweb/praw/blob/main/AGENTS.md
5. Ask me what the site is for and what to call it. Then make it:
   hax site NAME --y --no-i
6. Tell me how to open it: cd NAME, then hax serve
Always use the hax command, never npx hax.
Never edit site.json by hand; use hax site commands.</template></code-sample></a11y-tab><a11y-tab label="Google Antigravity"><p>Paste into Google Antigravity:</p><code-sample copy-clipboard-button="" type="text"><template>Set up HAX on this computer and make me a site.
1. Check Node.js: node --version
   If it is missing, tell me how to install the current LTS, then stop.
2. Install the HAX command line tool:
   npm install --global @haxtheweb/create
3. Install the HAX skills so you know how to work with it:
   hax skills install --skill-name all --y --no-i
4. Read the rules for working with HAX:
   https://github.com/haxtheweb/praw/blob/main/AGENTS.md
5. Ask me what the site is for and what to call it. Then make it:
   hax site NAME --y --no-i
6. Tell me how to open it: cd NAME, then hax serve
Always use the hax command, never npx hax.
Never edit site.json by hand; use hax site commands.</template></code-sample></a11y-tab><a11y-tab label="Any other agent"><p>Paste into Any other agent:</p><code-sample copy-clipboard-button="" type="text"><template>Set up HAX on this computer and make me a site.
1. Check Node.js: node --version
   If it is missing, tell me how to install the current LTS, then stop.
2. Install the HAX command line tool:
   npm install --global @haxtheweb/create
3. Install the HAX skills so you know how to work with it:
   hax skills install --skill-name all --y --no-i
4. Read the rules for working with HAX:
   https://github.com/haxtheweb/praw/blob/main/AGENTS.md
5. Ask me what the site is for and what to call it. Then make it:
   hax site NAME --y --no-i
6. Tell me how to open it: cd NAME, then hax serve
Always use the hax command, never npx hax.
Never edit site.json by hand; use hax site commands.</template></code-sample></a11y-tab></a11y-tabs>

The commands you will use most
------------------------------

<editable-table bordered="" striped=""><table><caption>Everyday HAX commands</caption><thead><tr><th>Command</th><th>What it does</th></tr></thead><tbody><tr><td><code>hax start</code></td><td>Pick what to make from a menu</td></tr><tr><td><code>hax site my-site</code></td><td>Create a site</td></tr><tr><td><code>hax serve</code></td><td>Run the site you are in, with the editor</td></tr><tr><td><code>hax site node:add --title "About"</code></td><td>Add a page</td></tr><tr><td><code>hax site site:surge --domain my-site.surge.sh</code></td><td>Publish to Surge</td></tr><tr><td><code>hax webcomponent my-block</code></td><td>Start a new block</td></tr><tr><td><code>hax audit</code></td><td>Check a block against the design system</td></tr><tr><td><code>hax update</code></td><td>Update the CLI</td></tr></tbody></table></editable-table>

What you can bring with you
---------------------------

Files:

Whole sites, from their address:

[See how each one comes in](migrate)

Then what?
----------

<grid-plate layout="1-1-1-1"><ddd-card slot="col-1" title="Put it online" href="hosting" label="See hosting"><p>Free static hosting, your own server, or a campus deploy.</p></ddd-card><ddd-card slot="col-2" title="Bring your old site" href="migrate" label="See migration"><p>WordPress, Canvas, Word files, static generators.</p></ddd-card><ddd-card slot="col-3" title="Learn the rest" href="learn" label="See the channels"><p>Tutorials that teach HAX one flow at a time, on learn.hax.cloud.</p></ddd-card><ddd-card slot="col-4" title="Work with an agent" href="for-agents" label="See For agents"><p>What an agent needs to pick, install and run HAX for you.</p></ddd-card></grid-plate>