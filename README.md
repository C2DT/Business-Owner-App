# Business Owner App — v5.3.38

## Update: Winners Circle controls + recoverable Deleted Contacts

### Deleted Contacts
- Deleting a customer or prospect now moves the record into a shared **Deleted Contacts** view instead of permanently removing it.
- The Deleted Contacts filter is available from both Customers and Prospects and shows records from either list, so users do not need to remember where the contact was originally stored.
- Deleted records retain their contact details and history and can be restored to their original list and category.
- Import matching includes deleted records. Re-importing a deleted contact does not create a duplicate or silently restore it; the import summary directs the user to Deleted Contacts to restore it if wanted.
- Existing legacy deletion tombstones are migrated to recoverable Deleted Contacts records when the cloud backup synchronizes, where the original record is still available.
- Scheduled local outreach assignments are removed when a contact is moved to Deleted Contacts. Existing Google Calendar events are not automatically deleted.

### Winners Circle
- Study / Action controls appear only under Longest Streak.
- Total Points and Most Improved do not show Study / Action controls.
- Month selector uses named months with available scoring data, up to the current month and six prior months.
- Personal Dashboard and Your Gains remain below the leaderboard independently of the selected leaderboard tab.

## Publishing
Upload the contents of this ZIP to the root of the existing GitHub Pages repository, replacing the previous files. The service-worker cache key has been advanced so the updated app can load.

## Important data note
Deleted Contacts are retained inside the existing `iboOutreachV5` contact records and therefore follow the app's existing account backup/sync behavior. Contacts that were permanently removed from every local and cloud copy before this update cannot be reconstructed by this update alone.
