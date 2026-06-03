# AGENTS.md

Guidance for AI coding assistants working in this repository.

## What this project is

Documentation website for the **[advanced-logger](https://www.npmjs.com/package/advanced-logger)** npm library (isomorphic TypeScript logging for Node.js and browsers). This repo is **not** the logger library itself—that lives at [AlexeyPopovUA/advanced-logger](https://github.com/AlexeyPopovUA/advanced-logger).

- **Live site:** https://www.advancedlogger.com
- **Stack:** Gatsby 5.16, React 19, TypeScript 6, Tailwind CSS v4, SCSS, Decap CMS
- **Node.js:** 24 (via [mise](https://mise.jdx.dev/) — see `.mise.toml`)
- **Hosting:** AWS Amplify (`amplify.yml`, **Amazon Linux 2023** build image required for Node 24); CI on GitHub Actions (Node 24)

## Repository layout

| Path                       | Purpose                                                  |
| -------------------------- | -------------------------------------------------------- |
| `src/pages/*.md`           | Markdown content; each file becomes a Gatsby page        |
| `src/templates/*.tsx`      | Page templates selected via frontmatter `template`       |
| `src/components/`          | Shared UI (`layout`, `nav-menu`, `footer`, `seo`)        |
| `src/settings/nav-menu.md` | Site title and nav item order                            |
| `static/admin/config.yml`  | Netlify CMS collections and Git backend                  |
| `gatsby-node.ts`           | Page creation, slug fields, GraphQL schema customization |
| `gatsby-config.ts`         | Plugins, filesystem sources, site metadata               |
| `gatsby-types.d.ts`        | TypeScript declarations for CSS/SCSS imports             |
| `scripts/visual-check.mjs` | Optional Playwright screenshot/check script              |

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
node scripts/visual-check.mjs  # optional; needs dev server on :8000
```

After changing `gatsby-config.ts`, `gatsby-node.ts`, or adding pages/templates, run `npm run clean` if builds behave oddly.

**Verify changes:** `npm run typecheck` → `npm run develop` or `npm run build`. Use `scripts/visual-check.mjs` (with `BASE_URL`) for rendered-page checks.

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

| `template` value       | File                       | Notes                                                             |
| ---------------------- | -------------------------- | ----------------------------------------------------------------- |
| `regular-static-page`  | `regular-static-page.tsx`  | Default docs layout; body from remark HTML                        |
| `contacts-static-page` | `contacts-static-page.tsx` | Extra frontmatter: `email`, `github`, social links, `author`      |
| `releases-page`        | `releases-page.tsx`        | Fetches `CHANGELOG.md` from GitHub; renders with `marked.parse()` |
| `404-page`             | `404-page.tsx`             | Custom 404                                                        |

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

- Global: `src/style.css` — Tailwind v4 via `@import "tailwindcss"` and `@source` (no `tailwind.config.js`)
- PostCSS: `postcss.config.js` uses `@tailwindcss/postcss` (via `gatsby-plugin-postcss`)
- Layout-specific: `src/components/layout.scss`
- Code blocks: Prism theme in `gatsby-browser.ts`

Prefer Tailwind utility classes in components; avoid unrelated global CSS changes. To scan new file types for utilities, extend `@source` in `src/style.css`.

## What to change where

| Task                     | Where to edit              |
| ------------------------ | -------------------------- |
| Doc copy / examples      | `src/pages/*.md`           |
| Nav labels or order      | `src/settings/nav-menu.md` |
| Header/footer/chrome     | `src/components/`          |
| Page layout / GraphQL    | `src/templates/`           |
| Site title, URL, plugins | `gatsby-config.ts`         |
| Routing / slugs / schema | `gatsby-node.ts`           |

Do **not** implement logger library features here unless explicitly asked—point users to the advanced-logger repo.

## Code conventions

- Match existing style: functional React components in newer templates; class component only on `releases-page`.
- TypeScript in templates; `gatsby-config.ts` / `gatsby-node.ts` remain CommonJS `module.exports`.
- `tsconfig.json` uses `moduleResolution: bundler` (TypeScript 6); CSS side-effect imports declared in `gatsby-types.d.ts`.
- Run `npm run format` after editing formatted file types.
- No test suite today (`npm test` is a placeholder)—verify with `typecheck` and `build`.
- Keep diffs minimal. Use `npm run update-dependencies` to bump versions; re-run `typecheck` and `build` after upgrades.

## Deployment

- **Amplify:** `npm ci` → `npm run build`; artifacts from `public/`. Build cache: `~/.npm`, `.cache`, `public` (not `node_modules` — `npm ci` wipes it). Incremental builds: `GATSBY_EXPERIMENTAL_PAGE_BUILD_ON_DATA_CHANGES=true`.
- **GitHub Actions:** `.github/workflows/feature-branch-build.yml` on push (skips commits containing `(skip-ci)`). Caches npm via `setup-node` and Gatsby `.cache`/`public` via `actions/cache`.
- CMS commits may use `chore(skip-ci):` for media-only updates.

## Pitfalls

- `template` in markdown must match an existing file in `src/templates/`.
- Nav `ordering` entries must match page `title` strings exactly.
- `releases-page` depends on network access to GitHub raw `CHANGELOG.md`.
- **Decap CMS** uses `gatsby-plugin-decap-cms` with `customizeWebpackConfig` to bundle CMS + React (no UMD script tags). Verify `/admin` after CMS or React upgrades.
- SEO uses **Gatsby Head** (`SeoHead` in `src/components/seo.tsx`), not `react-helmet`.
- **`graphql` override** (`^16.14.1` in `package.json`) keeps a single GraphQL version for Gatsby + Decap; removing it can break `gatsby build` schema generation.
- Direct **`ajv@8`** dependency is required for webpack/`ajv-keywords` resolution; do not remove without verifying `npm run build`.
- `siteUrl` in `gatsby-config.ts` must match the live domain (`https://www.advancedlogger.com`) for sitemap and canonical URLs.
