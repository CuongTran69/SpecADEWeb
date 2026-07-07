# Spec ADE — Product Overview

> Last updated: 2026-07-07. This document is the authoritative feature inventory for Spec ADE, verified directly against the product source code (`spec-ade/`). It supersedes older framing that described Spec ADE as an "Auggie CLI GUI". The `spec-ade/` source folder can be removed after this document is in place — everything needed to keep the website in sync lives here.

---

## 1. What is Spec ADE

Spec ADE is a **self-hosted GUI and IDE for AI-assisted software development**. It provides a unified environment for AI chat (Auggie, Claude, and ACP agents), PTY terminal emulation, a CodeMirror file editor, a hybrid Git client, a multi-driver database workspace, a Postman-compatible HTTP client, a local port-forwarding proxy, process monitoring, cron-scheduled tasks, and project/session management — all served from a **single Rust binary with an embedded Vue SPA**, opened in the browser on the user's own machine or VPS.

The product targets JetBrains IDE users who want to run AI coding assistants inside a browser-based tool that matches IntelliJ's density and interaction patterns.

---

## 2. Tech Stack and Packaging

### Frontend
- Vue 3 + Quasar v2 + Pinia + TypeScript (Vite via `@quasar/app-vite`)
- 51 Pinia stores (Composition API), all with `acceptHMRUpdate`
- Biome v2 linter, vue-tsc type-checker
- CodeMirror 6 editor: Vim mode (`@replit/codemirror-vim`), minimap (`@replit/codemirror-minimap`), indentation markers, rainbow brackets, MergeView
- Icon library: `lucide-vue-next`
- Package manager: bun

### Backend
- Rust 2024 edition, Axum web framework
- `portable-pty` for PTY spawning, `tokio` async runtime, `git2` (vendored) for git reads
- `sqlx` (Postgres/MySQL/MariaDB/SQLite), `mongodb`, `fred` (Redis) database drivers
- `serde`/`serde_json` for all API types (`camelCase` rename)
- Settings storage: `~/.config/spec-ade/settings.json` (pure JSON, no database required)

### Build and Packaging

| Mode | Command | Output |
|------|---------|--------|
| Single binary (prod) | `just build-release` | `bun build:pwa` embeds SPA via `memory-serve`; `cargo build --release` |
| Desktop (Tauri) | `just build-tauri` | Wraps the same binary as a sidecar inside a native app |
| Dev (UI + API) | `just dev-ui` + `just dev-api` | Quasar dev server port 9000, Axum port 3100 |
| PWA | `quasar build -m pwa` | Service worker via Workbox, offline-capable |
| Background service | `spec-ade --install-service` | Task Scheduler (Win) / launchd (macOS) / systemd (Linux); per-user or root |

- CLI distribution: `npx -y @spec-ade/cli@latest` (npm package `@spec-ade/cli`, requires Node.js `>=18`). Platform binaries are optional deps (`cli-linux-x64/arm64`, `cli-darwin-arm64/x64`, `cli-win32-x64`).
- Default server port `4123`; auto-selects next free port if busy.

### License Portal
A separate Axum service (`spec-ade-portal/`, port 3000) issues Ed25519-signed JWTs bound to the machine fingerprint. The public key is embedded into the main binary at compile time (`spec-ade-api/keys/license-public.key`). Plans: 1m / 1y / 3y / 5y.

---

## 3. Workspace Model

The shell (`src/App.vue`) renders five top-level workspace tabs persisted to `localStorage`.

| Tab | Icon | Description |
|-----|------|-------------|
| **ADE** | Wrench | Main dev environment — all editor, chat, git, terminal panels |
| **Context Engine** | Brain | Embedded external app (EmbeddedAppWorkspace) |
| **Design** | Palette | Embedded external app (EmbeddedAppWorkspace) |
| **Database** | Database | Multi-driver database client |
| **HTTP** | Globe | Postman-compatible HTTP request client |

The ADE workspace renders via `<router-view>`. Database and HTTP are standalone Vue components. Context Engine and Design are wrapped by `EmbeddedAppWorkspace.vue` which proxies to `embedded_app_process.rs` — each can be independently started/stopped via a Power button in the tab bar.

