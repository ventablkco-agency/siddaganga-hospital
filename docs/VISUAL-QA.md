# Reusable Visual QA

This project contains a reusable Playwright + GitHub Actions visual QA kit for responsive websites.

## What it checks

Every configured route is rendered at these reference viewports:

- 320 × 844 — narrow mobile
- 375 × 812 — common mobile
- 390 × 844 — modern mobile
- 430 × 932 — large mobile
- 768 × 1024 — tablet
- 1024 × 900 — small desktop/tablet landscape
- 1440 × 900 — desktop

Each run checks:

- no horizontal document overflow
- no horizontal body overflow
- responsive viewport metadata exists
- `<html lang>` exists
- document title exists
- runtime page errors are absent
- images finish loading successfully
- viewport screenshots are captured
- selected full-page screenshots are captured
- optional focused section screenshots can be configured
- optional pixel-level screenshot regression can be enabled after a design is approved

## Project files

```text
.github/workflows/
├── visual-qa.yml                 # project-specific trigger/caller
└── reusable-visual-qa.yml        # reusable CI engine

playwright.config.mjs             # browser/server configuration
visual-qa.config.mjs              # routes, viewports and focused sections
tests/visual-qa.spec.mjs          # responsive assertions and screenshots
```

## Adding a new page

Add the route to `visual-qa.config.mjs`:

```js
routes: [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about/' },
  { name: 'new-page', path: '/new-page/' },
],
```

The next push automatically renders that page at every configured viewport.

## Adding a focused section

Give the section a stable selector:

```html
<section data-visual="hero">
```

Then add it to `focusSelectors`:

```js
focusSelectors: [
  { name: 'hero', selector: '[data-visual="hero"]' },
],
```

CI will create a dedicated screenshot of that section at every viewport.

## Pixel-level visual regression

Do **not** enable pixel regression while the design is still changing. First get the design approved, then generate and commit the Playwright snapshots for the agreed viewport set.

After the baseline is committed, run the workflow with:

```bash
VISUAL_REGRESSION=true npx playwright test
```

and enable the same environment variable in CI when the project is ready for strict visual regression.

This turns an approved screenshot into a contract: later UI changes that visibly alter the baseline fail the test instead of silently shipping.

## Reusing this kit for a new website

Copy these files into the new repository:

```text
.github/workflows/reusable-visual-qa.yml
.github/workflows/visual-qa.yml
playwright.config.mjs
visual-qa.config.mjs
tests/visual-qa.spec.mjs
```

Then change only:

1. `visual-qa.config.mjs` — routes, viewports and focus selectors.
2. `.github/workflows/visual-qa.yml` — branch name and build/preview commands if the stack differs.
3. `playwright.config.mjs` — only if the framework uses a different preview server or port.

The reusable workflow installs a pinned Playwright Test version in CI without adding Playwright to the website's production dependency tree.

## Local run

From the project root:

```bash
npm run build
npx playwright test
```

For a headed browser during local debugging:

```bash
npx playwright test --headed
```

## Design workflow

Visual QA should run in this order:

```text
Design reference
      ↓
Build desktop composition
      ↓
Build mobile composition
      ↓
Validate 320 / 375 / 390 / 430
      ↓
Validate 768 / 1024
      ↓
Validate 1440
      ↓
Fix layout architecture
      ↓
Add animations/interactions
      ↓
Run visual QA again
      ↓
Approve baseline
      ↓
Enable pixel regression
```

Do not use a new media-query patch to hide a structural layout problem. Fix the containing block, layout model, sizing rule, or breakpoint composition that caused the problem.
