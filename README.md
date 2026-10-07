# Business Owner App v4.7

Clean GitHub-ready build.

- Business Owner terminology throughout.
- Points instead of PV.
- Team of 10 uses FILTERING.
- Futuristic dark/neon tile design.
- Runner and diamond artwork recropped with full artwork visible.
- Income Estimator tile.
- CNA onboarding link.
- Current-month calendar only.
- Share Previous Month / Share Previous Week image reports.
- Team password is not displayed in the interface.
- Fresh service-worker cache: business-owner-v4-6.

Upload the CONTENTS of this folder to the ROOT of the GitHub repository. Do not upload the ZIP itself or put the files inside another folder.


v4.7 update improvements:
- Network-first HTML navigation so new GitHub Pages versions are not pinned by an old cached index.
- Service worker uses `updateViaCache: none` and explicitly checks for updates.
- Old Business Owner service-worker caches are removed during activation.
- New worker activates immediately and reloads the app once under the new controller.
- Existing app data/localStorage is preserved.
