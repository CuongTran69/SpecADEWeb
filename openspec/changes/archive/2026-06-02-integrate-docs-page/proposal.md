## Why

The marketing site has a self-contained HTML mockup (`index.html` at repo root) that demonstrates the desired docs experience, plus 12 detailed Vietnamese chapters under `user-guide/` and a partially-populated bilingual content module at `src/i18n/docs.ts` (10 condensed pages). None of this is wired into the live site — there is no `/docs` route, no header link, and no way for a visitor to browse the docs. We need a real, indexable, bilingual documentation section that uses the mockup's design language and the user-guide's depth of content.

## What Changes

- Add a `/docs/` and `/vi/docs/` documentation section to the Astro site, generated as static pages (one HTML file per slug).
- Create a `DocsLayout` (no marketing Header/Footer) with a fixed topbar (brand + version pill + Cmd+K search + lang switcher + theme toggle + website link), a sticky sidebar (4 nav groups), a content column (max 760px), and a sticky right-hand TOC.
- Render content entirely from the existing typed `Block` schema in `src/i18n/docs.ts` — no client-side hash routing, no inline `<script>` content blob.
- Expand `DOCS_NAV` and `DOCS_PAGES` to **13 pages across 4 groups**:
  - Get started: `introduction`, `quickstart`, `installation`
  - Core concepts: `projects-sessions`, `panes-tabs`, `chat`, `terminal`, `file-editor`
  - Features: `git`, `database`, `send-with-goal`, `spec`, `monitor`
  - Reference: `settings`, `shortcuts`
  Renames: `chat-terminal` → split into `chat` + `terminal`; `goal` → `send-with-goal`. Adds new pages: `file-editor`, `monitor`, `settings`, `spec` (translated VI→EN from `user-guide/05`, `user-guide/09`, `user-guide/10`, `user-guide/12`). Existing pages thicken with depth from their corresponding user-guide chapters.
- Add a "Docs" / "Tài liệu" link to the marketing header (desktop nav + mobile nav), driven by a new `nav.docs` string in `src/i18n/strings.ts`.
- Render every block type the schema declares (`hero`, `h2`, `h3`, `p`, `lede`, `hr`, `ul`, `ol`, `callout`, `code`, `codetabs`, `steps`, `cards`, `features`, `table`) server-side as Astro components. Inline markdown helpers: backtick-code, `**bold**`, `[text](href)`, `<kbd>`. Cross-page links written as `[text](#/<slug>)` are rewritten at render time to absolute paths via `pathFor(lang, '/docs/<slug>/')`.
- A small Vue island provides the Cmd+K search modal and the code-copy clipboard action; theme toggle reuses the existing `src/components/islands/ThemeToggle.vue`.
- Add Playwright coverage in `tests/docs.spec.ts` for: smoke load (EN + VI), sidebar navigation, language switch on a deep slug, theme persistence, search open + result navigation, TOC anchor jump, and mobile sidebar drawer.
- Out of scope: Algolia/server-side search, auto-generated API references, docs versioning, edit-on-GitHub, comments, dedicated docs sitemap.
- The root `index.html` mockup stays in place as a design reference (not deleted, not moved). Final disposition is for the user to decide later.

## Capabilities

### New Capabilities

- `docs-site`: A bilingual, statically-generated documentation section under `/docs/` (EN) and `/vi/docs/` (VI). Covers layout chrome (topbar, sidebar, TOC, page nav, breadcrumbs), routing per locale, the typed Block content model, server-side block rendering, cross-locale slug consistency, search index + Cmd+K modal, code-block syntax highlighting + copy, theme persistence inside the docs shell, accessibility (skip link, focus trapping, keyboard navigation, WCAG 2.1 AA contrast), and the marketing header's discoverability link to docs.

### Modified Capabilities

(none — `src/i18n/docs.ts` is currently untracked working-tree content with no merged spec; `src/i18n/strings.ts` and `src/components/Header.astro` changes are local additions in service of the new capability and do not redefine an existing capability's requirements.)

## Impact

- **New code**:
  - `src/layouts/DocsLayout.astro`
  - `src/components/docs/DocsTopbar.astro`
  - `src/components/docs/DocsSidebar.astro`
  - `src/components/docs/DocsToc.astro`
  - `src/components/docs/DocsBlock.astro`
  - `src/components/docs/DocsBreadcrumb.astro`
  - `src/components/docs/DocsPageNav.astro`
  - `src/components/docs/DocsCodeBlock.astro`
  - `src/components/docs/DocsSearch.vue`
  - `src/pages/docs/[...slug].astro`
  - `src/pages/vi/docs/[...slug].astro`
  - `tests/docs.spec.ts`
- **Modified code**:
  - `src/i18n/docs.ts` — `DOCS_NAV` reshaped to 4 groups / 13 slugs; 4 new pages added (`file-editor`, `monitor`, `settings`, `spec`); existing pages thickened from `user-guide/` chapters; `chat-terminal` split into `chat` + `terminal`; `goal` renamed to `send-with-goal`; `DOCS_ORDER` updated.
  - `src/i18n/strings.ts` — `nav.docs` (Bi) added to both `en.nav` and `vi.nav`.
  - `src/components/Header.astro` — desktop nav and mobile nav each gain a Docs link between Features and Pricing.
- **Untouched but relevant**:
  - `astro.config.mjs` — `outDir: ./docs/` retained; the new `/docs/` route emits to `./docs/docs/index.html` and `./docs/docs/<slug>/index.html`. No conflict with the build directory itself.
  - `index.html` (root) — mockup preserved unchanged.
  - `user-guide/*.md` — source material, not deleted, not edited.
- **Dependencies**: no new npm dependencies. Uses existing `astro@^6`, `@astrojs/vue@^6`, `vue@^3.5`, `tailwindcss@^4`, `lucide-vue-next@^0.460` (only if needed; otherwise inline SVG via `DOCS_ICONS`).
- **Build / deploy**: zero config change. Cloudflare Pages keeps publishing the same `./docs/` directory.
- **SEO**: each docs slug becomes its own `<link rel="canonical">` URL with `hreflang` alternates EN ↔ VI, mirroring the BaseLayout pattern.
- **Performance**: fully static HTML per page; only the search modal and code-copy actions ship JS (Vue island, `client:idle` / `client:visible`).