Architecture: `src/App.vue`, `src/components/EmbeddedAppWorkspace.vue`, `spec-ade-api/src/embedded_app_process.rs`, `spec-ade-api/src/routes/embedded_apps.rs`

---

## 4. ADE Workspace Features

### 4.1 Projects and Sessions
Projects map to filesystem paths (unique per project), with custom icon, sort order, and last-opened time. Cascade delete removes all sessions + layout. Sessions are created eagerly with a real UUID; each stores a `cliType` (`auggie` | `claude`), custom title (double-click rename), and drag-reorderable tab order. New project from VCS: clone a repo and create a project in one flow.

Architecture: `src/stores/session-store.ts`, `src/stores/project-store.ts`, `spec-ade-api/src/routes/sessions.rs`, `spec-ade-api/src/routes/projects.rs`

### 4.2 AI Chat and ACP Agents
Sessions run either a PTY-based CLI (Auggie / Claude) or an ACP agent.

**PTY sessions:** xterm.js over WebSocket (`/api/terminals/{id}/ws`); bracketed-paste ready detection (`\x1b[?2004h`) gates input; slash commands (`/` → command → Tab → args → Enter, all delays configurable); command discovery from `.augment/commands/*.md`, `.claude/commands/*.md`, workspace + `$HOME`.

**ACP sessions:** dedicated `std::thread` per connection (ACP futures are `!Send`) running a `current_thread` runtime + `LocalSet`; attach-or-spawn pattern; event log with monotonic sequence numbers and `?after_seq=N` catch-up replay; auto-reconnect with exponential backoff (1s→30s); idle cleanup every 5 min. Builtins: `builtin:auggie`, `builtin:claude`. Custom agents discovered from workspace + home. ACP permission system (human-in-the-loop) for destructive actions.

Architecture: `src/stores/chat-store.ts`, `acp-store.ts`, `agent-registry.ts`, `spec-ade-api/src/acp_manager.rs`, `acp_client.rs`, `acp_history.rs`, `auggie_cli.rs`, `pty.rs`, `terminal_manager.rs`, `routes/acp.rs`

### 4.3 Terminal
Real PTY via `portable-pty` (resize, replay, bracketed paste). xterm instances persist across tab/project switches via a Teleport pool pattern (`treeVersion` counter busts stale selectors; host div uses `v-show`, never `v-if`).

**OSC support:** OSC 5522 image paste (base64-chunked, one-time-password to prevent replay); OSC 7 CWD tracking (`osc7_tail` buffer for split sequences). PTY UTF-8 safety via `utf8_leftover` buffer; PTY write in 1 KB chunks. `ade` shell helper injected into bash/zsh/sh and PowerShell on startup.

Architecture: `src/composables/useSessionXterm.ts`, `useTerminalXterm.ts`, `spec-ade-api/src/terminal_manager.rs`, `pty.rs`

