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
index.html          # single-page site
styles.css          # all styling
script.js           # scroll effects + mobile nav
assets/
  profile.jpg       # portrait (auto-rotated from the source photo)
  resume.pdf        # downloadable resume
```

## Editing

- Update copy directly in `index.html`.
- Swap the portrait by replacing `assets/profile.jpg`.
- Swap the resume by replacing `assets/resume.pdf`.
- Colors and typography live as CSS custom properties at the top of `styles.css` (`:root { ... }`).
