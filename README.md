# Portfolio

A minimalist, dark-only portfolio in the "dark editorial" register: near-black
canvas, one accent colour, Geist Sans for prose and Geist Mono for the small
labels (`01 / WORK`, years, stack chips). Projects live as MDX files validated
with Zod, so a broken case study fails the build instead of the page.

**Stack:** Next.js 16 (App Router, Turbopack) · React 19 · TypeScript ·
Tailwind CSS 4 · motion · MDX + Zod. Deploys to Vercel with no configuration.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Then edit [`content/site.ts`](content/site.ts) — name, role, email, socials and
URL all come from that one file. Nothing else hardcodes your identity.

| Script                  | What it does                                                        |
| ----------------------- | ------------------------------------------------------------------- |
| `npm run dev`           | Dev server                                                           |
| `npm run build`         | Production build (prerenders every project page and OG image)        |
| `npm run lint`          | ESLint                                                               |
| `npm run typecheck`     | `tsc --noEmit`                                                       |
| `npm run placeholders`  | Generates stand-in PNGs for any project image you haven't shot yet   |

---

## Adding a new project

### 1. Create the MDX file

Add `content/projects/<slug>.mdx`. **The filename is the slug** — it becomes
`/work/<slug>`, so keep it lowercase and hyphenated.

```mdx
---
title: My New Project
description: One sentence, under 240 characters, that says what it is.
year: 2026
stack:
  - Next.js
  - PostgreSQL
cover: /projects/my-new-project/cover.png
images:
  - src: /projects/my-new-project/detail.png
    alt: The scheduling view with a week selected
    caption: Optional caption rendered under the screenshot.
liveUrl: https://example.com
repoUrl: https://github.com/you/my-new-project
featured: false
order: 4
---

## Context

Why the project exists, in a paragraph.

## What I built

- The parts worth pointing at.
- Written as claims you could defend in an interview.

<Note>An aside for a caveat or a constraint worth flagging.</Note>
```

### 2. Add the screenshots

Put real images in `public/projects/<slug>/`, matching the paths in the
frontmatter. Anything wide works; the layout is built around roughly 16:10.

Don't have screenshots yet? Run:

```bash
npm run placeholders
```

It reads every `cover` and `images` path in your MDX and generates an abstract
dark placeholder for the ones that don't exist. Existing files are never
overwritten (pass `--force` if you want them regenerated).

### 3. That's it

The home page picks the project up automatically. There is no registry file to
update and no index to rebuild.

### Frontmatter reference

Validated by `projectFrontmatterSchema` in [`lib/projects.ts`](lib/projects.ts).

| Field         | Type                        | Required | Notes                                                                     |
| ------------- | --------------------------- | -------- | ------------------------------------------------------------------------- |
| `title`       | string                      | yes      | Shown on the card, the detail page and the OG image                        |
| `description` | string (≤ 240 chars)        | yes      | Card copy and `<meta name="description">`                                  |
| `year`        | number                      | yes      | Displayed as a mono label                                                  |
| `stack`       | string[] (≥ 1)              | yes      | Rendered as chips; the first three appear in the detail page eyebrow       |
| `cover`       | path under `public/`        | yes      | Must start with `/`. This is the image that morphs into the detail page    |
| `images`      | array                       | no       | Strings, or objects with `src` / `alt` / `caption`. Becomes the gallery    |
| `liveUrl`     | URL                         | no       | Renders a "Live site" link                                                 |
| `repoUrl`     | URL                         | no       | Renders a "Source" link                                                    |
| `featured`    | boolean (default `false`)   | no       | Sorts first and spans the full grid width                                  |
| `order`       | number (default `100`)      | no       | Lower sorts earlier                                                        |

Sorting is `featured` first, then `order`, then most recent `year`, then title.

Two things fail the build on purpose, rather than shipping a broken page:
frontmatter that doesn't match the schema, and a `cover`/`images` path with no
file behind it. The error names the file and the problem.

### Components available inside MDX

- `<Note>…</Note>` — accented aside.
- `<Figure src="/projects/slug/shot.png" alt="…" caption="…" />` — an optimised
  screenshot with an optional caption. Plain Markdown `![alt](src)` maps to the
  same component.

Everything else (headings, lists, links, code) is styled in
[`components/mdx.tsx`](components/mdx.tsx).

---

## Person or company

