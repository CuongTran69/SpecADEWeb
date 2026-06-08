## 1. i18n strings

- [x] 1.1 Add `nav.contextEngine` label to the `nav` object in both `en` and `vi` in `src/i18n/strings.ts` (en: "Context Engine", vi: "Context Engine")
- [x] 1.2 Add a `contextEnginePage` block to the `en` object: page title, subtitle, backToHome, hero (heading/subtitle/primaryCta/secondaryCta + 3 metric callouts), features section heading + 12 card titles/descriptions, howItWorks heading + index/query phase step labels, languages heading + "other files" note, install heading + labels (npx/global/flags/platforms/port note), githubCta heading/body/button — all sourced from the vibervn README
- [x] 1.3 Mirror the exact same `contextEnginePage` shape into the `vi` object with full Vietnamese diacritics; keep tree-sitter, MCP, SurrealDB, Voyage AI, embeddings, BFS verbatim ← (verify: `vi: typeof en` type-checks; both locales identical shape, no English left in vi prose)

## 2. ContextEngine component

- [x] 2.1 Create `src/components/ContextEngine.astro` with `interface Props { lang: Lang }`, reading `const strings = t(lang)` and `contextEnginePage` content
- [x] 2.2 Build the Hero section: heading, subtitle, primary CTA → `https://github.com/nullmastermind/vibervn-context-engine` (external, `rel="noopener"`), secondary CTA → `#how-it-works`, 3 factual metric callouts
- [x] 2.3 Build the Features grid: 12 cards (data array mapped) with inline Lucide-style SVG icons at 16px / stroke 1.75, titles+descriptions from strings
- [x] 2.4 Build the How It Works section with `id="how-it-works"`: two-phase stepped flow (Index phase 6 steps, Query phase 6 steps) using existing CSS primitives, no mermaid; collapses to single column on mobile
- [x] 2.5 Build the Supported Languages section: 9 languages with literal extensions in an `overflow-x:auto` wrapper + "other files chunked/embedded for semantic search only" note
- [x] 2.6 Build the Install section: reuse `CopyBlock` for `npx vibervn-context-engine@latest`, `--port 8080 --bind 0.0.0.0` flag example, and `npm install -g vibervn-context-engine@latest`; state port 6699 / web UI / `/mcp` endpoint and platforms (Linux x64/arm64, macOS arm64, Windows x64)
- [x] 2.7 Build the GitHub CTA section: prominent external link to the repo with "drop-in alternative to Augment's context engine" framing
- [x] 2.8 Add scoped `<style>` using only design tokens (no new deps, no light-theme-breaking hardcoded colors), responsive grids, `.reveal` classes ← (verify: no horizontal overflow at 375px; legible in `[data-theme="light"]`)

## 3. Pages

- [x] 3.1 Create `src/pages/context-engine.astro` (lang `en`): BaseLayout + SubpageHeader (title/subtitle/backToHome from strings) + `ContextEngine`
- [x] 3.2 Create `src/pages/vi/context-engine.astro` (lang `vi`): same structure ← (verify: both routes return 200, hero heading + GitHub link render, hreflang alternates point cross-locale)

## 4. Navigation

- [x] 4.1 Add a desktop nav link to `/context-engine` in `Header.astro` after Features, with `isActive('/context-engine')` active state
- [x] 4.2 Add a mobile nav link in `Header.astro` with `data-testid="mobile-nav-link-context-engine"` and active state
- [x] 4.3 Add a footer `<li>` link to `/context-engine` in `Footer.astro` ← (verify: links resolve via `pathFor(lang, ...)` for both locales, active state correct only on the page)

## 5. Tests & verification

- [x] 5.1 Extend `tests/landing.spec.ts`: assert `/context-engine` and `/vi/context-engine` return 200, hero heading visible, GitHub link href present, and header nav link present
- [x] 5.2 Run `npm run build` and confirm a clean type-check + build (strings parity, no Astro errors)
- [x] 5.3 Run `npm test` (Playwright) for the new assertions; note that `npm run test:update-snapshots` is a manual follow-up for visual regression baselines ← (verify: new route tests pass; build output written to docs/)
