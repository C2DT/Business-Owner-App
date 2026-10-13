# Business Owner App — V5.2.26 Neon Clickable Tiles

## What's new
- Replaced all five home-screen tile designs with the approved neon artwork as full-tile clickable images.
- Four square tiles use normalized 512 × 512 PNG assets; Income Estimator uses a wide 1464 × 242 PNG banner.
- Tile labels are part of the image art; each button also has an accessible label and image alt text.
- Updated service-worker cache and precached all five images so the published PWA can load them offline after install/cache refresh.
- Preserved the existing 100–300 Points tracker, first-open six-step tutorial, Reading flow, customer management, outreach scheduler, Google Calendar integration, reports, and existing popup behaviors.

## Install on GitHub Pages
1. Unzip this package.
2. Upload/replace `index.html`, `manifest.json`, `sw.js`, and `README.md` in the repository root.
3. Upload the included `assets` folder with all five PNGs, preserving the folder name and filenames.
4. Commit the changes and wait for GitHub Pages to publish.
5. Reopen the app. If an older service-worker version is still displayed, close the app fully and reload the published site once to refresh its cache.

## Files
- `index.html`
- `manifest.json`
- `sw.js`
- `assets/tile-100-300-points.png`
- `assets/tile-team-of-10.png`
- `assets/tile-platinum-run.png`
- `assets/tile-platinum-plus.png`
- `assets/tile-income-estimator.png`

The app remains static and stores local activity data in the browser's local storage. No backend or database was added.