### 4.4 File Editor
CodeMirror 6 with one-dark + custom VS Code theme.
- **Vim mode** (`@replit/codemirror-vim`) and **minimap** (`@replit/codemirror-minimap`)
- Rainbow brackets, indent guides, bracket matching, autocomplete, lint gutter, dynamic language loading (20+ languages)
- Git gutter diff (HEAD vs working tree markers)
- View/edit toggle `⌘K`, save `⌘S`, dirty dot, auto-save on tab switch
- Split right `⌘\`, split down `⌘⇧\`
- Media preview (images/video/audio/PDF), inline diff view, markdown preview (KaTeX, Mermaid, GitHub alerts, footnotes, task lists)

Architecture: `src/stores/file-tab-store.ts`, `src/components/FileEditor.vue`, `MediaPreview.vue`

### 4.5 File Tree and Search
`ignore` crate (gitignore-aware) + hardcoded exclusions (`node_modules`, `.git`). File watcher SSE for live reload. Upload files/ZIP, download ZIP. Document convert (Office/PDF → Markdown), export Markdown → DOCX (`md_to_docx.rs`). Full-text search: ripgrep primary, grep fallback. RTL path truncation keeps filename visible.

Architecture: `src/stores/file-tree-store.ts`, `search-store.ts`, `spec-ade-api/src/routes/files/`, `routes/search.rs`, `routes/upload.rs`, `doc_convert.rs`

### 4.6 Git
Hybrid `git2` + CLI (Zed-inspired): `git2` for fast local reads, CLI for mutations and porcelain v2 status parsing. Per-repo `git_write_locks` mutex for every mutation.
- Stage/unstage/discard, hunk-level apply patch, pre-commit hook detection
- Commit with amend; **AI commit-message** generation (SSE-streamed, OpenAI-compatible/Anthropic/Ollama, API key in OS keychain, `⌘⌥G`)
- Git log graph with lane rendering + cursor pagination (60s cache); branch comparison; blame; interactive rebase; cherry-pick/revert/reset
- Branches (checkout smart/force/stash, create/rename/delete, upstream), remotes, tags, stash, submodules, gitignore editor
- **Worktrees appear as child projects**
- FS watcher + SSE (`CoalesceMap`, scope priority Full > Status > Branches; network FS → poll-only; 3 EventSource failures → polling)

Architecture: `src/stores/git-store*.ts`, `git-log-store.ts`, `spec-ade-api/src/git/`, `git_watcher.rs`, `routes/git/`, `routes/commit_message.rs`, `ai/`

### 4.7 Spec / OpenSpec
Proposal/design/tasks artifact bundles under `openspec/changes/<name>/`. Task patching (`- [ ]` → `- [x]`), archive to `archive/YYYY-MM-DD-<name>/`, shared spec library across projects, frontmatter parsing.

Architecture: `src/stores/spec-store.ts`, `spec-ade-api/src/routes/specs.rs`, `routes/frontmatter.rs`

### 4.8 Plans
Lightweight `plan.md` + `tasks.md` per project; `PlanWorkspace.vue` dialog; plan content handed to a session as context.

Architecture: `src/stores/plan-store.ts`, `spec-ade-api/src/routes/plans.rs`

### 4.9 Goal Agent (Send-with-Goal)
Autonomous loop: a goal-agent supervises a target session and drives it toward a success criterion. On each turn-end, `loop_runner.rs` prompts the goal-agent (`{{goal}}`, `{{conversation}}`, `{{iteration}}`, `{{maxIterations}}`) and parses `<action type="continue|complete">`. Four termination paths: iteration cap, user Stop, parse-failure ×2, agent exit. Live thought/tool/response chunks stream via an ephemeral broadcast channel (bypasses bounded EventLog). Records persisted in `settings.json`; resume-on-boot capped at 50.

Architecture: `src/stores/goal-store.ts`, `spec-ade-api/src/goal/` (action_parser, loop_runner, manager, persistence, prompt), `routes/goal.rs`

### 4.10 Scheduled Tasks
Cron-based task runner (replaces the older "Claw" concept). Create/list/update/delete/run scheduled tasks; jobs fire on any cron expression via a tokio-cron scheduler (`[scheduled]` log prefix). **AI cron generation**: natural language → cron expression (SSE). **Telegram bridge**: test token, fetch chats, notifications on task events, per-task chat id.

Architecture: `src/stores/scheduled-task-store.ts`, `spec-ade-api/src/scheduled_task/` (mod, registry, runner), `routes/scheduled_tasks.rs`, `routes/cron_generate.rs`, `ai/cron.rs`, `routes/telegram.rs`, `telegram_bridge.rs`

### 4.11 AI Prompt Enhancement
Wand button in the composer rewrites a draft prompt (SSE token stream). Shares provider config with commit-message AI; per-request model override.

Architecture: `src/stores/enhance-prompt-store.ts`, `spec-ade-api/src/routes/enhance_prompt.rs`, `ai/enhance.rs`

### 4.12 Skills and Agents Management
Discover/edit/toggle/delete skills (`.augment/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, YAML frontmatter) and ACP agents (same discovery). Workspace priority over `$HOME`. Dedicated `skill-manager` / `agent-manager` tab kinds.

