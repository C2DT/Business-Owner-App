# IBO App — V5.2.8 — Customer activity and planned appointments in shared reports (Direct Google Calendar)

## What V5 includes (updated compact scheduler UI)
- Existing IBO App features from the supplied V4.17/V5 package, including the four home tiles, 100–300 Points tracker, reports/calendar, protected sections, and Recommended Reading.
- Local VCF contact import with duplicate skipping and explicit iPhone Customer List → Files → upload instructions. Customer names appear as compact expandable rows; Call/Text are buttons, and phone numbers are not displayed in the list.
- Compact weekly plan with abbreviated weekday labels, hour-only start times, 5-minute calls, and a default start date of tomorrow. A compact in-app privacy notice appears on first opening the Outreach Scheduler; tapping OK dismisses it permanently for that browser/device. It uses a dedicated localStorage key and no longer relies on a browser alert.
- Direct Google Calendar event creation from the phone browser after Google OAuth authorization. Events include a 10-minute popup reminder. Existing app-created events are matched using a private event property to reduce duplicate creation on retries.
- `.ics` calendar export remains available as a fallback, and prospect CSV export is available for backup.

## Important: one-time Google setup is required
This is a static GitHub Pages app, so it cannot securely keep a Google OAuth client secret. V5 uses Google Identity Services in the browser and only needs an OAuth **Web application client ID**. Never paste a client secret into the app.

1. Open the Google Cloud Console: https://console.cloud.google.com/
2. Create or select a project.
3. In **APIs & Services → Library**, enable **Google Calendar API**.
4. Open **Google Auth Platform** (or **APIs & Services → OAuth consent screen**) and configure the app. For personal testing, choose External if appropriate and add your own Google account as a test user if Google presents that option. Complete any required consent-screen fields.
5. Go to **APIs & Services → Credentials → Create credentials → OAuth client ID**. Choose **Web application**.
6. Under **Authorized JavaScript origins**, add the origin where the app is hosted, for example `https://YOUR-USERNAME.github.io`. Use your actual GitHub Pages hostname. If your repository is published at `https://YOUR-USERNAME.github.io/YOUR-REPO/`, the origin is still `https://YOUR-USERNAME.github.io` (no repository path). If you use a custom domain, add that origin too.
7. Create the client and copy the **Client ID** ending in `.apps.googleusercontent.com`. Do not use or share a client secret.
8. Publish the V5 files to the root of your GitHub Pages repository: `index.html`, `manifest.json`, `sw.js`, and `README.md`.
9. On your phone, open the published app, go to **100–300 Points → Outreach Scheduler**, paste the OAuth Client ID, tap **Save Client ID**, then **Connect Google Calendar**. Sign in to the intended Google account and approve the requested calendar-events permission.
10. Import your VCF contacts, choose your outreach plan, preview the schedule, then tap **Approve & create Google Calendar events**. Confirm the prompt.

Google can change OAuth verification requirements, quotas, and policies. This implementation is designed for a personal-use static app; whether Google shows a warning or requires additional consent-screen steps depends on your Google project configuration. The user must complete the Google Cloud setup; the app cannot create OAuth credentials on the user's behalf.

## What data goes to Google
Contact names and phone numbers remain in this browser's local storage until you choose to create calendar events. When creating events, the app sends the prospect's name, phone number, event time, and a private assignment identifier to Google Calendar. The OAuth token is kept in memory for the current page session, not saved to local storage. Disconnecting clears the in-memory token but does not delete events already created in Google Calendar. You can revoke the app's access from your Google Account security/third-party connections settings.

## Free use
GitHub Pages can host the static app for free within GitHub's current limits. Google Calendar API usage is generally available without a separate fee for ordinary use but is subject to Google quotas, policies, and possible future changes. This app uses no paid backend or database.

