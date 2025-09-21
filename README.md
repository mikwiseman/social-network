# Doggo Friends

Doggo Friends is a lightweight single-page web app for dog owners to share quick profiles and find walking buddies. The UI is fully client-side and stores data in browser memory only.

## Project structure

- `index.html` – markup and form layout for the feed and submission form
- `styles.css` – responsive styling and layout rules
- `app.js` – client-side state manager, templating, and filtering logic
- `vercel.json` – deployment configuration for Vercel static hosting

## Local development

No build step is required. Open `index.html` in your browser or start a local web server such as:

```bash
npx serve .
```

## Deploying to GitHub

1. Ensure you have a clean git history and add the remote repository: `git remote add origin git@github.com:mikwiseman/social-network.git`
2. Commit your work: `git add . && git commit -m "Add static app"`
3. Push to GitHub: `git push -u origin main`

## Deploying to Vercel

1. Install the Vercel CLI (`npm i -g vercel`) and authenticate with `vercel login`, or use the Vercel dashboard.
2. Run `vercel` and follow the prompts. Choose `Import an existing project`, set the root directory to the repository root, and accept the default build command and output directory (`public directory` should remain empty because this is a static deploy).
3. For automatic deployments from GitHub, connect the `social-network` repository in the Vercel dashboard and select the `main` branch. Each push will trigger a new deployment.

The included `vercel.json` configures static hosting so Vercel serves `index.html` and its static assets directly.

## Environment & secrets

This project does not require environment variables. If you add them later, store them in Vercel project settings or a `.env.local` file that is git-ignored.
