# IBO App v5.3.29 — Team of 10 PNG Reports

## Changes in this release

### Team of 10 reporting
- Removed **Export Team of 10 Report**.
- Added **Share Previous Week** and **Share Previous Month**.
- Both actions generate shareable PNG images using the same share/download behavior as the existing 100–300 Points reports.
- Weekly report covers the most recent seven calendar days, including today.
- Monthly report covers the previous calendar month.

### Weekly Team of 10 PNG
Includes:
- Audio, Reading, Upline Communication, and Association totals for the seven-day period.
- Number of PQI-related prospect changes.
- Number of launches / Belled events recorded in prospect history.
- Every prospect history change recorded during the period, including date, person, action, stage, and detail when available.
- Current people in the process grouped by stage, with Active or Limbo status.
- Prospect notes at the bottom.

### Previous-month Team of 10 PNG
Includes:
- Previous month's Ordering Customer, Personal PQI, and Launched Business Owner counters.
- PQI-related prospect changes and launch events recorded during the month.
- PQI source-list breakdown: A/B list, C list in person, C list social media, Story dropped, and Not recorded.
- All prospect history changes recorded during the month.
- Current people in the process grouped by stage.
- Final roster and prospect notes, with each person shown as Name — Stage (Active/Limbo).

### Existing 100–300 Points reports
- Moved People in the Process and Prospect Notes after the customer-activity metrics, at the bottom of the report.
- Added text wrapping for names and notes.
- Expanded the report canvas based on current PIP roster and note length to reduce clipping and prevent overlapping text.

### Data handling
- New PIP records preserve the source prospect-list category so future monthly PQI source breakdowns can be attributed.
- Older records without source-list metadata are shown under **Not recorded** rather than guessed.
- Reports use locally stored PIP and Prospect Manager history on the device. They do not fetch missing history from Supabase.
- PIP field edits (name, contact details, notes, WHY, Hunger, Appreciation, Capacity, and facilitator) are now recorded as dated history events for future reports. Existing edits made before this release cannot be reconstructed if they were not previously logged.

## Version consistency
- App title, home-screen version label, body version, and versioned source comments updated to v5.3.26.
- Service-worker cache updated to `business-owner-v5-3-17-winners-circle-embedded`.

## Scope
No password security, Google OAuth, calendar booking, Supabase schema, Edge Functions, or RLS policies were changed.


## v5.3.16 — Team of 10 report calendar
- Replaced the Team of 10 prospect-change count and change log in weekly/monthly PNG reports with a visual daily calendar matching the 100–300 Points report style.
- Calendar colors show Audio + Reading completion; diagonal overlays show Upline Communication and Association.
- Retained PQI and Launch/Belled totals, monthly PQI source breakdown, people-in-process roster, and prospect notes.


## v5.3.16 — Team of 10 report refinements
- Simplified the weekly and monthly activity metric to count launches only; Belled events are no longer included in the launch total.
- Increased weekly calendar layout spacing so the legend no longer overlaps the People in the Process section.


## v5.3.26 — Winners Circle tile and ribbon correction
- Reduced the Password Needed corner ribbons on Team of 10, Platinum Run, and Platinum+ so the complete wording is readable within each tile.
- Embedded the supplied Winners Circle crown artwork directly in `index.html` as a data URI, matching the existing Income Estimator image-tile implementation; no separate image upload is required.
- Kept Winners Circle full-width at the same 8:3 tile dimensions as Income Estimator.
- Updated the service-worker cache identifier and removed the now-unneeded external Winners Circle artwork from the precache list.


## v5.3.26 — Winners Circle tile layout
- Moved Winners Circle above Income Estimator on the home screen.
- Cropped and optimized the original crown artwork to the same 8:3 aspect ratio as Income Estimator and embedded it directly in index.html.
- Matched the responsive full-width tile proportions.


## v5.3.26 — Winners Circle width adjustment
- Reverted to the v5.3.19 tile layout and ordering.
- Reduced Winners Circle width to 96% of the available row and centered it, leaving a visible margin around the complete silver outline.
- Preserved the original embedded Winners Circle artwork and the existing Income Estimator sizing.
- Updated app version and service-worker cache key.


## v5.3.26 — Winners Circle border and ribbon correction
- Reverted the Winners Circle tile treatment to the v5.3.21 layout baseline.
- Re-optimized the original crown artwork to 1200 × 400 while preserving the full silver outline.
- Embedded the optimized artwork directly in `index.html`.
- Set the tile to 96% width, centered, with a 3:1 aspect ratio and `object-fit: contain` so no frame edges are cropped.
- Clipped the Beta Testing ribbon inside the tile's rounded bounds.


## v5.3.26 — Winners Circle width match
- Increased Winners Circle tile width from 96% to 100% of the home-grid content width so its silver side frame aligns with the Income Estimator gold side borders.
- Kept the centered 3:1 aspect ratio, contained artwork, rounded clipping, and contained Beta Testing ribbon.
- Updated app version references and service-worker cache key.


## v5.3.26 — HTML cleanup and password ribbon readability
- Removed the stray literal `\n` immediately before `</head>` that appeared at the top of the home screen.
- Shifted the PASSWORD NEEDED ribbon slightly down its diagonal and adjusted its text spacing so both words are easier to read.
- Updated app version references and service-worker cache name.


## v5.3.26 — Winners Circle avatar upload
- Added optional profile avatar upload (Memoji, illustrated avatar, or regular image).
- Images are center-cropped to 512×512 JPEG and uploaded to a private Supabase Storage bucket.
- Added `SUPABASE_v5_3_25_AVATAR_SETUP.sql`; run it in Supabase SQL Editor before using Edit Avatar.
- Each user can access only their own avatar in this first phase. Team-authorized avatar display on other users’ leaderboard cards is intentionally not enabled until hierarchy-based authorization is implemented.


## v5.3.26 — Winners Circle avatar frame cleanup
- Fixed the hidden avatar image being displayed beneath the default placeholder.
- Positioned the placeholder and uploaded image in the same circular frame.
- Applied an explicit `display:none!important` rule to hidden avatar elements.
- Updated app version references and service-worker cache name.


## v5.3.27 — Password banner unlock state
- PASSWORD NEEDED ribbons on Team of 10, Platinum Run, and Platinum+ are hidden after the correct password is entered.
- Unlock state uses the app’s existing per-device localStorage unlock keys, so the banner remains hidden on that browser/device on future visits.
- Other devices/browsers will continue to show the ribbon until that user unlocks the tile there.


## v5.3.29 — Team of 10 counter persistence fix
- Fixed the shared Team of 10 save routine so monthly production counters are written to the `iboTeam10V1` localStorage record, independently of daily habit data.
- Ordering Customers, Personal PQIs, and Launched Business Owners now persist after each +/− adjustment and when the Team of 10 screen is reopened.
- Added counter-key and delta validation plus an accessible save-error message.
- Existing monthly counter values and per-month storage structure are preserved.
- Updated app version and service-worker cache key.


## v5.3.29 — Winners Circle authenticated identity

Winners Circle now resolves the current account directly from the Supabase Auth `/auth/v1/user` endpoint. The displayed name and email, and avatar storage path, are keyed to that verified authenticated user rather than local profile-derived display data.
