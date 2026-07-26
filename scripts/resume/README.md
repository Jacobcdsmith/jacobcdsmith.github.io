# Resume source

`resume.html` is the source of truth for `public/jacob-c-smith-resume.pdf` — a
single self-contained HTML file styled to match the site (cyanotype blue,
JetBrains Mono headings) so it can be edited by hand and re-exported without
any build tooling.

## Regenerating the PDF

Open `resume.html` in a browser and use its native "Print → Save as PDF"
(Letter size, background graphics on, no headers/footers), or drive it
headlessly, e.g.:

```js
// requires the `playwright` package + a Chromium binary; not a project
// dependency, install ad hoc if you need to automate this
const { chromium } = require('playwright')
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto('file://' + require('path').resolve('scripts/resume/resume.html'))
await page.pdf({ path: 'public/jacob-c-smith-resume.pdf', format: 'Letter', printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 } })
```

Keep the content in sync with `src/data/profile.js` and the Experience /
About pages whenever either changes.
