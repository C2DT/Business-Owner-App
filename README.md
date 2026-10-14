# Business Owner App — V5.2.36 Neon Clickable Tiles

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


V5.2.36 fix: tile PNGs are embedded directly in `index.html`, so a separately uploaded `assets` folder is no longer required for the home tile artwork.


V5.2.36 fixes the Income Estimator tile: its external destination now opens by same-tab navigation for mobile reliability, and the wide button uses a 2:1 aspect ratio so its height matches the square tiles while retaining full width.


V5.2.36 visual polish: restored the four primary tiles to the original square 1:1 size from V5.2.27, added layered beveled edge highlights and shadows for a subtle 3D effect, and reduced the full-width Income Estimator tile to 75% of its prior height (aspect ratio 8:3 instead of 2:1).


V5.2.36 clean tile edges: removed the bright white/beveled borders that created color artifacts along tile edges; retained subtle depth with a soft outer shadow. Income Estimator remains full width at the current 8:3 aspect ratio.


V5.2.36 edge cleanup: removed CSS borders, outlines, and shadows from all clickable image tiles. The Income Estimator art is cropped slightly at the top to hide the stray white/colored edge while retaining its full-width layout.


V5.2.36: Based on V5.2.31, cropped the white/gray outer margin baked into all five PNG tile artworks. Square tiles were cropped 8 px on each edge; the wide Income Estimator was cropped 12 px from top/left and 8 px from right/bottom. CSS and click actions remain unchanged.


V5.2.36 sharp 3D tile polish: all five border-trimmed PNGs are doubled in resolution using high-quality Lanczos resampling and restrained sharpening/contrast. Added a subtle dark raised-card shadow and pressed state without a white bevel/border.


V5.2.36 replaces only the Income Estimator tile artwork with the newly approved high-resolution gold banner. The artwork is cropped to the 8:3 tile ratio and resized to 2880×1080 using high-quality resampling; other four tiles and app behavior are unchanged.


V5.2.36 adds the approved neon blue/gold growth icon for Home Screen installation. The `icons` folder contains `apple-touch-icon.png` (180×180), `icon-192.png`, and `icon-512.png`. The HTML links the Apple touch icon and web manifest; the manifest references the Android/browser icon sizes. The service worker cache was updated to cache these icon assets and avoid stale icon assets.
