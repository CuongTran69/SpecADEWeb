## Context

The Astro 6 marketing site (`/Users/huy/Dev/www/SpecADEWeb`) ships landing/install/features/faq pages bilingually (EN default no-prefix, VI under `/vi/`). The repo already contains:

- A self-contained design mockup at the repo root: `index.html` (1026 lines, hash-routed SPA in vanilla JS, embeds chrome + content + search). It is a reference, not a build input.
- 12 detailed Vietnamese chapters under `user-guide/` covering the desktop product surface area.
- A typed bilingual content module at `src/i18n/docs.ts` (untracked, ~422 lines) defining a `Block` schema, a `DOCS_NAV` of 4 groups, `DOCS_PAGES` for 10 condensed pages, and helpers `tx()`, `headingId()`, `DOCS_ICONS`.

`astro.config.mjs` sets `outDir: './docs/'` (Cloudflare Pages root). A page `/docs/` therefore builds to `./docs/docs/index.html`. There is no naming collision because Astro writes the entire site into `./docs/`, and `/docs/` becomes a sub-path inside it; the build directory and the URL path simply share a name.

The marketing `Header.astro` and `Footer.astro` are not appropriate chrome for a documentation reading experience. Theme persistence already exists in `BaseLayout.astro` via `localStorage['spec-ade-web:theme']` and inline pre-paint script.

## Goals / Non-Goals

**Goals:**

- One static HTML per slug per locale, indexed by search engines, with stable canonical URLs and `hreflang` alternates.
- Visual fidelity to the mockup: topbar, sidebar groups, content column at 760px max, sticky right-hand TOC, Cmd+K search modal, code blocks with copy + language-tab switcher.
- All content originates from the typed `Block[]` array in `src/i18n/docs.ts`. No untyped HTML strings inside data; renderers are server-side Astro components.
- Cross-page links written as `[label](#/<slug>)` rewrite to absolute locale-aware paths at render time; in-page anchors `#section-id` survive untouched.
- Bilingual coverage of all 13 declared slugs, with the four new pages (`file-editor`, `monitor`, `settings`, `spec`) carrying full EN translations of `user-guide/05`, `09`, `10`, `12`.
- Theme/language toggles inside the docs shell stay consistent with the marketing shell (shared `localStorage` keys + path-swap helper).
- Accessibility: skip link, focus trapping on overlays, single `<h1>` per page, keyboard reachability everywhere, WCAG 2.1 AA contrast inherited from existing tokens.

**Non-Goals:**

- No SPA shell. No client-side hash router. The URL is the route.
- No new design tokens beyond what's already in `src/styles/global.css`. The mockup's tokens overlap with the existing palette; we map, not duplicate.
- No Algolia / DocSearch / server-side full-text index. Only the in-page Cmd+K modal indexed from `DOCS_PAGES`.
- No Edit-on-GitHub / comments / docs versioning / per-page sitemap.
- No content delete: `index.html` (mockup) and `user-guide/*.md` stay in place.

## Decisions

### Decision 1: Static routes, not a single SPA route

**Choice:** Two `[...slug].astro` files, one per locale, using `getStaticPaths()` keyed off `Object.keys(DOCS_PAGES)`.

**Why:**
- Astro's i18n is path-based (`prefixDefaultLocale: false`). Mirroring this pattern keeps EN canonical and VI under `/vi/` consistently with `index`/`install`/`faq`/`features`.
- One HTML per slug → SEO-friendly, deep linkable, cacheable per page on Cloudflare Pages.
- A second route file (rather than one shared file with locale param) lets each locale own a clean file path: `src/pages/docs/[...slug].astro` and `src/pages/vi/docs/[...slug].astro`. The two files import the same renderer module to share logic.

**Alternative rejected:** A single SPA at `/docs/` that hydrates and hash-routes (à la mockup). Rejected because the slug stays in `location.hash`, which crawlers index as one URL and which loses the i18n alternates that BaseLayout already wires up via `swapLangPath`.

### Decision 2: A dedicated `DocsLayout`, not a slot variant of `BaseLayout`

**Choice:** Create `src/layouts/DocsLayout.astro` that owns the docs `<head>` (canonical, hreflang, title), the docs topbar, and the docs main grid. It does NOT include marketing `Header`/`Footer`.

