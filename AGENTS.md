# AGENTS.md

Guidance for AI coding assistants working in this repository.

## What this project is

Documentation website for the **[advanced-logger](https://www.npmjs.com/package/advanced-logger)** npm library (isomorphic TypeScript logging for Node.js and browsers). This repo is **not** the logger library itself—that lives at [AlexeyPopovUA/advanced-logger](https://github.com/AlexeyPopovUA/advanced-logger).

- **Live site:** https://www.advancedlogger.com
- **Stack:** Gatsby 5.16, React 18, TypeScript/TSX, Tailwind CSS, SCSS, Netlify CMS
- **Node.js:** 24 (via [mise](https://mise.jdx.dev/) — see `.mise.toml`)
- **Hosting:** AWS Amplify (`amplify.yml`); CI on GitHub Actions (Node 24)

## Repository layout

| Path | Purpose |
|------|---------|
| `src/pages/*.md` | Markdown content; each file becomes a Gatsby page |
| `src/templates/*.tsx` | Page templates selected via frontmatter `template` |
| `src/components/` | Shared UI (`layout`, `nav-menu`, `footer`, `seo`) |
| `src/settings/nav-menu.md` | Site title and nav item order |
| `static/admin/config.yml` | Netlify CMS collections and Git backend |
| `gatsby-node.ts` | Page creation, slug fields, GraphQL schema customization |
| `gatsby-config.ts` | Plugins, filesystem sources, site metadata |

## Commands

```bash
mise install    # Node 24 from .mise.toml
npm ci          # install (use in CI / clean env; legacy-peer-deps via .npmrc)
npm run develop # local dev server (alias: npm start)
npm run build   # production static build → public/
npm run serve   # preview production build
npm run clean   # clear Gatsby cache
npm run typecheck  # tsc --noEmit
npm run format  # Prettier on js/ts/tsx/json/md
npm run local-cms  # Netlify CMS proxy for local editing
```

After changing `gatsby-config.ts`, `gatsby-node.ts`, or adding pages/templates, run `npm run clean` if builds behave oddly.

## How pages are created

1. Add or edit a markdown file under `src/pages/`.
2. Frontmatter **must** include `template` (filename in `src/templates/` without `.tsx`).

Example:

```yaml
---
title: My Page
date: "2026-01-01T00:00:00.000Z"
template: regular-static-page
description: Optional SEO description
---
```

3. `gatsby-node.ts` reads all `src/pages/**/*.md`, sets `fields.slug` via `createFilePath`, and calls `createPage` with `src/templates/{template}.tsx`.

### Templates in use

| `template` value | File | Notes |
|------------------|------|--------|
| `regular-static-page` | `regular-static-page.tsx` | Default docs layout; body from remark HTML |
| `contacts-static-page` | `contacts-static-page.tsx` | Extra frontmatter: `email`, `github`, social links, `author` |
| `releases-page` | `releases-page.tsx` | Fetches `CHANGELOG.md` from advanced-logger repo at runtime |
| `404-page` | `404-page.tsx` | Custom 404 |

New templates: add `src/templates/my-template.tsx` and reference `template: my-template` in frontmatter. Match existing patterns: `Layout`, `Seo`, GraphQL `pageQuery` with `$id: String!`.

## Navigation

Order is **not** alphabetical. Edit `src/settings/nav-menu.md`:

```yaml
ordering:
  - Getting started
  - Service
  # ... titles must match page frontmatter `title` exactly
```

`src/components/nav-menu.tsx` maps `ordering` titles to slugs from `allMarkdownRemark`. Home (`/`) and `/404/` are excluded from the menu.

## Content editing (Netlify CMS)

- Admin UI: `/admin` (requires CMS backend auth in production).
- Config: `static/admin/config.yml` — GitHub repo `AlexeyPopovUA/advanced-logger-guide`, editorial workflow.
- **Note:** CMS field names use legacy `templateKey` widgets; Gatsby actually uses **`template`** in markdown frontmatter. When editing via CMS or by hand, keep frontmatter aligned with what `gatsby-node.ts` and templates expect.

Media uploads go to `static/img` (public URL `/img/...`).

## Styling

- Global: `src/style.css` (imported in `gatsby-browser.ts`)
- Layout-specific: `src/components/layout.scss`
- Utility classes: Tailwind (`tailwind.config.js`, PostCSS via `gatsby-plugin-postcss`)
- Code blocks: Prism theme in `gatsby-browser.ts`

Prefer Tailwind utilities in components; avoid unrelated global CSS changes.

## What to change where

| Task | Where to edit |
|------|----------------|
| Doc copy / examples | `src/pages/*.md` |
| Nav labels or order | `src/settings/nav-menu.md` |
| Header/footer/chrome | `src/components/` |
| Page layout / GraphQL | `src/templates/` |
| Site title, URL, plugins | `gatsby-config.ts` |
| Routing / slugs / schema | `gatsby-node.ts` |

Do **not** implement logger library features here unless explicitly asked—point users to the advanced-logger repo.

## Code conventions

- Match existing style: functional React components in newer templates; class component only on `releases-page`.
- TypeScript in templates; `gatsby-config.ts` / `gatsby-node.ts` remain CommonJS `module.exports`.
- Run `npm run format` after editing formatted file types.
- No test suite today (`npm test` is a placeholder)—verify with `npm run build`.
- Keep diffs minimal; do not upgrade Gatsby/React dependencies unless requested.

## Deployment

- **Amplify:** `npm ci` → `npm run build`; artifacts from `public/`.
- **GitHub Actions:** `.github/workflows/feature-branch-build.yml` on push (skips commits containing `(skip-ci)`).
- CMS commits may use `chore(skip-ci):` for media-only updates.

## Pitfalls

- `template` in markdown must match an existing file in `src/templates/`.
- Nav `ordering` entries must match page `title` strings exactly.
- `releases-page` depends on network access to GitHub raw `CHANGELOG.md`.
- Site metadata typo in config: `siteUrl` uses `advacedlogger.com` (missing “n”)—fix only if intentional site change is requested.
