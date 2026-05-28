# Spec ADE — Marketing Site

Marketing landing page for **Spec ADE**, built with Astro 6 + Tailwind v4 + Vue 3 islands.

```
SpecADEWeb/
├── astro.config.mjs        # Astro + Vite + Tailwind v4 + Vue islands; base '/SpecADEWeb', outDir './docs'
├── package.json
├── playwright.config.ts    # Playwright test config (chromium)
├── public/                 # Static assets (favicon)
├── src/
│   ├── styles/global.css   # Tailwind v4 + Spec ADE design tokens
│   ├── layouts/
│   │   └── BaseLayout.astro  # SEO meta, hreflang alternates, anti-flash theme
│   ├── components/
│   │   ├── Header.astro / Footer.astro / SubpageHeader.astro / BrandMark.astro
│   │   ├── Hero.astro              # Disruptive headline, CopyBlock, Vue terminal demo
│   │   ├── WhatIsSpecAde.astro     # 3-pillar explainer + comparison table
│   │   ├── TrustRow.astro          # 4-stat trust signals
│   │   ├── KeyFeatures.astro       # 6 cards linking to /features#<id>
│   │   ├── Pricing.astro           # Free Core + Coming Soon Gateway
│   │   ├── FAQ.astro               # 8-item accordion (topOnly slices to 3)
│   │   ├── GetStarted.astro        # Install methods + Node.js prerequisite details
│   │   ├── FeaturesRecap.astro     # Tag-grid recap of remaining capabilities
│   │   ├── MultiAgent.astro        # Interactive agent connection hub
│   │   ├── GoalShowcase.astro      # Coder ↔ Watcher loop simulation
│   │   ├── PortForwarding.astro    # Cloudflare tunnel + Access Key flow
│   │   ├── Spotlight.astro         # Shared layout primitive
│   │   ├── spotlights/
│   │   │   ├── SpotlightClaw.astro     # Telegram-controlled agent farm
│   │   │   ├── SpotlightDb.astro       # Database console with 6 drivers
│   │   │   └── SpotlightDesign.astro   # AI design prototyping workspace
│   │   ├── CopyBlock.astro / Icon.astro
│   │   └── islands/                # Vue 3 client islands
│   │       ├── ThemeToggle.vue
│   │       └── TerminalDemo.vue
│   ├── i18n/               # Static translations (en + vi)
│   │   ├── strings.ts
│   │   └── utils.ts
│   └── pages/
│       ├── index.astro        # English (default) — /
│       ├── faq.astro          # English FAQ — /faq
│       ├── install.astro      # English install guide — /install
│       ├── features.astro     # English full features — /features
│       └── vi/                # Vietnamese mirror
├── tests/
│   └── landing.spec.ts        # Playwright smoke + a11y + visual regression
└── tsconfig.json
```

## Stack

