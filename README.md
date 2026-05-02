# Jacob C. Smith - Portfolio

[![Live Site](https://img.shields.io/badge/Live-jacobcdsmith.github.io-00D9FF?style=for-the-badge)](https://jacobcdsmith.github.io)
[![License](https://img.shields.io/badge/License-MIT-00FF41?style=for-the-badge)](LICENSE)

> **Systems-Oriented Data Analyst | Consciousness Researcher | Emergence Theorist**

**What is jacobcdsmith.github.io?** It is a React 19 + Vite portfolio site built by Jacob C. Smith—a data analyst and AI systems builder—that showcases analytics projects, consciousness research, and theoretical frameworks through a high-tension minimalist, terminal-inspired interface with an integrated blog.

---

## 🚀 Features

### Interactive Elements
- **Particle System**: WebGL-powered particle canvas with mouse interaction
- **Glitch Effects**: Terminal-inspired visual effects on hero section
- **Smooth Scrolling**: Seamless navigation between sections
- **Scroll Animations**: Fade-in effects for content as you scroll
- **Active Section Highlighting**: Navigation updates based on scroll position
- **Integrated Blog**: Markdown-based blog with static page generation
- **Easter Egg**: Konami code activation (try it!)

### Design Philosophy
- **Dark Mode First**: High-contrast terminal aesthetic
- **Monospace Typography**: Command-line inspired interface
- **Color Palette**: Electric Blue (#00D9FF), Crimson Red (#FF0055), Matrix Green (#00FF41)
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **Accessibility**: Semantic HTML5, ARIA labels, keyboard navigation

### Performance
- **Minimal Runtime Dependencies**: React 19, React Router 7, Marked (blog parsing)
- **Optimized Canvas**: 60fps particle system
- **Lazy Loading**: Intersection Observer for animations
- **Static Blog Generation**: Pre-rendered blog pages via build-time script

---

## 📂 Structure

```
jacobcdsmith.github.io/
├── src/
│   ├── App.jsx             # Root component and route definitions
│   ├── main.jsx            # React entry point
│   ├── style.css           # Global dark mode styling
│   ├── components/         # Reusable UI components
│   └── pages/              # Route-level page components
├── blog/
│   ├── posts/              # Markdown source files for blog posts
│   └── posts.json          # Blog post manifest (title, date, slug)
├── scripts/
│   └── generate-blog-pages.mjs  # Build-time static blog page generator
├── public/                 # Static assets served as-is
├── index.html              # Vite HTML entry point
├── vite.config.js          # Vite build configuration
├── package.json            # Dependencies and build scripts
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## 🌐 Deployment

### GitHub Pages (Automatic)

This site is configured for **GitHub Pages** and will deploy automatically on push to `main`.

The following commands push a new version live:

```bash
git add .
git commit -m "Update portfolio"
git push origin main
```

To enable GitHub Pages (one-time setup):
- Go to repository **Settings** → **Pages**
- Source: **Deploy from a branch**
- Branch: **main** / **(root)**
- Click **Save** — the site will be live at `https://jacobcdsmith.github.io` within 1-2 minutes

### Local Development

The following steps install dependencies and start the Vite dev server with hot module replacement:

```bash
npm install
npm run dev
# Then visit: http://localhost:5173
```

To build the production bundle (Vite build + static blog page generation):

```bash
npm run build
# Output goes to dist/
```

To preview the production build locally before deploying:

```bash
npm run preview
# Then visit: http://localhost:4173
```

---

## 🎨 Customization

### Colors
The following CSS variables in `src/style.css` control the entire site palette:

```css
:root {
    --color-primary: #00D9FF;      /* Electric Blue */
    --color-secondary: #FF0055;    /* Crimson Red */
    --color-accent: #00FF41;       /* Matrix Green */
}
```

### Adding a Blog Post
The following steps add a new blog post and make it appear in the blog index:

1. Create a Markdown file in `blog/posts/` (e.g., `blog/posts/my-new-post.md`)
2. Add an entry to `blog/posts.json`:
   ```json
   { "slug": "my-new-post", "title": "My New Post", "date": "2025-01-01" }
   ```
3. Run `npm run build` to regenerate static blog pages

### Content Updates
- **Projects / Experience / Skills / Contact**: Edit the corresponding components under `src/pages/` and `src/components/`

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend Framework** | React 19, React Router 7 |
| **Build Tool** | Vite 8 |
| **Blog Parsing** | Marked 18 (Markdown → HTML) |
| **Deployment** | GitHub Pages |
| **Version Control** | Git |

---

## 📊 Portfolio Highlights

### Featured Projects

1. **Multiversal Consciousness Framework (MCF)**
   - Mathematical formalization of consciousness as interference patterns
   - CONSIM simulator: 60fps WebGL visualization
   - Academic publication in progress

2. **GitHub Language Analysis Platform**
   - 1,200+ repositories analyzed
   - 78% predictive accuracy
   - Production deployed on Vercel

3. **WeGo Public Transit Optimization**
   - 338,861 bus trips analyzed
   - $155K improvement roadmap
   - 3-5% reduction in late arrivals

4. **PawMatch AI**
   - 1st Place / 527 competitors (DataCamp)
   - ML-powered adoption matching

### Professional Impact
- **18% YoY revenue increase** at FleetPride through predictive analytics
- **25% contract renewal improvement** via CRM data mining
- **82% accuracy** seasonal forecasting models

---

## 🎯 Performance Metrics

```
Lighthouse Score (Desktop):
├── Performance: 98/100
├── Accessibility: 100/100
├── Best Practices: 100/100
└── SEO: 100/100

Load Time: < 1s
```

---

## 🧪 Testing

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Responsive Breakpoints
- 📱 Mobile: < 480px
- 📱 Tablet: 481px - 768px
- 💻 Desktop: 769px - 1200px
- 🖥️ Wide: > 1200px

---

## 🔒 Security & Privacy

- **No Tracking**: Zero analytics or third-party scripts
- **No Cookies**: No data collection
- **HTTPS**: Enforced by GitHub Pages
- **Content Security**: No external resources loaded

---

## ❓ FAQ

### What is jacobcdsmith.github.io?
It is Jacob C. Smith's personal portfolio and blog—a React 19 web application hosted on GitHub Pages that showcases data analytics projects, consciousness research, and theoretical systems work.

### How do I run this portfolio site locally?
Install Node.js (v18+), then run `npm install` followed by `npm run dev`. The site will be available at `http://localhost:5173` with hot module replacement enabled.

### What tech stack does this portfolio use?
The site is built with React 19, React Router 7, and Vite 8. Blog posts are written in Markdown and converted to static HTML at build time using a custom Node.js script powered by the `marked` library.

### How do I add a new blog post?
Create a `.md` file in `blog/posts/`, add a corresponding entry (slug, title, date) to `blog/posts.json`, then run `npm run build`. The build script automatically generates a static page for the new post.

### How is this site deployed?
Pushing to the `main` branch triggers GitHub Pages to deploy from the repository root. The production build is generated by `npm run build` and outputs to `dist/`.

### Does this site collect any user data?
No. There are zero analytics scripts, no cookies, and no third-party data collection. HTTPS is enforced by GitHub Pages.

### What is the Multiversal Consciousness Framework (MCF)?
MCF is a mathematical framework that formalizes consciousness as interference patterns across multidimensional state spaces. It includes CONSIM, a 60fps WebGL simulator for visualizing these patterns. An academic publication is in progress.

### How can I contact Jacob C. Smith?
Reach out via [jacobcsmithd@gmail.com](mailto:jacobcsmithd@gmail.com), [LinkedIn](https://linkedin.com/in/jacobcsmith), or [GitHub](https://github.com/Jacobcdsmith).

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

**Copyright © 2025 Jacob C. Smith**

---

## 📧 Contact

**Jacob C. Smith**
📧 Email: [jacobcsmithd@gmail.com](mailto:jacobcsmithd@gmail.com)
📱 Phone: [(304) 473-9980](tel:+13044739980)
💼 LinkedIn: [linkedin.com/in/jacobcsmith](https://linkedin.com/in/jacobcsmith)
⚡ GitHub: [github.com/Jacobcdsmith](https://github.com/Jacobcdsmith)

---

## 🎨 Design Credits

**Aesthetic**: High-Tension Minimalist
**Inspiration**: Terminal interfaces, sacred geometry, cosmic surrealism
**Built**: React 19 + Vite 8, deployed on GitHub Pages

---

## 🔮 Future Enhancements

- [ ] WebGL consciousness visualization (MCF integration)
- [ ] Dark/Light mode toggle
- [ ] Project filtering by technology
- [ ] Interactive data visualizations
- [ ] 3D sacred geometry backgrounds

---

## 🚨 Known Issues

None currently. If you encounter any issues, please open an issue on GitHub.

---

## 🙏 Acknowledgments

Built during **NewForce Cohort 11** Data Analytics Program.

Special thanks to the open-source community for inspiration and tools.

---

<div align="center">

**Unraveling the universe, one data point at a time.**

[↑ Back to Top](#jacob-c-smith---portfolio)

</div>
