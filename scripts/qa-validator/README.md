# QA Visual Validator

Compares live screenshots against cropped mockups in `refs/`. **Missing refs score 0**, not 100.

1. Crop refs: `node scripts/qa-validator/crop-refs.mjs`
2. Dev server on :3000, then: `npm run qa:visual`
3. Artifacts: `tmp/qa/` (`*.png`, `*.diff.png`, `report.json`, `report.html`).

Pass threshold: **90**. Content regions in `masks.json` are neutralized so project photos / copy don't dominate the score. Structural checks (e.g. `GB` instead of EN in the language modal) zero that target.
