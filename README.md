# barrage — landing page

Landing page for [barrage](https://github.com/codetesla51/barrage), an open-source
load testing and performance investigation CLI.

Static site: HTML + CSS + a small vanilla JS file. Built with daisyUI 5 +
Tailwind 4 (browser CDN), Geist / Geist Mono, Phosphor icons. No build step.

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
  Dark monochrome + one amber accent, Phosphor icons, no emoji.
- Install block stays a one-liner downloading the latest binary (source
  of truth: `../barrage/install.sh`). It appears twice — hero terminal
  and `#install` — update both together.
- `todo-api-run-1/2.png` mirror `../barrage/docs/`; retake
  `webui-shot.png` via `barrage web` when the app UI changes.
- Bump `sitemap.xml` `lastmod` on visible changes; don't rename section
  ids (deep-linked).
