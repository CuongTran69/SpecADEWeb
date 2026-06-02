## 1. Content data layer (`src/i18n/docs.ts`)

- [x] 1.1 Reshape `DOCS_NAV` to the four groups described in the spec, with the exact slug ordering: Get started → `introduction`, `quickstart`, `installation`; Core concepts → `projects-sessions`, `panes-tabs`, `chat`, `terminal`, `file-editor`; Features → `git`, `database`, `send-with-goal`, `spec`, `monitor`; Reference → `settings`, `shortcuts`.
- [x] 1.2 Split the existing `chat-terminal` page into two separate pages `chat` and `terminal`, redistributing the source-of-truth content from `user-guide/03-ai-chat.md` (chat) and `user-guide/04-terminal.md` (terminal).
- [x] 1.3 Rename slug `goal` to `send-with-goal`. Migrate every cross-page link `[…](#/goal)` across `DOCS_PAGES` to `[…](#/send-with-goal)`. Page content thickens from `user-guide/11-send-with-goal.md`.
- [x] 1.4 Add new page `file-editor` under Core concepts. Translate `user-guide/05-file-editor.md` into bilingual `Block[]`. Use `lede` first block, ≥ 2 `h2` sections, and at least one `features`, one `callout`, and one `cards` block to keep the surface comparable to neighbours.
- [x] 1.5 Add new page `monitor` under Features. Translate `user-guide/09-monitor.md` into bilingual `Block[]` (lede + `h2`s + a process-table `table` block + warning callout for kill-process behaviour).
- [x] 1.6 Add new page `settings` under Reference. Translate `user-guide/10-settings.md` into bilingual `Block[]` (lede + section `h2`s by settings group + a `table` of common shortcuts).
- [x] 1.7 Add new page `spec` under Features. Translate `user-guide/12-spec.md` into bilingual `Block[]` (lede + `h2`s on Workflow / Apply / Verify / Archive + a `cards` block linking to send-with-goal and git).
- [ ] 1.8 Thicken existing pages with depth from their corresponding user-guide chapters: `introduction` (no chapter — keep architecture overview), `quickstart` (chapter 1), `installation` (chapter 1, system + service notes), `projects-sessions` (chapter 2), `panes-tabs` (chapter 8), `git` (chapter 6), `database` (chapter 7), `shortcuts` (chapter 10 → shortcut table). Each must have ≥ 2 `h2` blocks and the first block must be `hero` or `lede`.
- [x] 1.9 Update the `DOCS_ORDER` flat array (or computed `ORDER` helper) to match the new `DOCS_NAV` so prev/next pagers traverse all 13 slugs in order.
- [x] 1.10 Audit every cross-page link of the form `[…](#/<slug>)` inside any block to ensure every referenced slug exists in the new `DOCS_PAGES`. Fix dangling references. ← (verify: no slug referenced by a link is absent from `DOCS_PAGES`; every key in `DOCS_PAGES` is reachable from `DOCS_NAV` exactly once)

## 2. i18n strings + marketing header

- [x] 2.1 Add `docs` to `nav` in `src/i18n/strings.ts`: `en.nav.docs = 'Docs'`, `vi.nav.docs = 'Tài liệu'`. Update the `Strings` type if it is hand-rolled.
- [x] 2.2 Insert the new Docs link into `src/components/Header.astro` desktop nav between `Features` and `Pricing`, using `pathFor(lang, '/docs/')` and `strings.nav.docs`.
- [x] 2.3 Insert the matching Docs link into the mobile nav in `src/components/Header.astro`, in the same relative position, with a `data-testid="mobile-nav-link-docs"` attribute mirroring the existing mobile-nav-link convention.

## 3. Layout chrome (`DocsLayout` and topbar)

- [x] 3.1 Create `src/layouts/DocsLayout.astro` with the head block (canonical, hreflang EN/VI, Open Graph, Twitter, theme-color), `<html lang>` and `<body>` setup, the pre-paint theme script (mirrors `BaseLayout.astro`), and slots for content. Take props `{ lang: DocLang, slug: string, pageTitle: string, pageDescription?: string }`.
- [x] 3.2 Create `src/components/docs/DocsTopbar.astro`. Render the brand block (logo SVG + product name + version pill `docs`), the search trigger button (with `aria-label`, label text from i18n, `⌘K` hint), the language seg as `<a>` elements pointing to the swapped-locale URL, the theme-toggle button, and an external website link. All buttons have `aria-label`.
- [x] 3.3 Create `src/components/docs/DocsSidebar.astro`. Render `DOCS_NAV` as four nav groups; each group has a heading (group icon + title) and a list of nav-link `<a>` elements; the link whose href matches the current slug receives the `active` class. Wrap in `<aside class="sidebar">`. Include the mobile drawer transform CSS.
- [x] 3.4 Add the mobile menu toggle in the topbar plus the scrim sibling element, with the toggle and scrim wired up via a tiny inline script in `DocsLayout.astro` (~25 LOC) that toggles `.open` classes and traps focus inside the drawer when open. Pressing Escape and clicking the scrim each close the drawer.
- [x] 3.5 Set up the layout grid CSS (1480px max, sidebar 280px, content 1fr, toc 240px, max content width 760px), fixed topbar at 56px, with breakpoints at 1100px (hide TOC) and 860px (sidebar → drawer). All sizing comes from CSS variables; reuse `--color-*` tokens from `src/styles/global.css` plus a small new tokens block scoped to the docs shell where the existing tokens don't cover.
- [x] 3.6 Add a skip-to-content link (`<a class="skip-link" href="#docs-main">`) as the first focusable element. ← (verify: layout grid renders with all three columns at viewport ≥ 1100px; sidebar collapses to drawer at 860px; topbar buttons all keyboard-reachable with visible focus rings)

