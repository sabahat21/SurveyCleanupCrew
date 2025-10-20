# List of changes from CleanupCrew

- Massive restyling of the survey

  - Previously there was no global stylesheet to edit variables from, now there's frontend/src/styles/index.css file that is organized for anyone to edit values that they would like
  - Changed the overall theme for every page to match the Gameshow
  - User survey changes
    - Scrollable bar for questions that go beyond the screen's page
    - Animation beside skipped questions
    - Mobile responsive design to make it more user-friendly for mobile device users
  - Admin Dashboard
    - Small text changes such as "Delete Question" to make it more obvious instead of having an "X"
    - Removed progress bar when in Create Mode
    - Made the questions into an empty array instead of having pre-generated blank questions
    - Added all the questions in the Preview and add tabs to filter by difficulty

- Testing
  - Currently doing E2E testing with the Admin dashboard
    - Logging in and out as admin
    - Creating questions
    - Deleting quesiton
