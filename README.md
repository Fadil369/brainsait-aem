# BrainSAIT — AEM Edge Delivery Services

A production-grade Adobe Experience Manager (AEM) Edge Delivery Services project,
built from the [adobe/aem-boilerplate](https://github.com/adobe/aem-boilerplate)
following the [aem.live developer tutorial](https://www.aem.live/developer/tutorial).

## Live URLs (after repo push + AEM Code Sync)
- Preview: `https://main--<repo>--<owner>.aem.page/`
- Production: `https://<branch>--<repo>--<owner>.aem.live/`

## Getting started
```bash
npm install
npx aem up            # local dev at http://localhost:3000
```

## Project anatomy
- `fstab.yaml` — content source (Google Drive / SharePoint / AEM) mountpoints
- `scripts/` — `aem.js` (core) + `scripts.js` (project setup)
- `styles/` — `styles.css` (global + BrainSAIT theme), `fonts.css`, `lazy-styles.css`
- `blocks/` — reusable content blocks (each = folder with `.js` + `.css`)
  - `header`, `footer`, `hero`, `cards`, `columns`, `fragment`, `widget`
  - **custom:** `plans` (pricing cards), `services` (feature grid), `stats` (counters)

## Custom blocks
Each block lives in `blocks/<name>/` with:
- `<name>.js` — `decorate(block)` to transform the authored DOM
- `<name>.css` — scoped styles

### plans
Converts a section of plan columns into responsive pricing cards.
### services
Turns rows into icon/title/description feature cards.
### stats
Renders numeric cells as emphasized counters (supports `98%` style).

## Authoring
Content is authored in Google Docs / Microsoft SharePoint and synced via the
[AEM Code Sync](https://github.com/apps/aem-code-sync) GitHub App.
Create/edit `.docx` or `.xlsx` files — they're published as pages/blocks automatically.

## Deployment
1. Create a GitHub repo from this template.
2. Install AEM Code Sync for that repo.
3. Push changes → auto-deploys to `.aem.page` (preview) and `.aem.live` (production).