## 4. Content rendering

- [x] 4.1 Create `src/components/docs/DocsBreadcrumb.astro` taking `{ groupTitle: string, pageTitle: string }` and rendering the breadcrumb pattern `groupTitle › pageTitle`.
- [x] 4.2 Create `src/components/docs/DocsBlock.astro` with a single `block: Block` switch covering all 15 block types from the schema. Inline JSX for `hero`, `h2`, `h3`, `p`, `lede`, `hr`, `ul`, `ol`, `callout`, `steps`, `cards`, `features`, `table`. Delegate `code` and `codetabs` to `DocsCodeBlock`. Resolve all `BiOrStr` via `tx(value, lang)`.
- [x] 4.3 Implement `renderInline(value: BiOrStr, lang: DocLang, slugLinker: (slug: string) => string): string` colocated with `DocsBlock.astro` (or in a sibling helper file). Order: `tx()` resolve → HTML escape → backtick code → `**bold**` → `[label](#/slug)` rewrite via `slugLinker` → `[label](href)` for external/in-page → `&lt;kbd&gt;...&lt;/kbd&gt;` un-escape. Output is HTML string, injected via `set:html` in `DocsBlock`.
- [x] 4.4 Implement the slug-link rewriter so that any link starting with `#/` extracts the slug (and optional `#anchor`) and produces `pathFor(lang, '/docs/<slug>/')` (with `#anchor` preserved if present). In-page anchors (`#section-id`, no leading slash after the hash) pass through unchanged.
- [x] 4.5 Create `src/components/docs/DocsCodeBlock.astro` taking `{ tabs: CodeTab[] }` (single-tab `code` blocks are wrapped into a 1-tab list before passing in). Render the head bar (filename for single-tab + `fname`, language label otherwise; or tab buttons for multi-tab), the copy button, and a `<pre><code>` per pane with `display:none` for inactive panes. Generate a unique `data-cb` id per block. Apply the syntax highlighter from `renderHighlight(code, lang)` returning safe HTML.
- [x] 4.6 Implement `renderHighlight(code: string, lang: string): string` (port of mockup's `hl()`). Cases: `bash`/`sh` (comments, command, flags, strings), `json` (keys, strings, keywords, numbers), generic fallback (line comments, strings, keyword set). Escape input first; substitutions wrap with `<span class="tok-*">`.
- [x] 4.7 Write the inline `<script>` in `DocsLayout.astro` (or imported from `src/lib/docs-runtime.ts`) for codetab switching: delegated `click` listener on `.code-tab` toggles `.on` between siblings of the same `data-cb`. Keep it under 20 LOC.
- [x] 4.8 Create `src/components/docs/DocsCopyIsland.vue` (Vue island, `client:visible`) handling the `.code-copy` button click globally on the docs page. On click: reads current `.code-pane.on > pre > code` text, calls `navigator.clipboard.writeText` with `execCommand` fallback, swaps button label to "Copied"/"Đã chép" for 1600ms, announces via `aria-live="polite"`. ← (verify: clicking copy on any code block in any page triggers correct text copy in both Chromium and Firefox during Playwright run)
- [x] 4.9 Create `src/components/docs/DocsToc.astro` taking `{ entries: Array<{ id, text, lvl }> }`. Render a `<nav>` with one `<a>` per entry; `lvl===3` adds `.h3` class. Title is "On this page"/"Trên trang này" via i18n. Empty `entries` → component renders nothing (and the parent grid removes the column).
- [x] 4.10 Implement TOC scrollspy: an inline `<script>` in `DocsLayout.astro` that on `scroll` updates `.toc a.active` based on which heading is closest to `topbar-h + 24px`. Use `requestAnimationFrame` throttle; passive listener. Restart on `astro:after-swap` (defensive — Astro views don't navigate but third-party transitions might).
- [x] 4.11 Create `src/components/docs/DocsPageNav.astro` taking `{ prevSlug?, nextSlug?, prevTitle?, nextTitle?, lang }`. Render the prev/next pager linking to `pathFor(lang, '/docs/<slug>/')` with the chevron SVGs. ← (verify: prev/next links resolve to correct slug + locale on every page tested)

## 5. Routing

- [x] 5.1 Create `src/pages/docs/[...slug].astro`:
  - `export async function getStaticPaths()` returns one entry per key in `DOCS_PAGES` plus an entry for `undefined` slug (the default `/docs/` index → `introduction`).
  - Frontmatter: resolve `slug` from `Astro.params`, default to `'introduction'`. Read the page from `DOCS_PAGES[slug]`. Compute breadcrumb group title from `DOCS_NAV`. Compute prev/next from the flat order. Compute TOC entries by walking the page's blocks (collect `h2`/`h3` types).
  - Render `<DocsLayout>` with topbar, sidebar, content (`<main id="docs-main">` with breadcrumb + auto eyebrow/h1 if first block is not hero + per-block render via `DocsBlock` + page nav), and TOC aside.
  - Set `pageTitle` from `tx(page.title, 'en') + ' — Spec ADE'` for the `<title>` tag.
- [x] 5.2 Create `src/pages/vi/docs/[...slug].astro` with the same logic but `lang = 'vi'` and the title suffix unchanged. Both files import the same renderer logic from a shared module if it grows large; otherwise duplicate the small frontmatter block.
- [x] 5.3 Confirm prev/next links use `pathFor(lang, '/docs/<slug>/')`, language switch in topbar uses `swapLangPath(currentPath, target)`, and sidebar links use `pathFor(lang, '/docs/<slug>/')`. ← (verify: build emits `./docs/docs/<slug>/index.html` and `./docs/vi/docs/<slug>/index.html` for all 13 slugs plus the implicit root for both locales; no extra/missing files)

## 6. Search

- [x] 6.1 Create `src/components/docs/DocsSearch.vue`. Props: `{ lang: DocLang, currentPath: string }`. On mount, build the index from `DOCS_PAGES` (imported directly): one entry per page (slug + group + page title + flattened text from blocks) plus one entry per `h2` and `h3` heading per page (slug + page title as group + heading text + heading id as anchor).
- [x] 6.2 Implement `norm(s)` (lowercase + NFD diacritic strip, port of mockup's helper) and the search ranking: title-match scores 0, body-match scores 100 + position. Top 12 results.
- [x] 6.3 Implement keyboard handling on the modal: Cmd+K / Ctrl+K open from the page (document-level keydown), `/` opens when no input focused, Escape closes, ArrowUp/Down moves selection (clamped), Enter navigates via `location.href = pathFor(lang, '/docs/<slug>/') + (anchor ? '#' + anchor : '')`. Focus trap inside the modal.
- [x] 6.4 Implement empty-state and no-results state with bilingual strings (`UI.vi['empty']` / `UI.en['empty']` ported from mockup).
- [x] 6.5 Mount the island in `DocsLayout.astro` with `client:idle`. Pass `lang` and `Astro.url.pathname` as props. Wire the topbar search button's `click` to dispatch a custom event the island listens for. ← (verify: pressing Cmd+K on `/docs/` opens the modal within ~300ms, typing "git" returns ≥ 1 result, Enter navigates to `/docs/git/`)

## 7. Header integration polish

- [x] 7.1 Confirm the new desktop header link respects the existing styling (`.nav-link`) and does not break flex layout below 768px.
- [x] 7.2 Confirm the mobile-nav link has `data-testid="mobile-nav-link-docs"` and matches the visual treatment of `mobile-nav-link-features`.
- [x] 7.3 Snapshot-update with `bun run test:update-snapshots` if the existing visual tests covered the header. Otherwise leave as-is. ← (verify: `bun run check` (or equivalent type-check) passes with no new errors; existing pages still load and their nav looks unchanged except for the new link)

## 8. Tests

- [x] 8.1 Create `tests/docs.spec.ts` based on `playwright.config.ts`. Suites: smoke (EN root, VI root), navigation (sidebar click), language switch (deep slug → locale-swapped URL), theme persistence (toggle + reload), search (Cmd+K → query → Enter), TOC anchor scroll, mobile drawer at 375px viewport.
- [x] 8.2 Each scenario uses Astro dev server (`bun run dev`, port 4321 by default) or relies on `playwright.config.ts`'s existing webServer config. Reuse the same conventions as existing tests under `tests/`.
- [x] 8.3 Add a build-output assertion test (or a separate `tests/docs-build.spec.ts`) that runs `astro build` and asserts every expected `./docs/docs/<slug>/index.html` and `./docs/vi/docs/<slug>/index.html` exists. (Optional if covered by manual verification — keep it if `playwright.config.ts` makes a `build` mode easy.) ← (verify: full Playwright suite passes locally; failing scenarios are fixed before claiming done)

## 9. Final verification

- [x] 9.1 Run `bun run build`. Confirm no Astro / TypeScript errors. Confirm `./docs/docs/index.html` and `./docs/docs/<slug>/index.html` for all 13 slugs (× 2 locales) exist.
- [x] 9.2 Run `bun run dev`. In a browser: visit `/docs/`, exercise sidebar navigation, language switch, theme toggle, Cmd+K search, code copy, mobile drawer at 375px. Visit `/vi/docs/quickstart/`, repeat.
- [x] 9.3 Run `bun run test`. All Playwright scenarios pass.
- [x] 9.4 Confirm `index.html` (root mockup) is present and unchanged; `user-guide/*.md` are present and unchanged; `astro.config.mjs` is unchanged. ← (verify: `git status` shows only the changes named in the proposal's Impact section; nothing extra)
