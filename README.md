# Business Owner App — V5.2.46 Email JSON Attachment

## What's new in V5.2.46
- Removed “Upload and edit a shared budget” from the Send Budget section. Importing remains available at the top of Preview Budget.
- Added a new 100–300 Points tutorial tip with the Budget Sheet icon explaining budget completion and collaboration with another app user.
- Updated the app version and service-worker cache key.

## Publish on GitHub Pages
1. Unzip this package.
2. Replace `index.html`, `manifest.json`, `sw.js`, and `README.md` in the repository root.
3. Keep the three app icon PNG files in the repository root alongside `index.html`.
4. Commit the changes and wait for GitHub Pages to publish.
5. Reopen the app. If an older version persists, close the installed app fully and reload the published site to refresh its cache.

---

# Business Owner App — V5.2.38 Budget Session

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


V5.2.37 fix: tile PNGs are embedded directly in `index.html`, so a separately uploaded `assets` folder is no longer required for the home tile artwork.


V5.2.37 fixes the Income Estimator tile: its external destination now opens by same-tab navigation for mobile reliability, and the wide button uses a 2:1 aspect ratio so its height matches the square tiles while retaining full width.


V5.2.37 visual polish: restored the four primary tiles to the original square 1:1 size from V5.2.27, added layered beveled edge highlights and shadows for a subtle 3D effect, and reduced the full-width Income Estimator tile to 75% of its prior height (aspect ratio 8:3 instead of 2:1).


V5.2.37 clean tile edges: removed the bright white/beveled borders that created color artifacts along tile edges; retained subtle depth with a soft outer shadow. Income Estimator remains full width at the current 8:3 aspect ratio.


V5.2.37 edge cleanup: removed CSS borders, outlines, and shadows from all clickable image tiles. The Income Estimator art is cropped slightly at the top to hide the stray white/colored edge while retaining its full-width layout.


V5.2.37: Based on V5.2.31, cropped the white/gray outer margin baked into all five PNG tile artworks. Square tiles were cropped 8 px on each edge; the wide Income Estimator was cropped 12 px from top/left and 8 px from right/bottom. CSS and click actions remain unchanged.


V5.2.37 sharp 3D tile polish: all five border-trimmed PNGs are doubled in resolution using high-quality Lanczos resampling and restrained sharpening/contrast. Added a subtle dark raised-card shadow and pressed state without a white bevel/border.


V5.2.37 replaces only the Income Estimator tile artwork with the newly approved high-resolution gold banner. The artwork is cropped to the 8:3 tile ratio and resized to 2880×1080 using high-quality resampling; other four tiles and app behavior are unchanged.


V5.2.37 adds the approved neon blue/gold growth icon for Home Screen installation. The `icons` folder contains `apple-touch-icon.png` (180×180), `icon-192.png`, and `icon-512.png`. The HTML links the Apple touch icon and web manifest; the manifest references the Android/browser icon sizes. The service worker cache was updated to cache these icon assets and avoid stale icon assets.


V5.2.37 fixes Home Screen icon paths to match the user's GitHub repository, where `apple-touch-icon.png`, `icon-192.png`, and `icon-512.png` are uploaded at the repository root beside `index.html`. The manifest and service-worker cache now use root-level paths.


## V5.2.38 — Budget Session
- Added a full-screen Budget Session flow that opens only by clicking the numbered “Budget Session” onboarding item inside the 100–300 Points area.
- Added Monthly Income, two Fixed Expenses pages, Variable Expenses, Debt, Business Costs, Savings, and an editable Preview Budget.
- Added/removable rows, locally saved budget data, calculated monthly totals, and estimated remaining cash flow.
- Added a Debt Snowball month-by-month estimate based on entered balances, interest rates, minimum payments, and an optional extra monthly payment.
- Added Send Budget actions for native share (where supported), an email draft, and an editable JSON download.
- Kept the existing app’s dark navy styling and green accents; bumped the service-worker cache so GitHub Pages can pick up the new build.