**Why:**
- The marketing header has `BrandMark` + nav links + CTA + lang link arranged for a landing site. The docs topbar replaces that with brand + version pill + Cmd+K + lang seg + theme toggle + external link. Trying to slot-graft the docs topbar over the marketing header pollutes both surfaces.
- The marketing footer is heavy (5KB+). The docs flow ends with a prev/next pager — no footer.
- Theme pre-paint script and `<html>` attribute setup are duplicated minimally (~10 LOC) inside `DocsLayout`, but kept compatible with `BaseLayout` by reading the same `localStorage` key and setting the same `data-theme` values.

**Alternative rejected:** Pass `variant="docs"` into `BaseLayout` and conditionally render. Rejected — it bloats `BaseLayout`'s prop API for one consumer and conflates two different chromes.

### Decision 3: `DocsBlock.astro` as a discriminated-union switch

**Choice:** A single Astro component receives `block: Block` and `lang: DocLang` and switches on `block.t`, delegating to inline JSX or to small subcomponents (`DocsCodeBlock`, plus inlined renderers for `hero`, `callout`, `cards`, `features`, `steps`, `table`).

**Why:**
- The `Block` discriminant union in `docs.ts` is ergonomic; one switch keeps all type narrowing in one place.
- Each block type's HTML is small (≤ 30 LOC). Splitting into 12 components is ceremony.
- `DocsCodeBlock` is the exception — it carries copy state and the syntax highlighter — so it justifies its own file plus a thin Vue island for clipboard.

**Alternative rejected:** One component per block type. Rejected: 11–12 files for trivial markup is overkill, and it scatters the `inl()` helper.

### Decision 4: Inline-markdown helper at render time

**Choice:** Port the mockup's `inl()` to a TypeScript function `renderInline(value: BiOrStr, lang: DocLang, slugLinker: (slug) => string): string` that:
1. Resolves `BiOrStr` via `tx()`.
2. HTML-escapes.
3. Substitutes `` `code` `` → `<span class="icode">…</span>`.
4. Substitutes `**bold**` → `<strong>…</strong>`.
5. Substitutes `[label](#/<slug>)` → `<a href="${slugLinker(slug)}">…</a>` (locale-aware) and `[label](href)` for any other href as-is.
6. Substitutes literal `<kbd>...</kbd>` markers (escaped form `&lt;kbd&gt;`) back to real `<kbd>` elements.

**Why:** The mockup already proves this stays under 20 LOC. Doing markdown server-side keeps zero JS on the page for content rendering. A full markdown parser is not justified for the four shortcuts the schema uses.

**Trade-off:** We trust authors to escape literal `<` correctly inside Block strings. Mitigation: escape happens before substitution, so authored `<` in body text won't break the helper.

### Decision 5: Search index built at module scope, hydrated by Vue island

**Choice:** Compute the search index once per language inside `DocsSearch.vue` from a JSON-serialized export of `DOCS_PAGES` passed via component props (or imported directly — Vite tree-shakes it into the same chunk).

**Why:**
- The index is small (under 50KB even with all 13 pages thickened). Computing it once on mount is fine.
- The component is mounted with `client:idle` so the rest of the page renders without waiting on it.
- Cmd+K listener is attached at `document` level, scoped to the docs route via the layout (not to a component subtree), so it fires even before the modal opens.

**Alternative rejected:** Pre-build a separate `search-index.json` file. Rejected: extra build step, one more thing to keep in sync.

### Decision 6: `headingId` from EN text, always

**Choice:** Reuse the existing `headingId(textEn: string)` helper. For an `h2` block whose `x: Bi`, derive the id from `x.en`.

**Why:**
- TOC links must be stable across locales so a deep link works in either language.
- Hash anchors emitted by code samples (e.g. `[Cài đặt](#/installation#prerequisites)`) need to resolve to the same DOM `id` regardless of which locale is loaded.

**Trade-off:** A page authored in VI without an EN twin would have an empty heading id. Mitigation: every block's `Bi` already carries both languages by schema; we treat missing `en` as an authoring bug surfaced at build time.

### Decision 7: Code copy via Vue island, scrollspy via inline `<script>`

**Choice:**
- Code-block copy buttons hydrate a tiny Vue island per page (one component instance handles all blocks via delegated event listener).
- TOC scrollspy and tab-switching (codetab `.on` toggle) run as a single small inline `<script>` in `DocsLayout` (~40 LOC). No client framework needed.

