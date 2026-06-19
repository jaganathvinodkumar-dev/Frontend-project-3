# Real-time Collaboration Dashboard (Scaffold)

This repository contains a starter scaffold for the Frontend Developer Internship assessment: React + TypeScript + Tailwind + Zustand + React Query.

Next steps (in ArcForge environment):

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Continue implementation: real-time simulation, comments, animations.

Testing & Build

- Run tests:

```bash
npm run test
```

- Production build (optimized):

```bash
npm run build
```

The Vite build is configured to split vendor code, minify with terser, and remove console statements in production.

Deployment (GitHub Pages)

1. Create a GitHub repository and push this project to `main`.
2. The included GitHub Actions workflow `.github/workflows/deploy.yml` will build and deploy the `dist` folder to GitHub Pages automatically on push.
3. After the action completes, your site will be available at:

```
https://<GITHUB_USERNAME>.github.io/<REPO_NAME>
```

If you'd like, I can prepare the repo and push and then report the live URL — you'll need to provide a GitHub repo name and grant push access, or run the push yourself.

Alternative: deploy to Vercel or Netlify by connecting the repository — both detect the Vite setup and will deploy automatically.

Vercel (recommended)

1. Install Vercel CLI (optional) and login:

```bash
npm i -g vercel
vercel login
```

2. From project root run:

```bash
vercel --prod
```

3. Or connect the GitHub repository in the Vercel dashboard; set the build command to `npm run build` and output directory to `dist`. The included `vercel.json` is configured for this project.

Netlify

1. In Netlify dashboard, choose "New site from Git" and connect your repo.
2. Set build command to `npm run build` and publish directory to `dist`. The `netlify.toml` is included for convenience.

Notes on automation

- Both platforms will deploy automatically on push once the repo is connected. If you provide commit access, I can push and trigger the deploy.

Keyboard shortcuts (global):

- `c`: focus comment input
- `d`: toggle dark mode
- `s`: toggle sidebar

Accessibility:

- Skip to main content link available via keyboard (press Tab on load).
- Buttons and interactive elements include ARIA labels and focus outlines.
