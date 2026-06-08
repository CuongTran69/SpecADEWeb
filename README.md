<div align="center">

# Spec ADE — Website

The marketing and documentation site for **Spec ADE**, the Agentic Development Environment.

Built with **Astro 6** · **Tailwind CSS v4** · **Vue 3 islands** · fully bilingual (EN / VI)

[**Live site → iamdev.io.vn**](https://iamdev.io.vn)

</div>

---

## What is this?

This repository is the **public website** for [Spec ADE](https://iamdev.io.vn) — it is not the product itself.

Spec ADE is an AI-native development environment shipped as a single Rust binary. Instead of bolting AI suggestions onto a text editor, it gives AI agents direct, supervised control over the terminal, file tree, Git, and databases. You set the goals; agents run the loops.

This site markets the product, hosts its documentation, and showcases its capabilities. It is a fast, static, tracking-free Astro site with two small Vue islands and a full Vietnamese mirror of every page.

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro 6](https://astro.build) — content-first, zero JS by default |
| Interactivity | Vue 3 islands via `@astrojs/vue` |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first via `@theme`, no config file) |
| Icons | `lucide-vue-next` (matches the main app) |
| i18n | Astro built-in `i18n` config — no extra package |
| Testing | Playwright + `@axe-core/playwright` (smoke, a11y, visual regression) |
| Deploy | Cloudflare Pages → custom domain `iamdev.io.vn` |

> Astro 6 requires **Node 22+**. Verify your toolchain before installing.

## Quick start

```bash
npm install
npm run dev              # Astro dev server → http://localhost:4321
npm run build            # Production build → ./docs/ (runs sync:kit-manifest first)
npm run preview          # Preview the production build
```

## Project structure

```
SpecADEWeb/
├── astro.config.mjs          # Astro + Vue + Tailwind v4; site URL, i18n, outDir './docs'
├── playwright.config.ts      # Playwright config (chromium, port 4321)
├── public/                   # Static assets (favicon)
├── scripts/
│   └── sync-kit-manifest.mjs # Reads ~/.claude/agents + ~/.claude/skills → kit-manifest.json
├── src/
│   ├── styles/
│   │   ├── global.css        # Tailwind v4 import + design tokens + utilities
│   │   └── kit.css           # Kit page styles
│   ├── layouts/
│   │   ├── BaseLayout.astro  # HTML shell: SEO, hreflang, anti-flash theme, skip link
│   │   └── DocsLayout.astro  # Docs shell: sidebar + table of contents
│   ├── components/
│   │   ├── Header / Footer / Hero / Pricing / FAQ / KeyFeatures / ...
│   │   ├── MultiAgent / GoalShowcase / PortForwarding / ContextEngine
│   │   ├── spotlights/       # SpotlightClaw, SpotlightDb, SpotlightDesign
│   │   ├── docs/             # DocsSidebar, DocsToc, DocsSearch (Vue), DocsCopyIsland (Vue), ...
│   │   ├── kits/             # KitBlock, KitSkillsGrid, KitSubagentsGrid, KitChangelog, ...
│   │   └── islands/
│   │       └── TerminalDemo.vue  # Animated hero terminal (Vue island)
│   ├── pages/                # Routes (see table below) — every page mirrored under /vi/
│   ├── i18n/
│   │   ├── strings.ts        # Single source of all copy — `en` + `vi`, typed identically
│   │   ├── docs.ts           # All docs content as a bilingual Block DSL
│   │   └── utils.ts          # i18n helpers (e.g. swapLangPath)
│   ├── data/
│   │   ├── kit-manifest.json # Generated; subagent + skill metadata
│   │   ├── kit-manifest.ts   # Types + accessors for the manifest
│   │   └── openspec-friendly-content.ts
│   └── lib/                  # docs-render, render-agent-md, render-changelog
├── tests/
│   └── landing.spec.ts       # Playwright smoke + a11y + visual regression
├── docs/                     # Build output (committed; served by Cloudflare Pages)
├── openspec/                 # OpenSpec change specs + ui-dna.md (planning artifacts)
└── user-guide/               # Source markdown for the in-app product guide (not rendered here)
```

## Pages & routing

English is the default locale (no prefix). Every route below is mirrored under `/vi/` for Vietnamese.

| Route | Purpose |
|-------|---------|
| `/` | Homepage — Hero, What is Spec ADE, Trust row, Key Features, Pricing |
| `/features` | Deep dive — Multi-Agent hub, Goal Showcase, Port Forwarding, Spotlights (Claw / DB / Design), Features recap |
| `/install` | Install guide — `npx` command variants for macOS / Linux / Windows / VPS, Node.js prerequisites |
| `/faq` | 8-item FAQ accordion |
| `/kits` | OpenSpec Friendly Kit — lists skills and subagents from `kit-manifest.json` |
| `/context-engine` | The viber.vn Context Engine (a separate open-source tool) |
| `/docs/[slug]` | Documentation site — 13 pages across 4 nav groups, rendered from the Block DSL in `src/i18n/docs.ts` |

## Documentation site

The `/docs` route is a full documentation site (sidebar + table of contents) rendered by `DocsLayout.astro`. There are **no Markdown files** — all docs content lives as a typed, bilingual Block DSL in `src/i18n/docs.ts` and is rendered to HTML by `src/lib/docs-render.ts`. `DocsSearch.vue` and `DocsCopyIsland.vue` hydrate as Vue islands.

## Internationalization

Two locales ship out of the box:

- `/` → English (default, no language prefix)
- `/vi/` → Vietnamese

Both locales share the same components — only `i18n/strings.ts` and `i18n/docs.ts` differ. The `vi` export is typed as `typeof en`, so **TypeScript enforces that every English key has a Vietnamese translation**. The header has a one-tap language switcher, and `BaseLayout.astro` emits `<link rel="alternate" hreflang="...">` tags for SEO.

To add a third locale:

1. Add it to `astro.config.mjs` → `i18n.locales`.
2. Add a matching key to the dictionaries in `src/i18n/strings.ts` (TypeScript enforces shape parity with `en`).
3. Create `src/pages/<lang>/index.astro` and the rest of the page mirror.

## Vue islands

The site is almost entirely zero-JS, server-rendered HTML. Only a handful of components hydrate in the browser:

- `TerminalDemo.vue` — animated terminal in the hero, IntersectionObserver-gated.
- `ThemeToggle.vue` — dark / light toggle with `localStorage` persistence.
- `DocsSearch.vue` / `DocsCopyIsland.vue` — search and copy buttons on the docs site.

Interactive showcase simulations (Goal loop, Port Forwarding, Multi-Agent hub) use small inline `<script>` blocks that re-bind on `astro:after-swap`.

## Design system

The site mirrors the Spec ADE app design system, defined entirely in `src/styles/global.css` via Tailwind v4's `@theme {}` block:

- **Tokens** — `--color-*`, `--spacing-*`, `--radius-*`, `--ease-*` CSS custom properties.
- **Themes** — dark-first (`:root, [data-theme="dark"]`) with full light mode (`[data-theme="light"]`), toggled via the `data-theme` attribute on `<html>` and persisted in `localStorage` (`spec-ade-web:theme`).
- **Anti-flash** — an inline script in `<head>` applies the stored theme before first paint.
- **Typography** — IBM Plex Sans (`--font-sans`) + Lilex / JetBrains Mono (`--font-mono`).
- **Depth** — borders and background levels rather than heavy shadows.
- **Motion** — CSS `animation-timeline: view()` where supported, IntersectionObserver fallback otherwise, and `prefers-reduced-motion` fully respected.

The full design reference lives in [`openspec/ui-dna.md`](openspec/ui-dna.md).

## Kits page & manifest sync

The `/kits` page is powered by `src/data/kit-manifest.json`, generated from your local Claude kit install:

```bash
npm run sync:kit-manifest   # Read ~/.claude/agents + ~/.claude/skills → kit-manifest.json
```

This runs automatically as a `prebuild` hook before every `npm run build`. The generated JSON is committed so CI builds stay in sync without a local kit install. Re-run it after changing local kit files, then commit `src/data/kit-manifest.json`.

## Testing

```bash
npm run build && npm test          # Run all Playwright tests (build first)
npm run test:ui                    # Playwright interactive UI mode
npm run test:update-snapshots      # Regenerate visual regression baselines
```

Playwright automatically launches `npm run preview` on port 4321 as its web server. `tests/landing.spec.ts` covers:

- `/` and `/vi/` return 200 with a visible hero heading and correct primary CTA.
- Theme toggle flips the `data-theme` attribute; language switcher points to the correct alternate.
- axe-core accessibility scan on `/` and `/vi/` — no critical violations.
- Visual regression — 3 viewports (375 / 768 / 1280) × 2 themes × 2 routes.
- Homepage shows 6 key feature cards and both pricing plans; `/faq` shows all 8 items; `/features` renders all showcase sections.
- Goal Showcase simulation runs to completion.

Stable `data-testid` attributes are attached to all interactive elements (CTAs, nav toggle, FAQ items, feature cards, theme toggle, language switcher) for reliable selectors.

## Deploy

The site is fully static and served from **Cloudflare Pages**, mapped to `iamdev.io.vn`. The build writes to `./docs/` (set via `outDir` in `astro.config.mjs`), and that folder is committed so Cloudflare Pages serves it directly.

Cloudflare Pages settings:

- **Build command**: `npm run build`
- **Build output directory**: `docs`
- **Custom domains**: `iamdev.io.vn`, `www.iamdev.io.vn`

Pushing to `main` triggers a deployment automatically.

## What is intentionally missing

- No runtime environment variables — the site is fully static, no `.env` needed.
- No analytics, tracking, newsletter form, or third-party widgets — fast and tracking-free by default.
- No CMS — all copy lives in `src/i18n/strings.ts` and `src/i18n/docs.ts`. Treat it as code.

## Related

- `user-guide/` — source Markdown for the in-app product user guide (12 chapters). These are product docs consumed elsewhere, not rendered by this site.
- `openspec/` — OpenSpec change specs and the `ui-dna.md` design reference (planning artifacts, not shipped).

---

<div align="center">

Built by the [viber.vn](https://iamdev.io.vn) team.

</div>
