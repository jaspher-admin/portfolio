# Contact form setup — one-time, ~5 minutes

The contact form replaces the old Cal.com calendar on both pages. When someone
submits it, an Apps Script web app **appends a row to your Google Sheet** and
**emails you** at `jaspher.lising01@gmail.com`.

You only need to do this once. After that the form just works.

---

## Step 1 — Create the Apps Script

1. Open your sheet:
   https://docs.google.com/spreadsheets/d/1X5lmOMhqhq669vjhdXcqWR6kFiYBboc0FecJZV-Ovf0/edit
2. Menu: **Extensions → Apps Script**. A new editor tab opens.
3. Delete the sample `function myFunction() {}` code.
4. Open `apps-script.gs` (in this folder), copy **everything**, and paste it in.
5. Click the **Save** icon (💾).

## Step 2 — Authorize email + sheet access (recommended)

1. In the Apps Script editor, pick `testEmail` from the function dropdown (top bar).
2. Click **Run ▶**.
3. Google will ask for permissions → **Review permissions** → choose your account →
   "Google hasn't verified this app" → **Advanced → Go to (project) → Allow**.
   (This is normal for your own scripts.)
4. Check your inbox for the **"Portfolio form — test"** email. If it arrived, email works.

## Step 3 — Deploy as a Web app

1. Top right: **Deploy → New deployment**.
2. Click the gear ⚙ next to "Select type" → **Web app**.
3. Set:
   - **Description:** `Portfolio lead form`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**  ← required so visitors can submit
4. Click **Deploy**, approve if prompted.
5. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy....../exec`

## Step 4 — Paste the URL into your site

1. Open `script.js` in this folder.
2. Inside the `initForm()` function, find:
   ```js
   const FORM_ENDPOINT = 'REPLACE_WITH_YOUR_APPS_SCRIPT_WEB_APP_URL';
   ```
3. Replace the placeholder with your copied URL:
   ```js
   const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfy....../exec';
   ```
4. Save. Re-upload / redeploy your site (e.g. push to GitHub Pages).

## Step 5 — Test it live

Open your site, scroll to the form, submit a test entry. You should see:
- a new row in the Google Sheet (header row is added automatically the first time), and
- an email notification in your inbox.

---

## Notes & troubleshooting

- **Notification address** is set in `apps-script.gs` → `NOTIFY_EMAIL`. Change it there if needed.
- **Which tab?** It writes to the **first tab** (gid=0). To target a specific tab, set
  `SHEET_TAB = 'YourTabName'` in `apps-script.gs`.
- **Changed the script later?** You must **Deploy → Manage deployments → Edit (✏) →
  Version: New version → Deploy** for changes to go live. (Editing alone isn't enough.)
- **Spam protection:** the form has a hidden "honeypot" field. Bots that fill it are
  silently ignored — no row, no email.
- **No CORS setup needed:** the form posts in `no-cors` mode, so it works from any host
  (GitHub Pages, custom domain, local file) without extra configuration.
- **Privacy:** submissions go straight from the visitor's browser to *your* Apps Script
  and *your* sheet. No third-party form service in the middle.