Architecture: `src/stores/skill-store.ts`, `agent-store.ts`, `agent-registry.ts`, `spec-ade-api/src/skills/`, `agents/`, `routes/skills.rs`, `routes/agents.rs`

### 4.13 Runner (Project Tasks)
Detects runnable tasks (`package.json` scripts, `Justfile`, `Makefile`, `deno.json`, Python `__main__`, Rust `main.rs`), detects package manager (bun/pnpm/yarn/npm), spawns them as terminals. Cached per project.

Architecture: `src/stores/runner-store.ts`, `spec-ade-api/src/routes/tasks.rs`, `tasks.rs`

### 4.14 System and Process Monitor
CPU/memory/disk/network via `sysinfo` (polled every 3s), optional NVIDIA GPU via NVML (graceful degradation; `windows_gpu.rs` for Windows). Sortable/filterable process list, kill process, sparklines.

Architecture: `src/stores/system-metrics-store.ts`, `process-monitor-store.ts`, `spec-ade-api/src/routes/system.rs`

### 4.15 Pane and Tab System
Recursive pane tree — `PaneNode` (leaf with tabs) + `AxisNode` (h/v split), unlimited depth, auto-unsplit on last-tab close, drag-resize.

**15 tab kinds:** `session`, `file`, `spec`, `merge`, `diff`, `compare`, `gitlog`, `terminal`, `monitor`, `task`, `skill`, `skill-manager`, `agent`, `agent-manager`, `search`.

Layout persistence per project in `settings.json` + global `lastLayout` + named presets. Pane-responsive breakpoints via `ResizeObserver` on pane dimensions (not viewport).

Architecture: `src/stores/pane-store*.ts`, `tab-store.ts`, `src/models/pane-tree.ts`, `src/components/PaneGroupRenderer.vue`, `PaneContent.vue`

---

## 5. Database Workspace

Multi-driver SQL + NoSQL client. See `docs/database-management.md` and `docs/database-cli-tools.md` for deep-dives.

### Drivers
| Driver | Versions | Native client |
|--------|----------|---------------|
| PostgreSQL | 13+ (incl. 17) | `sqlx` |
| MySQL | 5.7 · 8.0 · 8.4 | `sqlx` |
| MariaDB | 10.6+ · 11.x | `sqlx` (MySQL wire) |
| SQLite | bundled | `sqlx` |
| MongoDB | 6 · 7 | `mongodb` |
| Redis | 6 · 7 | `fred` |

### Features
- **Connections:** CRUD, password in OS keychain (never in `settings.json`; headless Linux → AES-GCM fallback keyed on device ID), parse-from-URL, test before save, tags/color/environment labels
- **Safe Mode:** `read-only` / `strict` / `confirm-destructive` / `off`; auto-escalates to `strict` when `environment = prod/production`; confirmation-token flow for destructive ops
- **Data grid:** paginated, sortable, filterable; WebSocket streaming for large datasets (500 rows/chunk, 4 outstanding chunks, client ACK backpressure); inline edit with deferred commit + SQL preview
- **Query editor:** history (10k, NDJSON-backed, searchable), favorites (1k cap), EXPLAIN (per-driver), cancel via `CancellationToken`, parameterized queries
- **Schema browser** + DDL viewer; **ER diagram** (`@vue-flow/core` + dagre, positions persisted per connection+database)
- **Server dashboard:** per-driver stats, kill session (Safe Mode confirmed)
- **Backup/restore:** per-driver dispatch (bundled `pg_dump`; lazy-download `mariadb-dump`/`mongodump`; `VACUUM INTO`; `BGSAVE`+`.rdb`), optional Argon2id + AES-GCM-256 encryption, WebSocket job progress
- **CLI tools:** bundle permissive-license clients at build time (`SKIP_PG_BUNDLE=1` to skip); lazy-download others into `<config_dir>/spec-ade/cli-cache/` with SHA-256 verification
- **MongoDB:** document viewer, aggregation builder. **Redis:** key tree, typed value viewer, TTL editor
- **Import:** TablePlus/DBeaver/Sequel Ace/Beekeeper (metadata only — never decrypts passwords), CSV, SQL dump
- **SSH tunnel:** `russh`-based local port forwarder, per-rule start/stop, persisted in settings
- 30-minute idle connection reap (`DashMap` for concurrency)

