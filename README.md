# IBO App v5.3.37 — Winners Circle Leaderboard UI + Report, Reading, and Onboarding Fixes

## Changes in this update

- Cropped the shared monthly report to the rendered content to remove unnecessary blank space.
- Added a **Previously Completed** book status in Recommended Reading. Book statuses cycle through Blank → Current → Finished → Previously Completed → Blank.
- Removed the PDF download hyperlink from Recommended Reading.
- Updated Clear Local App Data so completed onboarding checks are preserved while device-only data is cleared and the local session is signed out.
- Retained the Winners Circle leaderboard interface and other features from the supplied v5.3.31 build.

## Publishing

Upload the contents of this ZIP to the existing GitHub Pages repository, replacing the corresponding files. The service-worker cache name has been updated to force clients to fetch the new app files.

## Validation

JavaScript syntax and archive contents should be checked before publishing. Live Safari behavior and Supabase persistence require testing in the deployed app.
