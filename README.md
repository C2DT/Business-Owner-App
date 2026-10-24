# IBO App v5.2.76

GitHub Pages files for the IBO App.

## v5.2.75 changes
- Calendar permission request popup is brought to the front and opens with focus.
- Calendar permission requests can select only a hierarchy upline; email and manual-name request options are removed.
- The PIP tile is now a shortcut to My Connections with the In the Process filter selected.
- Set Your Plan starts with Customers or Prospects, then asks the average call duration and continues with planning.
- App-icon badge counts appointments and birthdays in the next 7 days when appointment dates or contact birthday fields are available.

Note: calendar permission requests are still local drafts and do not notify an upline. Native app-icon badges depend on browser/device support and granted notification permission. Birthday dates must be stored on the contact as `birthday`, `birthDate`, or `dob`.


## v5.2.75
- Fixed PIP shortcut to open People in the Process as a modal popup above the app, with a visible close button, Escape-to-close, and backdrop click-to-close.


## v5.2.75
- Bell from People in the Process transfers the person into Prospects → Belled, stamps the date, and preserves the prior process stage in the prospect title.
- Removed the Belled filter/status from People in the Process.
- Removed Share Prospect File from PIP cards.
- Book Next Step defaults to QI.
- Google Calendar and .ics appointment descriptions include Hunger, Appreciation, Capacity, and WHY notes.


## v5.2.75
- Belled prospects are hidden from All Prospects and other prospect categories; they appear only when the Belled filter is selected.


## v5.2.75 navigation and PIP booking fix
- Secondary app screens now render as full-screen layers rather than flowing beneath Home/tile content.
- PIP Book Next Step opens the booking fields reliably and keeps the expanded card and confirmation message visible after saving.
- Booking retains QI as the default and updates the stage badge without rerendering away the active form.


## v5.2.75
- Fixed PIP popup close behavior: closing with X, backdrop, or Escape returns to the screen that was active before opening PIP.


## v5.2.75 — PIP close navigation fix
- Closing the PIP popup now hides the temporary Customer Management screen before restoring the screen that was active when PIP was opened.
- Prevents My Connections / In the Process from remaining visible after closing the popup.


## v5.2.76
- Refined Outreach Scheduler action cards for mobile: “My Connections” stays on one line, with the description below it, using the same dark card styling as the rest of the app.
