# context-engine-page Specification

## Purpose
TBD - created by archiving change add-context-engine-page. Update Purpose after archive.
## Requirements
### Requirement: Context Engine page routes

The system SHALL serve a Context Engine page at `/context-engine` (English) and `/vi/context-engine` (Vietnamese), each rendering through `BaseLayout` with the matching `lang` so SEO meta, canonical, and hreflang alternates are emitted automatically.

#### Scenario: English route renders

- **WHEN** a visitor requests `/context-engine`
- **THEN** the server returns HTTP 200 and renders the page with `lang="en"` content

#### Scenario: Vietnamese route renders

- **WHEN** a visitor requests `/vi/context-engine`
- **THEN** the server returns HTTP 200 and renders the page with `lang="vi"` content

#### Scenario: Language alternate linking

- **WHEN** the Context Engine page is rendered in either locale
- **THEN** `BaseLayout` emits `<link rel="alternate" hreflang>` tags pointing to the other locale's `/context-engine` route

### Requirement: Page content sections

The Context Engine page SHALL present six sections in order: Hero, Features grid, How It Works, Supported Languages, Install, and GitHub CTA. All factual content SHALL be sourced from the vibervn-context-engine README and SHALL NOT include fabricated benchmark metrics.

#### Scenario: Hero section

- **WHEN** the page renders
- **THEN** a hero heading (value proposition), a descriptive subtitle, a primary CTA linking to `https://github.com/nullmastermind/vibervn-context-engine`, a secondary CTA linking to `#how-it-works`, and three factual metric callouts are visible

#### Scenario: Features grid

- **WHEN** the page renders
- **THEN** exactly 12 feature cards are shown, covering: Semantic code search, Multi-language parsing, Call-graph expansion, Incremental indexing, Real-time file watching, Voyage AI embeddings, LLM reranking, Embedded SurrealDB, HTTP API + Web UI, MCP server, SSE progress stream, and Large-repo scaling

#### Scenario: How It Works pipeline

- **WHEN** the page renders the `#how-it-works` section
- **THEN** a two-phase visual flow is shown: an Index phase (detect changed files → tree-sitter parse → Voyage AI embed → SurrealDB store → call-graph resolution → in-memory vector index) and a Query phase (embed query → vector cosine top-k → BFS graph expansion → merge/dedup → LLM rerank → formatted `path#Lstart-end` output), built from existing CSS primitives without any mermaid library

#### Scenario: Supported Languages

- **WHEN** the page renders the languages section
- **THEN** the 9 languages with their real extensions are listed — Python (.py), JavaScript (.js/.jsx/.mjs/.cjs), TypeScript (.ts), TSX (.tsx), Rust (.rs), Go (.go), Java (.java), C (.c), C++ (.cpp/.cc/.cxx/.h/.hpp/.hxx/.hh) — with a note that other file types are chunked and embedded for semantic search only

#### Scenario: Install section

- **WHEN** the page renders the install section
- **THEN** the commands `npx vibervn-context-engine@latest` and `npm install -g vibervn-context-engine@latest` are shown, the default port `6699` (web UI `http://127.0.0.1:6699`, MCP endpoint `/mcp`) is stated, a flag example `--port 8080 --bind 0.0.0.0` is shown, and supported platforms (Linux x64/arm64, macOS arm64, Windows x64) are listed

#### Scenario: GitHub CTA

- **WHEN** the page renders the final CTA section
- **THEN** a prominent link to `https://github.com/nullmastermind/vibervn-context-engine` is visible

### Requirement: Bilingual content via i18n strings

The Context Engine page text SHALL be defined in `src/i18n/strings.ts` under a `contextEnginePage` key present in both the `en` and `vi` objects, with the Vietnamese variant using full diacritics and keeping technical terms (tree-sitter, MCP, SurrealDB, Voyage AI, embeddings, BFS) in their original form. TypeScript's `vi: typeof en` annotation SHALL enforce shape parity.

#### Scenario: Both locales define the content key

- **WHEN** `t('en')` and `t('vi')` are read
- **THEN** both return a populated `contextEnginePage` object of identical shape, and the build type-checks without error

### Requirement: Navigation discoverability

The system SHALL expose the Context Engine page in primary navigation. The header SHALL include a `/context-engine` link in both the desktop nav and the mobile nav, with an active state when the current route is `/context-engine`. The footer SHALL include a `/context-engine` link.

#### Scenario: Header desktop and mobile links

- **WHEN** any page renders the site header
- **THEN** a desktop nav link and a mobile nav link to `/context-engine` are present, the mobile link carries `data-testid="mobile-nav-link-context-engine"`, and both reflect the active state on the `/context-engine` route

#### Scenario: Footer link

- **WHEN** any page renders the site footer
- **THEN** a footer-links entry to `/context-engine` is present

### Requirement: Design system and responsiveness

The page SHALL reuse the existing design tokens and conventions (dark default with light theme via `[data-theme]`, IBM Plex Sans + mono fonts, 150–300 ms transitions, borders on flat sections, subtle box-shadow on elevated cards) and SHALL NOT introduce new npm dependencies. The layout SHALL be responsive with no horizontal overflow at 375 / 768 / 1280 viewports; wide tables or flows SHALL use an `overflow-x: auto` wrapper.

#### Scenario: No horizontal overflow on mobile

- **WHEN** the page is viewed at a 375px viewport
- **THEN** no element causes horizontal page overflow

#### Scenario: Theme parity

- **WHEN** the theme is toggled to light via `[data-theme="light"]`
- **THEN** all page sections remain legible using existing tokens, with no hardcoded colors that break in light mode

### Requirement: Automated coverage

The Playwright suite SHALL assert that both Context Engine routes return 200 and render the hero heading and the GitHub link, and that the header nav link to the page is present.

#### Scenario: Route smoke tests

- **WHEN** the Playwright suite runs
- **THEN** `/context-engine` and `/vi/context-engine` each return 200, show a visible hero heading, and contain a link whose href is `https://github.com/nullmastermind/vibervn-context-engine`

#### Scenario: Nav link present

- **WHEN** the Playwright suite checks the header
- **THEN** a navigation link to `/context-engine` is found