Architecture: `spec-ade-api/src/db/`, `routes/db/`, `src/stores/db-*.ts` (10 stores), `src/components/database/`

---

## 6. HTTP Client Workspace

Postman-compatible HTTP request client (own top-level workspace tab).
- **Structure:** multiple named workspaces; Collections → Folders → Requests with full CRUD; environments with active selection; secret variables (stored separately, never serialized with workspace data)
- **Execution:** SSE-streaming (`POST /api/http/execute/events` streams status/headers/body/timing); in-flight cancellation; variables resolved at send time
- **History:** last 500 entries per workspace, persisted to `history.json`
- **Import/export:** Postman Collection v2.1, Postman Environment, curl import (parses flags into a request)

Architecture: `src/stores/http-client-store.ts`, `src/components/HttpWorkspace.vue`, `spec-ade-api/src/routes/http_client/` (execution, import_export, models, storage)

---

## 7. Port Forwarding

Built-in reverse proxy at `/fw/{port}/{*rest}` — a catch-all handler that forwards HTTP and WebSocket-upgrade traffic to any port on the machine running Spec ADE (dev servers, database admin UIs, local APIs). Hop-by-hop headers filtered per RFC 7230. **This is a local reverse proxy — it does NOT use Cloudflare Tunnel, public URLs, or an Access Key** (earlier marketing framing was inaccurate).

Architecture: `spec-ade-api/src/routes/proxy.rs`

---

## 8. Embedded Apps (Context Engine and Design)

Context Engine and Design are external processes launched on demand and served inside an `<iframe>`. `EmbeddedAppWorkspace.vue` renders the iframe when running, a start screen otherwise. Backend manages lifecycle (start/stop/status), auto-selects a free port, returns `iframe_url`. Design embeds `open-design-ade` (npx child process) with auto-retry on error.

Architecture: `src/components/EmbeddedAppWorkspace.vue`, `spec-ade-api/src/embedded_app_process.rs`, `routes/embedded_apps.rs`

---

## 9. Cross-Cutting Systems

### Authentication
Optional access key (bcrypt hash), session cookie with HMAC secret. `GET /api/auth/status` → `{ authRequired, authenticated }`. `spec-ade --reset-auth` clears stored credentials.

### License
Ed25519 JWT, machine-fingerprint bound. Activate via paste/upload, deactivate. `LicenseActivationPage.vue` shown when unlicensed. Portal at `spec-ade-portal/`.

### Settings
All shareable state in `~/.config/spec-ade/settings.json` (`SharedSettings = Arc<RwLock<AppSettings>>`). Partial update via `Option<Option<T>>` (absent=skip, `null`=clear, value=set). Passwords in OS keychain (`password_keychain_ref` opaque ref in JSON). `localStorage` for device-specific UI only. One-time SQLite→JSON migration retained. Settings sections: Appearance, Editor, Terminal, Shell, Git, AI Commit Messages, Enhance Prompt, Goal Agent, Agent Registry, SSH Tunnels, Port Forwarding, Notifications, Security, License, Advanced.