## Local data and backup
Prospects, notes, statuses, schedule settings, and event IDs are stored in this browser/device using `localStorage`; they do not automatically sync across devices. Export the prospect CSV periodically as a backup. Clearing site/browser data may remove local prospect information.

## Troubleshooting
- **Origin not authorized:** add the exact GitHub Pages hostname under Authorized JavaScript origins in Google Cloud; then wait a few minutes and retry.
- **Access blocked / app not verified:** check the OAuth consent-screen publishing status and add your own account as a test user if the project is in testing. Follow the current Google Cloud prompts.
- **Calendar API disabled:** enable Google Calendar API in the same Cloud project used for the client ID.
- **Authorization expired:** tap Connect Google Calendar again, then retry creating events.
- **Avoid duplicates:** the app records Google event IDs locally and checks the event's private assignment property before retrying. Keep the same browser storage for reliable local tracking.
- **Fallback:** use the `.ics` export if Google authorization is unavailable.

## Publish to GitHub Pages
Replace the existing `index.html`, `manifest.json`, `sw.js`, and `README.md` with these V5 files, commit the change, and wait for GitHub Pages to deploy. The service worker cache name has changed so the updated app can replace the older cached version.


## V5 Customer Management update

- Customer Management is a separate layer-3 page, reachable from Outreach Scheduler and the Ordering Customers label in the 100–300 Points section.
- Imported contacts default to **Potential customer**. Other categories are **Ordering Customer**, **Ditto Customer**, and **Follow Up**.
- Customer cards expand to show Call/Text buttons, outcome actions (Voicemail, CNA Scheduled, Follow Up, CNA Completed, Order Placed), category, callback date, notes, and recent history.
- **Flush Contact** asks for confirmation, then removes the contact and its local scheduled assignments. Any Google Calendar events already created remain in Google Calendar.
- Weekly plan uses contacts per day (1/3/5/7/10), minutes per call (5/10/15), and the weekdays you actually select. Selected weekdays alone determine weekly pace; new assignments begin tomorrow.
- Contact records remain in this browser's local storage. Google Calendar only receives details when the user approves event creation.


## V5.1 update

- Added a **Received Referral** action to customer cards; it is recorded in the customer's action history.
- Added **Clear Preview** in Schedule Preview. It clears only appointments that have not been created in Google Calendar and have not been exported as an `.ics` file. Calendar-created and exported assignments are retained to reduce accidental duplicate appointments.
- Replaced the native browser confirmation for **Flush Contact** with an in-app confirmation dialog with Cancel and Flush Contact actions. The dialog closes after either choice. Confirming deletes the customer and their local assignments; events already created in Google Calendar remain there.

To publish V5.1, replace `index.html`, `manifest.json`, `sw.js`, and `README.md` in the GitHub Pages repository. The service worker cache name is updated to help the new version load.


## V5.2 weekly plan and callback update

- Removed the separate “days per week” selector. Select the weekdays you are available; the selected days determine the weekly schedule pace, so there is no mismatch between frequency and availability.
- Added a live prospect throughput estimate. It uses the number of contacts currently categorized as Potential customer and calculates `ceil(potential prospects / (contacts per day × selected days per week))`. For example, 100 prospects at 3 per day on 3 days per week takes 12 weeks.
- Customer cards now accept a callback date and time. A callback is added to Schedule Preview as a **Customer callback** and can be created in Google Calendar. When an existing Google Calendar callback is edited, the app attempts to update that event; if Calendar is not connected at that moment, it queues the update for the next approved Calendar update.
- The **Follow Up** action adds a customer follow-up to the next available weekly-plan slot and labels it separately in the schedule/calendar.
- On app launch, upcoming callbacks trigger a reminder popup each time the app is opened before the callback time. If the app remains open, the popup dismisses automatically once the callback time passes. Legacy date-only callbacks are treated as 6:00 PM.
- Data remains in local browser storage. Calendar creation or updates require the user to connect and approve Google Calendar access.

