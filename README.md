# Spec ADE — Marketing Site

Marketing landing page for **Spec ADE**, built with Astro 6 + Tailwind v4 + Vue 3 islands.

```
web/
├── astro.config.mjs        # Astro + Vite + Tailwind v4 + Vue islands
├── package.json
├── playwright.config.ts    # Playwright test config (chromium)
├── public/                 # Static assets (favicon, og images)
│   └── screenshots/        # TODO: add real screenshots here
├── src/
│   ├── styles/global.css   # Tailwind v4 + Spec ADE design tokens
│   ├── layouts/
│   │   └── BaseLayout.astro  # hreflang alternate links, OG, theme
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── WhatIsSpecAde.astro     # "What is Spec ADE?" explainer + comparison table
│   │   ├── FeaturesRecap.astro     # Feature recap grid (3 columns)
│   │   ├── ScreenshotsPlaceholder.astro
│   │   ├── Architecture.astro
│   │   ├── TechStack.astro
│   │   ├── UseCases.astro
│   │   ├── LicenseModel.astro      # License model mini-section
│   │   ├── FAQ.astro               # 8-item FAQ (topOnly prop shows top 3 + see-all link)
│   │   ├── GetStarted.astro        # Vanilla JS tabs + copy blocks (full version on homepage)
│   │   └── islands/                # Vue 3 client islands (2 only)
│   │       ├── ThemeToggle.vue
│   │       └── TerminalDemo.vue
│   ├── i18n/               # Static translations (en + vi)
│   │   ├── strings.ts
│   │   └── utils.ts
│   └── pages/
│       ├── index.astro     # English (default) — /
│       ├── faq.astro       # English FAQ sub-page — /faq
│       ├── install.astro   # English install guide — /install
│       └── vi/
│           ├── index.astro   # Vietnamese — /vi/
│           ├── faq.astro     # Vietnamese FAQ sub-page — /vi/faq
│           └── install.astro # Vietnamese install guide — /vi/install
├── tests/
│   └── landing.spec.ts     # Playwright smoke + a11y + visual regression
└── tsconfig.json
```

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro 6](https://astro.build) — content-first, zero JS by default |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first via `@theme`) |
| Interactivity | Vue 3 islands via `@astrojs/vue` (2 islands: ThemeToggle, TerminalDemo) |
| Icons | `lucide-vue-next` (matches main app) |
| i18n | Astro built-in `i18n` config — no extra package |
| Testing | Playwright + @axe-core/playwright |
| Deploy | Cloudflare Pages (recommended) — unlimited bandwidth, zero cold start |

## Design system

The site mirrors the Spec ADE app design system from `CLAUDE.md`:

- **No box-shadow**. Depth comes from borders + background contrast.
- Tokens: `--color-bg/surface/raised/border/text/accent`, `--space-xs..xl`, `--radius-xs..xl`.
- Fonts: IBM Plex Sans (system fallback) + Lilex/JetBrains Mono.
- Transitions: 150–300 ms with `cubic-bezier(0.32, 0.72, 0.24, 1)` (Apple-inspired).
- Lucide icons at `:size="16"` `:stroke-width="1.75"`.
- Dark default with light theme via `[data-theme="light"]` and `localStorage` persistence.
- Inline anti-flash script in `<head>` applies the right theme before paint.

## Sections

### Homepage (`/` and `/vi/`)

1. **Hero** — disruptive headline ("Stop using an IDE. Start using an ADE."), dual CTA (Get Started + Learn more → #what-is-spec-ade), animated terminal demo (Vue island). CSS-only noise overlay + animated gradient drift. Subtitle meta line shows tech stack in monospace (Claude Code first).
2. **What is Spec ADE?** — 3-pillar explainer (ADE concept / Specs not prompts / Parallel agents) + comparison table (Traditional IDE vs AI IDE vs Spec ADE). New section between Hero and Features.
3. **Features** — 6-category tabbed section (AI Agents / Editor & Panes / Git / Database / Terminal & System / Cross-platform). Each card shows a plain-language `lead` sentence + technical `detail` in muted color. Killer features marked with `★ Unique` badge. Vanilla JS tab switching with full ARIA keyboard support.
4. **ScreenshotsPlaceholder** — 5 placeholder cards (16/9 aspect ratio, hatched pattern). Replace with real screenshots in `public/screenshots/`.
5. **Architecture** — three layered cards (Frontend / Backend / Storage) plus a protocols sidebar.
6. **TechStack** — language and framework chips.
7. **UseCases** — four developer personas.
8. **FAQ (condensed)** — top 3 Q&A items with a "See all questions →" link to `/faq`.
9. **GetStarted (full)** — all 4 platform tabs, auto-open callout, Node.js prerequisite details, and activation note. The homepage now shows the same full install experience as `/install`.
10. **LicenseModel** — "Free during private beta" — one-paragraph summary linking to the FAQ. Last content section before the footer.

### Sub-pages

- `/faq` and `/vi/faq` — full 8-item FAQ page with back-link to home.
- `/install` and `/vi/install` — full install guide with all 4 platform tabs, Node.js prerequisite details, and activation note.

## Vue islands

Only 2 Vue islands remain (down from 4):

- `ThemeToggle.vue` — dark/light toggle with localStorage persistence
- `TerminalDemo.vue` — animated terminal demo in the hero

`InstallTabs.vue` and `CopyBlock.vue` have been replaced with vanilla HTML + inline `<script>` (~40 lines total). No hydration cost.

## Internationalization

Two locales ship out of the box:

- `/` → English (default, no prefix)
- `/vi/` → Vietnamese

Both share the same components — only `i18n/strings.ts` differs. The header has a one-tap language switcher. `BaseLayout.astro` emits `<link rel="alternate" hreflang="...">` tags for SEO.

To add a third locale:

1. Add it to `astro.config.mjs` → `i18n.locales`.
2. Append a new key to `dict` in `src/i18n/strings.ts` (TypeScript will enforce shape parity with `en`).
3. Create `src/pages/<lang>/index.astro` with `const lang = '<lang>' as const`.

## Develop

```bash
cd web
npm install              # or bun install / pnpm install
npm run dev              # Astro dev server on http://localhost:4321
npm run build            # Production build → dist/
npm run preview          # Preview the production build
```

> Astro 6 requires **Node 22+**. Verify your toolchain before installing.

## Testing

```bash
cd web
npm install
npm run build && npm test              # Run all Playwright tests
npm run test:ui                        # Playwright interactive UI
npm run test:update-snapshots          # Regenerate visual regression snapshots
```

Tests in `web/tests/landing.spec.ts`:

1. `/` returns 200, hero heading visible, primary CTA present
2. `/vi/` returns 200, hero heading visible (Vietnamese)
3. Theme toggle switches `data-theme` attribute on click
4. Install tabs switch panels and update `aria-selected`
5. Language switcher link points to correct alternate
6. axe-core scan on `/` — no critical violations
7. axe-core scan on `/vi/` — no critical violations
8. Visual regression — 3 viewports (375/768/1280) × 2 themes (dark/light) × 2 routes = 12 snapshots
9. `/faq` returns 200 and shows all 8 FAQ items
10. `/install` returns 200 and shows the install command

Run `npm run test:update-snapshots` the first time to generate baseline snapshots.

## Deploy

The site is fully static and ships zero JS unless an island opts in. Recommended host: **Cloudflare Pages**.

```bash
# Cloudflare Pages — connect this repo, set:
#   Build command: cd web && npm install && npm run build
#   Build output:  web/dist
```

Other supported targets: Vercel, Netlify, GitHub Pages, any static host.

## Test affordances

Every interactive element exposes a stable `data-testid` attribute:

- `hero-badge`, `hero-primary-cta`, `hero-secondary-cta`
- `feature-tab-{category}` (ai-agents, editor-panes, git, database, terminal-system, cross-platform)
- `feature-card-{n}`
- `faq-item-{n}`
- `screenshot-placeholder-{n}`
- `license-section`
- `install-tab-{mac|linux|win|source}`
- `copy-button`
- `activation-note`
- `theme-toggle`, `lang-switch`, `header-cta`

## TODO before launch

- [ ] Publish `@spec-ade/cli` on npm (currently the install commands assume the package will exist)
- [ ] Confirm the official viber.vn support contact channel and link it from the footer
- [ ] Add real screenshots to `public/screenshots/` and replace the placeholders in `ScreenshotsPlaceholder.astro`
- [ ] Add OG image to `public/og.png` and wire it in `BaseLayout.astro`
- [ ] Update `astro.config.mjs` `site` URL once the production domain is fixed
- [ ] When the project goes public, restore the GitHub link in Header/Footer and update the FAQ answer about open source
- [ ] Run `npm run test:update-snapshots` to generate baseline visual regression snapshots
- [ ] Update `astro.config.mjs` `site` URL if domain changes from `spec-ade.dev`
- [ ] Run `npm run test:update-snapshots` to generate baseline visual regression snapshots

## What is intentionally missing

- No analytics/tracking (add at deploy time if needed).
- No newsletter form, no third-party widgets — keeps the page fast and tracking-free by default.
- No content management system — copy lives in `src/i18n/strings.ts`. Treat it as code.