| Layer | Choice |
|-------|--------|
| Framework | [Astro 6](https://astro.build) — content-first, zero JS by default |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) (CSS-first via `@theme`) |
| Interactivity | Vue 3 islands via `@astrojs/vue` (ThemeToggle, TerminalDemo) |
| Icons | `lucide-vue-next` (matches main app) |
| i18n | Astro built-in `i18n` config — no extra package |
| Testing | Playwright + @axe-core/playwright |
| Deploy | Cloudflare Pages with custom domain |

## Design system

The site mirrors the Spec ADE app design system:

- Tokens: `--color-bg/surface/raised/border/text/accent`, `--space-xs..xl`, `--radius-xs..xl`.
- Fonts: IBM Plex Sans (system fallback) + Lilex/JetBrains Mono.
- Transitions: 150–300 ms with `cubic-bezier(0.32, 0.72, 0.24, 1)` (Apple-inspired).
- Lucide icons at `:size="16"` `:stroke-width="1.75"`.
- Dark default with light theme via `[data-theme="light"]` and `localStorage` persistence.
- Inline anti-flash script in `<head>` applies the right theme before paint.
- Subtle `box-shadow` is used for elevated surfaces (cards, callouts, modals); flat sections rely on borders alone.

## Sections

### Homepage (`/` and `/vi/`)

1. **Hero** — disruptive headline, install copy block, dual CTA (Get Started → `/install`, Learn more → `#what-is-spec-ade`), animated Vue terminal demo, trust stats row.
2. **What is Spec ADE?** — 3-pillar explainer + comparison table (Traditional IDE vs AI IDE vs Spec ADE).
3. **Trust row** — 4 headline stats (AI agents, DB drivers, single binary, local-first).
4. **Key Features** — 6 cards (Multi-Agent, Goal, Port Forwarding, Claw, Database, Design) that link to `/features#<id>`.
5. **Pricing** — Free Core Workspace + Coming Soon Gateway AI plan with model-agnostic copy.

### Sub-pages

- `/faq` and `/vi/faq` — full 8-item FAQ with back-link to home.
- `/install` and `/vi/install` — install guide (npx command, VPS variant, Node.js prerequisite details).
- `/features` and `/vi/features` — deep-dive sections: MultiAgent, GoalShowcase, PortForwarding, SpotlightClaw, SpotlightDb, SpotlightDesign, FeaturesRecap.

## Vue islands

Two islands ship to the browser:

- `ThemeToggle.vue` — dark/light toggle with localStorage persistence.
- `TerminalDemo.vue` — animated terminal demo in the hero, IntersectionObserver-gated.

The rest of the page is server-rendered HTML with small inline `<script>` blocks for tab switching, copy buttons, and showcase simulations. The interactive showcase scripts re-bind on `astro:after-swap`.

## Internationalization

Two locales ship out of the box:

- `/` → English (default, no language prefix)
- `/vi/` → Vietnamese

Both share the same components — only `i18n/strings.ts` differs. The header has a one-tap language switcher. `BaseLayout.astro` emits `<link rel="alternate" hreflang="...">` tags for SEO.

To add a third locale:

1. Add it to `astro.config.mjs` → `i18n.locales`.
2. Append a new key to `dict` in `src/i18n/strings.ts` (TypeScript will enforce shape parity with `en`).
3. Create `src/pages/<lang>/index.astro` with `const lang = '<lang>' as const`.

## Develop

```bash
npm install
npm run dev              # Astro dev server on http://localhost:4321/
npm run build            # Production build → docs/
npm run preview          # Preview the production build
```

> Astro 6 requires **Node 22+**. Verify your toolchain before installing.

## Testing

```bash
npm install
npm run build && npm test              # Run all Playwright tests
npm run test:ui                        # Playwright interactive UI
npm run test:update-snapshots          # Regenerate visual regression snapshots
```

Tests in `tests/landing.spec.ts` cover:

1. `/` returns 200, hero heading visible, primary CTA points to `/install`.
2. `/vi/` returns 200, hero heading visible.
3. Theme toggle switches `data-theme` attribute on click.
4. Language switcher href points to the correct alternate (with base prefix).
5. axe-core scan on `/` and `/vi/` — no critical violations.
6. Visual regression — 3 viewports (375 / 768 / 1280) × 2 themes (dark / light) × 2 routes = 12 snapshots.
7. Homepage shows 6 key feature cards.
8. Homepage pricing section renders with both plan cards.
9. `/faq` returns 200 and shows all 8 FAQ items.
10. `/install` returns 200 and shows the install command.
11. `/features` and `/vi/features` render the recap and all six showcase sections.
12. Goal Showcase scenario selector updates goal text, milestones, and runs the simulation to completion.

Run `npm run test:update-snapshots` once to generate the baseline snapshots — they were intentionally not committed because the homepage layout has changed.

## Deploy

The site is fully static. The build output is written to `./docs/` (configured in `astro.config.mjs`) and is served from **Cloudflare Pages**, mapped to the custom domain `iamdev.io.vn`.

Cloudflare Pages settings:

- **Build command**: `npm run build`
- **Build output directory**: `docs`
- **Custom domains**: `iamdev.io.vn`, `www.iamdev.io.vn`

Pushing to `main` triggers a new deployment automatically.

```bash
npm run build           # Local build for verification → docs/
```

## Test affordances

Stable `data-testid` attributes on interactive elements:

- `hero-badge`, `hero-primary-cta`, `hero-secondary-cta`, `hero-coming-soon`
- `key-feature-{multi-agent|goal|port|claw|db|design}`
- `faq-item-{0..7}`, `faq-see-all`
- `nav-toggle`, `mobile-nav`, `mobile-nav-link-{features|pricing|install|faq|get-started}`
- `theme-toggle`, `lang-switch`, `header-cta`, `back-to-home`
- `features-recap`, `activation-note`, `auto-open-callout`, `nodejs-details`, `npm-coming-soon-note`

## TODO before launch

- [ ] Publish `@spec-ade/cli` on npm (the install commands assume the package will exist).
- [ ] Confirm the official viber.vn support contact channel and link it from the footer.
- [ ] Add an OG image (`public/og.png`) and re-introduce the `og:image` / `twitter:image` meta tags in `BaseLayout.astro`.
- [ ] Run `npm run test:update-snapshots` to generate baseline visual regression snapshots.

## What is intentionally missing

- No analytics/tracking (add at deploy time if needed).
- No newsletter form, no third-party widgets — keeps the page fast and tracking-free by default.
- No content management system — copy lives in `src/i18n/strings.ts`. Treat it as code.