### Command Palette and Shortcuts
Centralized `shortcut-store.ts` with context-aware `when` priority; JetBrains-compatible with `isMac` detection. `⌘⇧P` palette, `⌘K` view/edit, `⌘S` save, `⌘\` split right, `⌘⇧\` split down, `⌘⌥G` AI commit.

### Boot-ID Restart Detection
Backend generates a UUID `boot_id` per start. Frontend polls `/health` every 5s; on `boot_id` change → clears PTY/ACP state, re-fetches settings, reloads sessions. Seamless recovery.

### Push Notifications and Sounds
VAPID web push (`web_push_native`): key gen, subscribe/unsubscribe, events (task completion, session events). Custom notification sounds: list/upload/delete, per-type settings.

### Dark/Light Mode and Design System
CSS variables in `:root` (dark) + `.body--light` (light). Tokens: `--color-bg/surface/raised/border/text/text-secondary/accent`, spacing `--space-xs`(4px)→`--space-xl`(32px), radius `--radius-xs`→`--radius-xl`, fonts IBM Plex Sans + Lilex. No box-shadow — depth via border/background contrast. Lucide icons (`:size="16" :stroke-width="1.75"`).

### Cross-Platform
Windows/macOS/Linux. `HOME`→`USERPROFILE` fallback; `pwsh.exe`>`cmd.exe`; `$SHELL -l` on Unix; UNC prefix stripping; forward-slash normalization. Background service: per-user or root (Task Scheduler / launchd LaunchAgent+LaunchDaemon / systemd user+system unit). Mobile-first: 44px tap targets on `@media (pointer: coarse)`, `interactive-widget=resizes-content`, `env(keyboard-inset-height)`, long-press context menu.

### Security
OS keychain (`keyring`: macOS Keychain / Windows Credential Manager / Linux libsecret) with headless AES-GCM fallback. Path canonicalization + `starts_with` + `..` rejection. OSC 5522 OTP anti-replay. WebSocket stale-event guard (`state.ws === ws`), `markRaw()` on WS instances.

---

## 10. API Route Groups Reference

| Route prefix | Description |
|---|---|
| `/api/acp/` | ACP connections, WebSocket relay, history |
| `/api/ai/cron/`, `/api/ai/enhance-prompt/` | AI cron gen, prompt enhancement (SSE) |
| `/api/auth/` | Auth status, login, logout, key management |
| `/api/embedded-apps/` | Context Engine / Design lifecycle |
| `/api/http/` | HTTP client workspaces, execution, import/export |
| `/api/license/` | License status, activate, upload, deactivate |
| `/api/projects/` | Projects CRUD; nested: files, git, specs, plans, skills, agents, tasks, worktrees, terminals, sessions, upload, convert, export |
| `/api/push/` | VAPID key, subscribe, unsubscribe |
| `/api/scheduled-tasks/` | Scheduled task CRUD + manual run |
| `/api/sessions/` | Session CRUD and goal management |
| `/api/settings/` | App settings get/put; commit-message API key |
| `/api/ssh-tunnels/` | SSH tunnel management |
| `/api/system/` | System metrics and process list/kill |
| `/api/telegram/` | Telegram token test, chat fetch |
| `/api/terminals/` | Terminal lifecycle and WebSocket I/O |
| `/api/db/` | DB connections, data, query, edit, backup, dashboard, redis, er_layout |
| `/fw/{port}/{*rest}` | Port-forwarding reverse proxy (HTTP + WS) |
| `/api/health` | Boot ID, server version |

### Communication Protocols
| Protocol | Endpoint | Purpose |
|----------|----------|---------|
| REST | `/api/*` | CRUD, git, settings, files, search, system |
| WebSocket | `/api/terminals/{id}/ws` | PTY I/O |
| WebSocket | `/api/acp/{id}/ws` | ACP relay + catch-up replay |
| WebSocket | `/api/db/connections/{id}/ws` | DB streaming |
| SSE | `/api/projects/{id}/git/watch` | Git change events |
| SSE | AI endpoints | commit-message / cron / enhance-prompt token streams |
| Proxy | `/fw/{port}/{*rest}` | Port forwarding to local services (HTTP + WS) |

---

## 11. Notes on this document

- **Source of truth:** this file was verified against `spec-ade/` source code on 2026-07-07. Where the older `FEATURES.md` (2026-05-26) disagreed, the code won — notably: 15 tab kinds (not 9), Vim mode + minimap are real, the "Claw agent farm" has been replaced by **Scheduled Tasks** (cron + Telegram), and port forwarding is a **local reverse proxy** (no Cloudflare/Tunnel/Access Key).
- The website (`SpecADEWeb`) mirrors this document. Copy lives in `src/i18n/strings.ts` (EN+VI) and `src/i18n/docs.ts`; keep both locales in parity when updating.

