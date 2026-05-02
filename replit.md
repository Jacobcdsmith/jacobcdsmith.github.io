# Jacob C. Smith Portfolio

## Project Overview
A professional portfolio and blog website for Jacob C. Smith — Data Analyst, AI Systems Builder, and Consciousness Researcher. Features a high-tension minimalist, terminal-inspired aesthetic with a particle canvas background (WebGL), glitch effects, and markdown-based blog.

## Tech Stack
- **Framework:** React 19 with React Router 7
- **Build Tool:** Vite 8
- **Package Manager:** npm
- **Languages:** JavaScript (ESM), JSX, CSS, Markdown
- **Key Libraries:** `marked` (Markdown parsing), `react-helmet-async` (SEO/metadata)

## Project Structure
```
/
├── blog/                      # Blog content
│   ├── posts/                 # Markdown source files
│   └── posts.json             # Blog post metadata
├── public/                    # Static assets
├── scripts/
│   └── generate-blog-pages.mjs # Static site generation script
├── src/
│   ├── components/            # Reusable UI components (Header, Footer, ParticleCanvas)
│   ├── pages/                 # Route-level page components (About, Skills, Projects, Experience, Contact, Blog)
│   ├── App.jsx                # Main application component & routing
│   ├── main.jsx               # React DOM rendering
│   └── style.css              # Global styling & CSS variables
├── index.html                 # Main HTML template
├── package.json               # Project configuration
└── vite.config.js             # Vite build configuration
```

## Development
- **Dev Server:** `npm run dev` — runs Vite on port 5000 (host: 0.0.0.0, allowedHosts: true)
- **Build:** `npm run build` — runs `vite build` then `node scripts/generate-blog-pages.mjs`

## Deployment
- **Type:** Static site
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
