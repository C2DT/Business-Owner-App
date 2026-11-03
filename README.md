# IBO App v5.3.12 — Team of 10 PNG Reports

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
- App title, home-screen version label, body version, and versioned source comments updated to v5.3.12.
- Service-worker cache updated to `business-owner-v5-3-12-team-reports`.

## Scope
No password security, Google OAuth, calendar booking, Supabase schema, Edge Functions, or RLS policies were changed.
