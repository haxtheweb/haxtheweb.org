In HAX: two doors
-----------------

On the dashboard where you make a site, open **Import**. There are two cards. **From a file** takes a file and works out which importer fits. **From a URL** takes a link, then you say what kind of site it is. Or ask Merlin: type "import" and pick a source.

What comes in, and how
----------------------

<editable-table bordered="" striped="" condensed="" column-header="" row-header="" responsive="" sort=""><table><caption>Every source HAX imports</caption><thead><tr><th>Source</th><th>Door</th><th>Command line method</th></tr></thead><tbody><tr><th>Word (.docx)</th><td>From a file</td><td><code>docxToSite</code></td></tr><tr><th>PDF</th><td>From a file</td><td>In HAX only, for now</td></tr><tr><th>PowerPoint (.pptx)</th><td>From a file</td><td>In HAX only, for now</td></tr><tr><th>Excel (.xlsx)</th><td>From a file</td><td>In HAX only, for now</td></tr><tr><th>HTML file</th><td>From a file</td><td>In HAX only, for now</td></tr><tr><th>WordPress pages</th><td>From a URL</td><td><code>wordpressPagesToSite</code></td></tr><tr><th>Drupal book</th><td>From a URL</td><td><code>drupalBookToSite</code></td></tr><tr><th>Notion</th><td>From a URL</td><td><code>notionToSite</code></td></tr><tr><th>GitBook</th><td>From a URL</td><td><code>gitbookToSite</code></td></tr><tr><th>Pressbooks</th><td>From a URL</td><td><code>pressbooksToSite</code></td></tr><tr><th>Plone</th><td>From a URL</td><td><code>ploneToSite</code></td></tr><tr><th>OpenStax</th><td>From a URL</td><td>In HAX only, for now</td></tr><tr><th>VitePress</th><td>From a URL</td><td>In HAX only, for now</td></tr><tr><th>Quarto</th><td>From a URL</td><td>In HAX only, for now</td></tr><tr><th>Another HAXcms site</th><td>From a URL</td><td><code>haxcmsToSite</code></td></tr><tr><th>Any web page (HTML URL)</th><td>From a URL</td><td><code>htmlToSite</code></td></tr><tr><th>ELMS:LN</th><td>Command line</td><td><code>elmslnToSite</code></td></tr><tr><th>Canvas course (Common Cartridge, .imscc)</th><td>From a file</td><td>Through its importer plugin</td></tr><tr><th>Elementor</th><td>From a URL</td><td>Through its importer plugin</td></tr><tr><th>Astro</th><td>From a file (zip) or a URL (repository)</td><td>Through its importer plugin</td></tr><tr><th>Jekyll</th><td>From a file (zip) or a URL (repository)</td><td>Through its importer plugin</td></tr><tr><th>Hugo</th><td>From a file (zip) or a URL (repository)</td><td>Through its importer plugin</td></tr><tr><th>Grav</th><td>From a file (zip) or a URL (repository)</td><td>Through its importer plugin</td></tr></tbody></table></editable-table>

From the command line
---------------------

One command makes the site and fills it. Give it the address and the method from the table.

Already have the pages as a list? Import them into a site that exists:

For an agent, as a script
-------------------------

Paste this into an agent, or follow it yourself. Every step is a command with the same result each time.