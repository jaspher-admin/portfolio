# Jaspher Lising — Portfolio

Personal portfolio site. Static HTML/CSS/JS — no build step, no dependencies.

## Local preview

Open `index.html` directly in a browser, or run a tiny local server so relative paths behave like production:

```bash
# Python (preinstalled on most systems)
python -m http.server 8080

# or Node
npx serve .
```

Then visit http://localhost:8080.

## Deploy to GitHub Pages

1. Create a new repo on GitHub (e.g. `jaspher-portfolio` or `<your-username>.github.io` for the root site).
2. Push this folder as the repo root:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment**, set **Source = Deploy from a branch**, **Branch = main / (root)**, save.
4. Your site goes live at:
   - `https://<your-username>.github.io/<repo-name>/` — for a project repo
   - `https://<your-username>.github.io/` — if the repo is named `<your-username>.github.io`

The `.nojekyll` file is already included so GitHub Pages serves the asset folder verbatim.

## Structure

```
index.html          # The Funnel — services, process, FAQ, lead form
work.html           # The Proof — ARIA case study, outcomes, experience, skills
styles.css          # shared foundation: tokens, nav, buttons, form, motion
home.css            # index-only layout (hero diagram, services, process rail)
work.css            # work-only layout (case study, timeline, skills)
script.js           # nav, scroll-spy, reveals, count-ups, process rail, lead form
apps-script.gs      # Google Apps Script backend for the lead form (see SETUP.md)
assets/
  profile.jpg       # portrait (also the OG share image)
  ARIA.png          # dashboard screenshot for the case study
  resume.pdf        # downloadable resume
```

## Editing

- Update copy directly in `index.html` / `work.html`.
- Swap the portrait by replacing `assets/profile.jpg`, the resume via `assets/resume.pdf`.
- Colors and typography live as CSS custom properties at the top of `styles.css` (`:root { ... }`).
- **Connect the lead form** by following `SETUP.md`, then pasting the deployed Apps Script URL into `FORM_ENDPOINT` in `script.js` (inside `initForm`). Until then the form shows a friendly email fallback.