To publish V5.2, replace `index.html`, `manifest.json`, `sw.js`, and `README.md` in your GitHub Pages repository. The service-worker cache name is updated for this version.

## V5.2.8 updates
- Prospect pace now displays only “X weeks at current pace,” recalculated from current prospect count and plan inputs.
- Added a working Reset callback date & time action on every customer card. It clears the local callback and removes its local assignment; if connected, it also attempts to delete the corresponding Google Calendar event. If disconnected, a previously created Google event must be removed manually.
- Callback appointments retain the exact entered date and time. New outreach assignments are placed around existing appointments (including callbacks) so their time intervals do not overlap; callbacks take priority.


## V5.2.8 customer-management updates
- Clear Preview removes only uncreated outreach/follow-up assignments and preserves customer callback assignments. A callback is removed when cleared from the customer card or when that customer is flushed.
- Removed the separate “Reset callback date & time” button; the callback field remains available for clearing with the date/time picker’s Reset control.
- Added the Subscription category. Customer list defaults to All customers and sorts Subscription, Ditto Customer, Ordering Customer, Follow Up, then Potential customer; names sort alphabetically within each category.


V5.2.8 fix: callback date/time has an explicit Reset control next to the native date/time picker. Reset clears the saved callback and local schedule assignment; if a linked Google Calendar event cannot be deleted, the app warns that it may need manual removal.


V5.2.8 layout fix: the callback Reset button is placed underneath the date/time input so it remains within the screen width on mobile.


## V5.2.8 week/month scheduling
- Added a **Schedule ahead** selector for 1 week (7 days) or 1 month (30 days). The scheduler creates new outreach/follow-up assignments only inside the selected horizon and only on the chosen available weekdays, up to the selected contacts-per-day pace. Existing appointments remain unchanged.
- Schedule Preview displays only future appointments in the next 7 days, regardless of whether a week or month was scheduled. The summary also shows the total number of planned appointments.
- Google Calendar creation and `.ics` export continue to use all scheduled appointments in the selected period, not just the visible preview week. This lets a month be scheduled at once while keeping the on-screen preview compact.
- Updated the service-worker cache key and app version to V5.2.8.


## V5.2.8 report updates
- Share Previous Week and Share Previous Month now include customer activity totals: outreach appointments, customer callbacks, and referrals received. Zero-count activity types are omitted.
- Reports also show planned appointment counts for the next 7 days (weekly report) or next 30 days (monthly report), split into outreach, customer callbacks, and CNAs scheduled. Empty categories are omitted.
- Outreach/callback activity is derived from local dated schedule assignments; referrals are counted from dated “Received Referral” customer history entries. Planned outreach and callbacks use future local schedule assignments. The current app does not store a separate future CNA appointment date, so CNA counts appear only if a dated assignment of type `cna` exists.


## V5.2.8 priority scheduling updates
- Removed the persistent callback date/time field from customer cards.
- Tapping **Follow Up** opens a compact date/time scheduler with Save and Reset.
- Tapping **CNA Scheduled** opens the same compact scheduler with its own Save and Reset.
- Saved follow-up and CNA appointments are exact-time priority assignments. Regular outreach is moved around these priority slots where needed.
- Clear Preview preserves callbacks, scheduled follow-ups, and scheduled CNA appointments. Resetting a follow-up or CNA schedule removes its local assignment and attempts to delete a linked Google Calendar event when connected.

## V5.2.8 report sharing fix
- Fixed Share Previous Week and Share Previous Month by exposing the locally stored customer/assignment data to the report generator through a safe in-page bridge.
- Added user-visible error messages if report generation or sharing fails.


## V5.2.9 — Today’s appointment reminders

The Home Screen reminder now includes upcoming customer callbacks, customer follow-ups, and scheduled CNAs for the current local date only. Each reminder appears before its scheduled time, is hidden once its time passes, and can be shown again when the app is reopened or returns to the foreground.
