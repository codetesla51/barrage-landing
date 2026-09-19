# barrage — landing page

Landing page for [barrage](https://github.com/codetesla51/barrage), an open-source
load testing and performance investigation CLI.

Single page, no scroll sections. Dark by default (`#0d0d0d` background,
same ramp as the barrage report), light via `prefers-color-scheme`,
with one deep amber accent (deeper than the report's `#e8a33d`;
darkened further in light mode for contrast) reserved for spike highlights,
the install prompt, and link hovers. No header, no nav, no logo, no
grain, no watermark. All text in Geist / Geist Mono (Google Fonts). One
self-contained `index.html` (inline CSS + JS), no build step.

## Develop

```sh
python3 -m http.server 8890
# open http://localhost:8890
```

## Deploy

Any static host works. GitHub Pages is wired for the root of this repo.

## Agents

AI agents working in this repo: follow the barrage skill at
[../barrage/SKILL.md](../barrage/SKILL.md) — it is the single source of
truth for the CLI (install command, run output, report contents,
screenshots, web UI behavior, version). There is no local skill file;
do not substitute any other skill for barrage facts.

Landing house rules (mirror the barrage repo, don't drift):

- Preview with `python3 -m http.server 8890`; no build step, no tests.
  Dark-only tokens at the top of `index.html` (inline `<style>`),
  single deep-amber accent, no emoji, no gradients, no glow, no shadows.
- The page has no header and no nav; no logo. The GitHub repo link lives
  in the body (small mono line under the install block, live star count
  fetched once, cached 1h in localStorage) and again in the footer.
  The install command sits right under the headline in a one-line bar.
  The run demo streams its rows like a live run once on scroll
  (frozen fully visible under reduced motion or no JS); replay re-runs it.
  Below it, a Chart.js timeline (same setup as the barrage report: unfilled
  tensioned lines, db in accent) draws the spike the table names.
- The install block stays a one-liner downloading the latest binary
  (source of truth: `../barrage/install.sh`). It appears exactly once.
  The copy button reads the command from the DOM, so there is no second
  copy to keep in sync.
- Bump `sitemap.xml` `lastmod` on visible changes. Single-page hero:
  don't add sections below the fold.