## Version 5.2.39 Budget Updates
- Annual or monthly income entry; annual amounts are converted to monthly totals.
- Updated Fixed Expenses and Variable Expenses categories.
- Renamed business costs to Ditto/Personal Use and Monthly Bundle (After first year); removed marketing expense.
- Separate total savings from monthly amount to save; cash flow subtracts only monthly savings.
- Debt Snowball now uses monthly APR interest, smallest-balance-first allocation, rolled freed minimum payments, and compares minimum-only payoff time against payoff with extra cash flow.


## Version 5.2.40 Budget Sheet & Snowball
- Added a Budget Sheet button under the Tools to Win section on the 100–300 Points page, matching the Outreach Scheduler launch style.
- Debt payoff compares minimum-only payments with the extra monthly amount, calculates monthly APR interest, and rolls freed minimum payments into later snowball targets.


## Version 5.2.41 Budget Sheet & Snowball Export
- Renamed the onboarding action to Budget Session- click here and removed bold/underline styling.
- Grouped Outreach Scheduler under Tools to Win.
- Income period choices are side-by-side radio buttons.
- Removed redundant Back to Budget controls.
- Savings rows track total savings and monthly amount to save separately, with add-row support and a Short term savings/Oops fund row.
- Debt labels specify minimum monthly payment.
- Added PNG download of the debt payoff order and monthly schedule.


## Version 5.2.42 Collaboration Fixes
- Income monthly equivalent updates live while typing.
- Savings input styling aligned with dark budget form controls.
- Time saved displays years and months for differences over 12 months.
- PNG debt payoff export uses a direct data URL download fallback.
- Send Budget page supports importing a shared editable IBO JSON budget into a separate local copy; removed redundant Back to Budget control.


## V5.2.43 — Tools & Budget Preview Import
- Compact two-column Tools to Win cards, with each entire card acting as its button and a single-column fallback on narrow screens.
- Added a Preview shortcut in the Budget Session header when saved budget data is present, avoiding the need to step through each section.
- Added Import Budget File at the top of Preview Budget so a user can import an editable JSON budget from another user. The same import format remains available from Send Budget.
- The import/export workflow remains file-based: users exchange the editable JSON file and each app edits its own local copy.


## What's new in V5.2.46
- Send by Email now includes section totals plus item-by-item income, fixed and variable expenses, debt payments and details, business costs, savings contributions, and current savings balances.
- Debt Snowball opens at the top of the page.
- Added a Business income from Growth field beside the existing extra debt payment field. Growth income is added to the snowball calculation without changing the extra payment field.
- The base extra payment is capped for calculation at estimated extra cash flow; entering a higher value shows the red warning “Amount over extra cash flow.”


## What's new in V5.2.46
- Send Budget by Email now uses the device share sheet when supported, passing the detailed budget summary and `IBO_Budget_Editable.json` together so the selected email app can attach the JSON file.
- On browsers that do not support sharing files, the app opens a prefilled email draft and downloads the JSON file; the user must attach it manually because `mailto:` cannot attach files by itself.


## v5.2.47 — Email Clean Breakdown
- Email budget breakdown now omits blank/zero-value income and expense rows for a cleaner, more consistent report across Mail and Gmail.
- Debt details include only named debts with a balance, payment, or APR entered. Section totals remain visible.


## v5.2.48 — Email line-break compatibility
- Mailto email drafts now encode line breaks as CRLF, improving per-row formatting consistency in Gmail and other email clients.


## v5.2.49 — Deficit display
- Estimated remaining cash flow is relabeled as Estimated Deficit when negative, shown in red with accounting-style parentheses.
- Debt Snowball summary heading reflects deficit status when applicable.


## v5.2.50 — Deficit debt snowball default
- When estimated cash flow is zero or negative, the regular extra debt payment input displays $0.00 and its effective snowball contribution is zero. Business income from Growth remains available to model its effect on payoff timing.


## v5.2.51 — Version label cleanup
- The visible in-app version label now shows only `v5.2.50`, without descriptive wording. Internal cache/version identifiers were updated for this release.


## v5.2.52 — Remove car payment from fixed expenses
- Removed Car Payment(s) from the fixed expense defaults. Existing saved car payment amounts are moved into the fixed-expense Other line (combined if needed) so totals are preserved.
