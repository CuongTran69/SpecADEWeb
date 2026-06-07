## Why

The Spec ADE site has no dedicated page explaining the `vibervn-context-engine` project — a local-first semantic code-search engine that pairs naturally with Spec ADE's AI-agent workflows. A focused landing page educates visitors on what the engine does and drives them to the GitHub repository, using a proven layout (inspired by augmentcode.com/context-engine) but with content sourced strictly from the project's own README.

## What Changes

- Add a new marketing page `/context-engine` (English) and `/vi/context-engine` (Vietnamese), mirroring the existing `features`/`install`/`faq` page pattern (BaseLayout + SubpageHeader + a dedicated content component).
- Add a new server-rendered, zero-JS `ContextEngine.astro` component with six sections: Hero, Features grid (12 cards), How It Works (two-phase pipeline), Supported Languages (9 languages), Install, and a GitHub CTA.
- Add a `contextEnginePage` translation key (plus a `nav.contextEngine` label) to both `en` and `vi` in `src/i18n/strings.ts`, with full Vietnamese diacritics and technical terms kept in original form.
- Add navigation discoverability: a Header link (desktop + mobile) and a Footer link to `/context-engine`.
- Extend Playwright coverage so both routes return 200, render the hero heading and GitHub link, and expose the nav link.
- All content is sourced ONLY from the vibervn-context-engine README. No fabricated benchmarks. Port is `6699`. The engine is a Rust binary, local-first, no cloud storage.

## Capabilities

### New Capabilities
- `context-engine-page`: A bilingual marketing/landing page on the Spec ADE site that describes the vibervn-context-engine project (features, architecture pipeline, supported languages, install commands) and links to its GitHub repository, integrated into site navigation.

### Modified Capabilities
<!-- None — no existing OpenSpec specs define site navigation or page behavior as requirements. -->

## Impact

- **New files**: `src/pages/context-engine.astro`, `src/pages/vi/context-engine.astro`, `src/components/ContextEngine.astro`.
- **Modified files**: `src/i18n/strings.ts` (new `contextEnginePage` block + `nav.contextEngine` in both locales), `src/components/Header.astro` (desktop + mobile nav links), `src/components/Footer.astro` (footer link), `tests/landing.spec.ts` (new assertions).
- **Dependencies**: none added — reuse existing design tokens, `CopyBlock`, inline Lucide-style SVGs.
- **SEO**: two new canonical URLs with hreflang alternates emitted automatically by `BaseLayout`.
- **Risk**: low — additive page; main caution is mobile horizontal overflow (recently fixed elsewhere) on the features grid, languages table, and pipeline flow.