**Why:**
- Clipboard logic benefits from Vue's reactive feedback ("Copied" state) but is genuinely small. Avoiding inline `<script>` for it keeps the layout file readable.
- Scrollspy is a leaf concern with no state to share — vanilla `IntersectionObserver` + class toggle is the right tool. Adding a Vue island here would be over-engineered.

### Decision 8: Mobile drawer + scrim as native `<dialog>`-shaped pattern, but plain `<aside>`

**Choice:** Sidebar uses `<aside class="sidebar" :class="{ open }">` plus a sibling `<div class="scrim">`. JavaScript toggles the `open` class on both; CSS handles the transform. Focus trap is implemented manually (the mockup's pattern is already correct).

**Why:**
- `<dialog>` would force the role="dialog"/modal semantics, which is overkill for a navigation drawer.
- Manual focus trap matches the existing `Header.astro` mobile-nav implementation.

### Decision 9: Theme + lang behave like the rest of the site

**Choice:**
- Theme toggle reads/writes `localStorage['spec-ade-web:theme']`, exactly like `BaseLayout`. Pre-paint script in `DocsLayout` mirrors `BaseLayout`'s.
- Language seg uses an `<a href>` to the swapped path (computed via `swapLangPath` server-side and rendered into the markup), so JS-disabled users still get a working language switch.

**Why:** Coherence with the marketing shell and zero JS-required path for accessibility.

### Decision 10: `index.html` (mockup) stays in place, untouched

**Choice:** Do not delete, do not move, do not edit. Out of scope for this change.

**Why:** The user explicitly said `index.html` is the design reference. The decision of whether to retire or rename the file is a separate housekeeping decision. Moving it to `./docs-mockup.html` would be a different change.

## Risks / Trade-offs

- **[Risk]** Untracked `src/i18n/docs.ts` means current working-tree state is the only source. → **Mitigation:** Treat the existing file as a starting point; thicken in-place; add changes via the apply step's diff so the verifier can review.
- **[Risk]** Translating four full Vietnamese chapters (`05`, `09`, `10`, `12`) to English bloats the data file (~1.5–2× growth, ~400 → ~900 lines). → **Mitigation:** Keep blocks compact, prefer tables/feature-rows over long prose, mirror the existing pages' density.
- **[Risk]** Inline-markdown helper produces raw HTML strings injected via `set:html`. Authoring mistakes can break rendering. → **Mitigation:** Escape first, substitute second; unit-cover the helper in a small `tests/helpers.spec.ts` if time allows (out of scope this iteration; covered by Playwright smoke).
- **[Risk]** Code-block copy in iframe-restricted contexts (e.g. some CDN preview tools) can fail silently. → **Mitigation:** `execCommand('copy')` fallback. Failures produce no visible error.
- **[Risk]** Cmd+K listener can collide with browser's "search bar" combo on some platforms. → **Mitigation:** `event.preventDefault()` only when modal is in our layout; otherwise no-op.
- **[Risk]** `outDir: ./docs/` means a developer who runs `bun run dev` may briefly see stale `./docs/index.html` from a prior production build at the dev URL `/`. → **Mitigation:** Out of scope (pre-existing project setup). Do not change `outDir` in this change.
- **[Risk]** Adding a 4th-but-1st-among-equals "Docs" link to the marketing nav crowds the desktop header at narrow widths. → **Mitigation:** Existing media query at 480px hides the CTA; the nav can carry the extra link without visual overflow on 768px+ (verified manually during apply).

## Migration Plan

This is a pure additive change. No data migration, no rollback hooks.

1. Land all new files + edits in one PR.
2. Run `astro build` locally → confirm `./docs/docs/<slug>/index.html` exist for all 13 slugs in both locales.
3. Run `bun run test` (Playwright) → all docs scenarios pass.
4. Visit `/docs/` in dev (`bun run dev`) → manual verification of theme toggle, lang switch, search modal, mobile drawer, code copy.
5. Deploy to Cloudflare Pages → no infra change required (`./docs/` is already the publish dir).

**Rollback:** Revert the merge. The marketing site (`/`, `/install`, `/features`, `/faq`) remains untouched by these changes (only the header gains one nav link), so reverting is a clean diff.

## Open Questions

None. All decisions in this design were grounded in either the existing codebase or the user's brief.
