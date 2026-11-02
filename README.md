# FrameX Website

Marketing site for FrameX, the Authority-to-Pipeline System for B2B tech companies.

Built with **React + Vite**. This replaced an earlier static HTML/CSS/JS build (see git
history) with a componentized app: data-driven sections for the six-step system and FAQ,
raw-markup partials for the bespoke illustration-heavy sections, and a single interaction
hook (`useFxInteractions`) driving scroll-based reveal, counters, the pinned horizontal
"Problem" section, and the active-link navbar indicator.

## Project structure

```
index.html            Vite entry point
public/
  favicon.svg
  robots.txt           Crawler rules, points to sitemap
  sitemap.txt           Plain-text URL list
  llm.txt               llms.txt-style summary for LLM crawlers
src/
  main.jsx, App.jsx, index.css
  components/            Navbar, Hero, Marquee, Credibility, Problem, Benefits,
                          System, LinkedInEvidence, GettingStarted, FAQ, Contact, Footer
  sections/               Raw markup partials for illustration-heavy sections
  data/                   modules.js (6-step system) and faq.js (FAQ content)
  hooks/                  useFxInteractions.js
  styles/                 design.css (full design system) + navbar.css
```

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Deploy

`dist/` is a static build and can be served from any static host (GitHub Pages, Vercel,
Netlify, etc.). `public/robots.txt`, `sitemap.txt`, and `llm.txt` reference
`https://theframex.com` — update that domain if it changes.
