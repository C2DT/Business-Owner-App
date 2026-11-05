# Business Owner App v5.3.65

## Package contents

- `index.html` — the supplied v5.3.65 application page.
- `sw.js` — the supplied v5.3.65 service worker, with its v5.3.65 cache name.
- `manifest.json` — Progressive Web App manifest retained from the previous app release.
- `icon-192.png` and `icon-512.png` — app icons retained from the previous app release.
- `apple-touch-icon.png` — iOS Home Screen icon retained from the previous app release.

## Update your GitHub Pages repository

1. Download and extract this ZIP.
2. Upload **all six files** to the same root folder in your GitHub Pages repository, alongside any other existing app files you need to keep.
3. Replace the existing `index.html`, `sw.js`, `manifest.json`, and icon files when prompted. Do not put them inside a new subfolder.
4. Commit the changes to the branch and folder used by GitHub Pages.
5. Open the published site and refresh it. If an installed Home Screen copy still shows the previous build, close it fully and reopen it; the updated service worker uses a new cache version and removes older `business-owner-*` caches on activation.

## Notes

- This package uses the exact `index.html` and `sw.js` supplied in `Business_Owner_App_v5.3.65.zip`.
- The app icons and manifest are carried forward from v5.3.64 so the Home Screen/PWA icon assets remain available.
- No Google Calendar Edge Function code is included or changed in this package. Deploy Edge Functions separately if your backend requires an update.
- This packaging step does not itself publish the app; the files must still be committed to the GitHub Pages repository.
