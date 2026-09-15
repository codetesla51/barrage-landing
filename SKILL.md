---
name: barrage-landing
description: Work on the barrage landing page — static marketing site for the barrage load-testing CLI. Use when editing copy, sections, screenshots, SEO, or the install command in this repo.
---

# Barrage-landing skill

Static landing page for [barrage](https://github.com/codetesla51/barrage)
(sibling checkout: `../barrage`). No framework, no build step: one
`index.html`, one `styles.css`, one dependency-free `app.js`. Deployed to
GitHub Pages from the repo root.

## Run / preview / ship

```sh
python3 -m http.server 8890   # open http://localhost:8890
```

No bundling, no tests — preview in a real browser (mobile width too) and ship.
CDN deps (fonts, Phosphor, daisyUI, Tailwind browser) need network; a blank
unstyled page in preview means the CDN didn't load, not that you broke CSS.

## Stack (don't change without reason)

- **daisyUI 5 + Tailwind CSS v4 browser build** via CDN (`@tailwindcss/browser@4`).
  There is no tailwind config file — utility classes compile in the browser.
  Use daisyUI component classes (`btn`, `term` is custom, `card`…) per the
  daisyUI skill, not hand-rolled CSS, for anything daisyUI already provides.
- **Fonts:** Geist Variable + Geist Mono (Fontsource CDN). Mono for terminals,
  numbers, eyebrows.
- **Icons:** Phosphor Regular webfont (`ph ph-*`). Never emoji.
- **Theme:** dark monochrome (`#0d0d0d` base) + ONE amber accent (`#e8a33d`,
  reserved for the cursor `_`, eyebrows, key highlights). No gradients, no glow,
  no shadows-as-decoration — flat and quiet. Light theme is not supported
  (`color-scheme: dark`).

## Page anatomy (`index.html`, ~624 lines)

Hero → `#sim` live-run simulator → real terminal output + report shots →
`#how` → `#bottleneck` → `#scenarios` → `#load` → `#regression` →
`#webui` (embedded-app showcase, `webui-shot.png`) → `#scope`
(when-to-use / not-use) → `#install` → footer.

- Terminal windows: `.term > .term-bar (dots + .term-title) + pre > code`.
  Copy buttons are auto-injected by `app.js` from this structure — keep it.
- Scroll reveal: add `class="reveal"` to new sections; observer lives in `app.js`.
- Simulator (`#sim`): typed-run animation, data + timing in `app.js`
  ("simulated barrage run"). Respect `prefers-reduced-motion` like the
  existing code does.
- `app.js` modules: github stars (cached 1h, failures silent) · copy buttons ·
  scroll reveal · simulator · mobile menu. Plain IIFE, `var`, no deps.

## The install block (house rule — do not regress)

The install command is a one-liner that **downloads the latest binary**. It
must stay that way: no `go install` as the primary path, no version pins, no
flag soup. Source of truth is `../barrage/install.sh` (fetches the newest
`barrage-<os>-<arch>` asset from GitHub releases, no Go needed).

```html
curl -fsSL https://raw.githubusercontent.com/codetesla51/barrage/main/install.sh | bash
```

It appears twice — hero terminal and `#install` figure. Update both together.
Figcaption reads "downloads the latest binary for your platform — no Go
needed" and links manual downloads to
`https://github.com/codetesla51/barrage/releases/latest`. If `install.sh`'s URL
or release asset names change upstream, these two blocks are the blast radius.

## Images (repo root, committed)

| File | Used as |
|---|---|
| `og-image.png` (1200×630) | social card (`og:image`, twitter) |
| `todo-api-run-1/2.png` | real report screenshots (mirror `../barrage/docs/`, keep in sync) |
| `webui-shot.png` | `#webui` showcase — retake via `barrage web` when the app UI changes |

Keep images optimized (`< ~500KB` except the showcase shot); reference them
relatively so forks and Pages both work.

## SEO / meta checklist (touch on every visible change)

Head holds: title, description, canonical, OG + Twitter cards, JSON-LD
`SoftwareApplication`, favicon (inline SVG data URI), `theme-color`,
`google-site-verification`. `sitemap.xml` + `robots.txt` exist — bump
sitemap `lastmod` when shipping. `#install` headings carry the keywords
("install", "load testing"); don't rename section ids — they're deep-linked.

## Copy voice

Terse, concrete, no hype adjectives. Numbers over claims
("HTTP + SQLite + Redis at ~4x", not "blazingly fast"). Terminal-first:
show the command, then one line saying what lands where.

## Pitfalls

- Tailwind v4 browser + daisyUI version pins in `<head>` — upgrade both
  together, re-preview every section.
- `.term pre` content is copied verbatim by the copy button — keep commands
  single-line and paste-safe (no line continuations in hero).
- Stars widget degrades silently offline; don't "fix" it into a blocking fetch.
- GitHub Pages serves from root — never add a build output dir or absolute
  `/` asset paths.
