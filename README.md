# Campus Feed

Campus Feed is a beginner-friendly, API-free hackathon prototype for turning scattered campus complaints into one collective student voice.

## Structure

- `index.html` — landing page + college email/demo OTP verification
- `css/global.css` — shared design system and responsive layout
- `js/storage.js` — shared localStorage data layer
- `person1/` — campus feed/home
- `person2/` — reporting, duplicate detection, issue details and comments
- `person3/` — reports, monthly insights and profile

## Run

No build step or backend is required.

1. Download/extract the project.
2. Open `index.html` in a browser.
3. Enter any valid-looking email.
4. Use demo OTP `123456`.
5. Explore the connected pages.

For the smoothest local demo, use VS Code Live Server or any simple static HTTP server.

## How it connects

All pages load `js/storage.js`.

It stores:

- Issues
- Support actions
- Comments
- Profile information
- Issue status

in browser `localStorage`.

### Reporting

Reporting creates a draft in `sessionStorage`, runs duplicate detection, and then creates the issue in the shared local data.

### Supporting

Clicking "I'm Also Affected" toggles the student's support and updates the support count.

### Comments

Comments are stored against the individual issue ID.

### Profile

Profile information and activity are read from the same localStorage data.

### Insights

The insights page calculates statistics from the same issue dataset.

No API keys, backend, database or external dependencies are required.