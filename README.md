# Business Owner App v5.3.72

## Book Next Step — calendar destinations

The Book Next Step panel now offers three separate destinations:

1. **Book on Calendar (Upline)** — sends the meeting to the selected facilitator's connected primary Google Calendar, subject to the existing upline calendar approval and sponsor-chain checks.
2. **Book on my calendar** — sends the event to the signed-in user's connected primary Google Calendar. The selected facilitator remains attached to the saved appointment; facilitator approval is not required for using the user's own calendar.
3. **Export ICS** — creates a calendar invite file. The selected facilitator's name and available user ID are retained on the saved local appointment.

The selected facilitator is now stored separately from the calendar destination. This allows a meeting facilitated by an upline to be placed on the requester's own calendar.

## Important testing notes

- Google Calendar must already be connected for either direct booking option. If the user's calendar is not connected, use Export ICS or connect Google Calendar in Settings.
- Upline booking continues to use the existing approval model and the facilitator's **primary** Google Calendar. This release does not yet add the separate-calendar directory / per-calendar approval tables or shared-calendar selection workflow discussed for a later calendar-resource migration.
- Facilitator name and user ID are retained on the app's saved In the Process appointment. This release does not yet create a centralized Supabase `meetings` row for these bookings; centralized reporting attribution will require the coordinated database/Edge Function migration.
- No Supabase SQL change is required to test the three destination buttons with the current booking service.

## Install

1. Extract this ZIP.
2. Upload/replace the files in the root of the existing GitHub Pages repository.
3. Commit the changes.
4. Close and reopen the installed app, or refresh the website. The service-worker cache name has been updated to v5.3.72.

## Suggested test sequence

1. Open an In the Process contact and choose Book Next Step.
2. Select a facilitator from the dropdown and enter a future date/time.
3. Test **Book on my calendar** and confirm the event appears on the signed-in account's primary calendar.
4. Repeat with **Export ICS** and confirm the share/download flow opens.
5. Test **Book on Calendar (Upline)** with a facilitator whose calendar access has already been approved.
6. Confirm the saved appointment still displays the chosen facilitator regardless of which calendar received the event.
