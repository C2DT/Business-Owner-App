# Business Owner App V5.2.22

## Reading list button alignment fix
- Replaced the shared `actions` layout on the Add New Book row with a dedicated flex row, preventing global grid styles from centering the button.
- The Add New Book button is now explicitly pushed to the right edge of the row.
- Preserved the confirmation popup, permanent local book storage, and reading status/date behavior.
- Updated the app version and service-worker cache key.

## Install
Replace `index.html`, `manifest.json`, `sw.js`, and `README.md` in the GitHub Pages repository, commit the changes, and reopen the app after deployment. If the old layout remains, fully close and reopen the installed app once so the updated service worker can activate.
