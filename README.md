# 朝日 — ASAHI Kinetic Interface v5

The Living Mannequin — Puppet on Strings is a four-page animated character showcase built with pure HTML, CSS, and vanilla JavaScript. Featuring a cinematic gold-on-crimson theme, it includes a landing showcase, visual archive, character dossier, and contact console.

## ✨ What's new in v5

- **Four pages** instead of one, linked by a shared animated navigation bar
- **Site-wide ambient ember particle field** (`<canvas>`) drifting behind every page
- **Cursor-follow glow** that trails the mouse with easing
- **Page-load fade/blur-in transition** on every page
- **Scroll-triggered reveal animations** (`IntersectionObserver`) used throughout
- **3D tilt-on-hover cards** (gallery tiles, explore cards) via `data-tilt`
- **Animated counters, progress bars, and radial "stat ring" gauges** on the Dossier page
- **Typewriter text effect** for the character bio
- **A filterable gallery** with smooth show/hide transitions
- **A glowing, reactive contact form** with a fake-but-satisfying submit animation
- Mobile-responsive nav with a slide-in drawer

## 🗂️ Project Structure

```
.
├── index.html          # Home — the original kinetic character card + "explore" section
├── gallery.html         # Archive — filterable, tilting visual gallery
├── profile.html         # Dossier — animated stats, rings, timeline, typewriter bio
├── contact.html         # Transmission — animated contact console
├── assets/
│   ├── site.css          # Shared theme: variables, nav, footer, reveal/tilt animations
│   ├── site.js            # Shared behavior: nav, embers, cursor glow, reveals, tilt, counters, filters, form
│   ├── hero.css / hero.js  # Home page only: the character card, petals, parallax, audio player
│   ├── gallery.css        # Archive page only
│   ├── profile.css        # Dossier page only
│   └── contact.css        # Transmission page only
└── README.md
```

Each page loads `assets/site.css` + `assets/site.js` (shared) plus its own page-specific stylesheet. `hero.js` and the filter/typewriter/counter code in `site.js` all check for their target elements before running, so nothing breaks on pages that don't use them.

## 🚀 Getting Started

No build step or dependencies required.

1. Download/clone the project, keeping the folder structure intact (the `assets/` folder must sit next to the HTML files)
2. Open `index.html` in any modern browser, or host the folder on any static host (GitHub Pages, Netlify, Vercel) — the pages link to each other with plain relative paths

```bash
git clone <your-repo-url>
cd asahi-kinetic-interface
open index.html
```

> **Note:** The background image, character render, and audio track are loaded from external URLs. For a production build, download and self-host those assets, then update the `src` / `background-image` references in `hero.css` and `index.html`.

## 🧭 Pages

| Page | File | Highlights |
|---|---|---|
| Home | `index.html` | Original kinetic card — parallax character, floating petals, working audio player — plus a 3-card "explore" section |
| Archive | `gallery.html` | 8-tile CSS-drawn gallery, category filter bar, 3D tilt-on-hover |
| Dossier | `profile.html` | Typewriter bio, animated counters, linear stat bars, radial stat rings, vertical timeline |
| Transmission | `contact.html` | Animated signal-wave bars, glowing form fields, fake async submit, social link chips |

## 🛠️ Tech Stack

- **HTML5** — semantic sectioning, native `<audio>`, `<canvas>`
- **CSS3** — custom properties, `conic-gradient` stat rings, `backdrop-filter`, `writing-mode`, keyframe animation throughout
- **JavaScript (ES6+)** — `IntersectionObserver` for scroll reveals/counters/rings, `requestAnimationFrame` loops for particles/parallax/cursor easing, event delegation for filters and forms
- **Google Fonts** — `Noto Sans JP` & `Syncopate`

## 📄 License

This project is open for personal and educational use. Feel free to fork and extend it.

## 👤 Developer

## **MD Atiqul Islam (Atik)**

### 📧 [atik.cmttiu1001@gmail.com]
