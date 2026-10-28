# IBO App v5.2.89

Updates in this release:
- Shows the connected Google Calendar Gmail address in Settings, with a refresh control.
- Makes the Book Next Step form open visibly and scrolls it into view.
- Refreshes the sponsor hierarchy directory when the PIP screen opens, so available uplines from `get_my_uplines` can appear as facilitator choices before a calendar request is submitted. Calendar booking still requires the selected upline's approval.
- Shares daily habit-calendar data between 100–300 Points and Team of 10, while keeping monthly production counters separate.
- Adds PQI, started-business-owner, active and limbo counts, people/status/step listings, and recent belled counts to the monthly and weekly report images. These report metrics use locally stored PIP and outreach records on the current device.

Publishing:
1. Download and unzip this package.
2. Upload all seven files directly into the root of the `Business-Owner-App` GitHub repository, replacing files with the same names.
3. Commit to `main`.
4. Open the app and refresh it. If an older version is cached, close the app/browser tab and reopen the GitHub Pages URL.

Important:
- Existing local records remain in the browser's local storage. The calendar sharing change merges historical day records from the two tracker stores; it does not merge monthly production counters.
- Facilitator names are loaded from the signed-in user's saved sponsor hierarchy. Booking an upline's calendar still requires that upline to approve calendar access and connect Google Calendar.
- Report counts depend on what has been recorded in PIP and the outreach/prospect manager on this device; these reports do not query a team-wide central report database.
