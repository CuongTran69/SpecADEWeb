## Context

The Spec ADE marketing site is an Astro 6 project (Tailwind v4 CSS-first, Vue 3 islands, built-in i18n with `en` default + `vi`). Pages live in `src/pages/` with a `vi/` mirror; shared copy lives in `src/i18n/strings.ts` typed as `vi: typeof en`. Subpages follow a fixed shape: `BaseLayout` → `SubpageHeader` → content component(s). Content components such as `SpotlightDb.astro` are server-rendered with scoped `<style>` blocks, `.reveal` scroll-in classes, and design tokens (`--color-*`, `--space-*`, `--radius-*`, `--ease-out-soft`).

This change adds a Context Engine page describing the external `vibervn-context-engine` project. All facts come from its README (verified: port 6699, 9 tree-sitter languages, MCP `codebase-retrieval` tool, SurrealDB, Voyage AI, Rust binary, local-first, platforms Linux x64/arm64 + macOS arm64 + Windows x64).

## Goals / Non-Goals

**Goals:**
- A bilingual `/context-engine` + `/vi/context-engine` page matching the existing subpage pattern exactly.
- One reusable `ContextEngine.astro` component driven entirely by `t(lang).contextEnginePage`.
- Accurate, README-sourced content; layout inspired by augmentcode.com/context-engine.
- Discoverable via header (desktop + mobile) and footer.
- Responsive, theme-safe, accessible, zero new dependencies.

**Non-Goals:**
- No mermaid/diagram library — the pipeline is hand-built with CSS.
- No fabricated benchmarks or metrics not present in the README.
- No changes to other pages' content; no analytics; no Vue island (page is static).

## Decisions

**1. Single content component, not per-section spotlights.**
The augment layout is a linear narrative, so one `ContextEngine.astro` holding all six sections keeps the page cohesive and the scoped CSS local. Alternative (reusing the `Spotlight` primitive per section) was rejected — those are tuned for the app's interactive mockups, not a content page.

**2. Data-driven sections via local arrays in the component frontmatter.**
Feature cards, pipeline steps, and language rows are arrays mapped in the template, with their human text pulled from `strings.contextEnginePage`. This keeps the markup DRY and the translations centralized. Extension tokens (`.py`, `.rs`) are literal data (not translated); only labels/descriptions are translated.

**3. i18n shape.** Add `contextEnginePage` to `en` first, then mirror into `vi`; `vi: typeof en` makes any missing key a compile error. Add `nav.contextEngine` to the existing `nav` object in both locales. Technical proper nouns stay verbatim in Vietnamese.

**4. Install section reuses `CopyBlock`.** Matches `GetStarted.astro` convention and gives copy-to-clipboard for free without new code.

**5. Icons are inline SVG.** `.astro` components can't cleanly use `lucide-vue-next` (a Vue component) without an island; inline Lucide-style paths at 16px / stroke 1.75 match the rest of the site and ship zero JS.

**6. Overflow safety.** The languages table and the two-phase pipeline are the overflow-risk areas. Wrap the table in an `overflow-x: auto` container and let the pipeline collapse to a single column under the `1024px`/`768px` breakpoints, mirroring `.spotlight-grid`.

**7. Nav placement.** Insert the link right after `Features` in both desktop and mobile nav, and add a footer `<li>` after Features — keeps related "what it does" links grouped.

## Risks / Trade-offs

- **Mobile horizontal overflow** (recently fixed elsewhere) → Mitigation: `overflow-x:auto` on the table, single-column grid fallbacks, no fixed-width children; verify at 375px.
- **Light-theme regressions from hardcoded colors** → Mitigation: use only `--color-*` tokens and `color-mix` as existing components do; no raw hex except established status dots if needed.
- **Visual regression snapshots** in `tests/landing.spec.ts` are viewport×theme×route based; a new route doesn't break existing snapshots, but adding the nav link changes the header on every page → Mitigation: snapshots are regenerated manually via `npm run test:update-snapshots`; note this in tasks, do not block on it.
- **i18n drift** → Mitigation: rely on `vi: typeof en` type-check during `npm run build`.

## Migration Plan

Purely additive. Deploy is the standard static build (`npm run build` → `docs/` → Cloudflare Pages on push to `main`). Rollback = revert the commit; no data or schema involved.

## Open Questions

None — all values (port, languages, commands, platforms, repo URL) are confirmed from the README.