`content/site.ts` exports `mode: "person" | "company"`. Flip it and the About
section renders the studio copy from `about.company` instead of `about.person`,
the section label changes, and the JSON-LD switches from `Person` to
`Organization`. Both copies live side by side, so switching back loses nothing.

---

## Design system

All tokens are Tailwind 4 `@theme` variables in
[`app/globals.css`](app/globals.css) — there is no `tailwind.config.js`.

| Token                    | Value     | Used for                              |
| ------------------------ | --------- | ------------------------------------- |
| `--color-bg`             | `#0a0a0a` | Page background                       |
| `--color-fg`             | `#ededed` | Primary text                          |
| `--color-muted`          | `#a0a0a0` | Body copy                             |
| `--color-faint`          | `#6a6a6a` | Mono labels                           |
| `--color-line`           | `#212121` | Hairlines and borders                 |
| `--color-accent`         | `#ff6a3d` | The single accent                     |

To rebrand, change `--color-accent` — it propagates to links, hover states, the
hero glow, the card spotlight, the favicon-adjacent icon and the OG images
(the OG palette is duplicated in [`lib/og.tsx`](lib/og.tsx), since Satori can't
read CSS variables).

Two utilities are defined alongside the tokens: `label` (the mono eyebrow) and
`rule` (a hairline that fades out at both ends).

This is a **dark-only** site. There is no theme toggle, no `light:` variants,
and `color-scheme: dark` is set globally.

---

## Motion

Every animation lives in a client component and degrades to nothing under
`prefers-reduced-motion`.

- **Hero** (`components/hero.tsx`) — headline lines reveal with a `clip-path`
  wipe on a stagger, eyebrow and CTA fade in behind them.
- **`<Reveal>`** (`components/reveal.tsx`) — the one scroll-reveal primitive,
  built on `whileInView`. Takes `delay`, `distance`, `amount` and `repeat`.
- **Project cards** (`components/project-card.tsx`) — a radial spotlight follows
  the cursor by writing `--spot-x` / `--spot-y` straight to the node, so
  pointer movement never triggers a React render.
- **Route transitions** — the project cover is wrapped in React's
  `<ViewTransition>` on both the card and the detail page with a matching
  `name`, so it morphs across the navigation.

Reduced motion is handled twice over: `<MotionConfig reducedMotion="user">`
stops motion from animating transforms, and a CSS block neutralises any
`[data-motion]` element's `opacity` / `transform` / `clip-path` with
`!important` — which also covers the no-JS case, since elements are
server-rendered in their pre-animation state.

There is no smooth-scroll library, and no scroll hijacking.

---

## SEO

- Metadata, canonical URLs, Open Graph and Twitter cards derive from
  `content/site.ts` (`app/layout.tsx`).
- Dynamic OG images: `app/opengraph-image.tsx` for the site,
  `app/work/[slug]/opengraph-image.tsx` per project — both rendered with
  `next/og` in real Geist, prerendered at build.
- `app/sitemap.ts` and `app/robots.ts` enumerate every project automatically.
- JSON-LD (`Person` or `Organization`) in the root layout.

Set `site.url` before deploying; it drives every absolute URL.

---

## Deploying to Vercel

Import the repository — the defaults are correct, and no environment variables
are needed. Everything is statically prerendered, including both OG image
routes.

For any other host: `npm run build && npm start` (Node 20.9+).

---

## Project structure

```
app/
  layout.tsx                     root shell, metadata, JSON-LD
  page.tsx                       hero → work → about → contact
  globals.css                    theme tokens, base styles, reduced motion
  opengraph-image.tsx            site OG card
  sitemap.ts  robots.ts  icon.svg
  work/[slug]/
    page.tsx                     case study + view transition
    opengraph-image.tsx          per-project OG card
components/                      sections and motion primitives
content/
  site.ts                        you: name, mode, copy, links
  projects/*.mdx                 one file per project
lib/
  projects.ts                    fs + gray-matter + Zod
  og.tsx                         shared OG card layout
public/projects/<slug>/          screenshots
scripts/generate-placeholders.mjs
```

---

## A note on the seeded content

The three projects (XtreamPlayerPro, Balloons Decorale 2.0, Budget-Travellers)
ship with placeholder copy, placeholder links and generated placeholder images
so the site looks complete on first run. Replace the copy with your own, and
swap the images for real screenshots — there are no invented metrics anywhere,
and it's worth keeping it that way.
