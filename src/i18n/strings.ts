export type Lang = 'en' | 'vi'

export const en = {
  meta: {
    title: 'Spec ADE — AI-Native Coding Workspace',
    description:
      'Full-stack GUI for AI coding assistants. Multi-CLI chat, recursive panes, hybrid Git, multi-driver database workspace, ACP agents, and the Claw headless agent farm — in a single binary.',
  },
  nav: {
    features: 'Features',
    architecture: 'Architecture',
    faq: 'FAQ',
    getStarted: 'Get Started',
    switchTo: 'Tiếng Việt',
  },
  hero: {
    badge: 'Free during private beta',
    titlePrefix: 'One workspace. Every ',
    titleAccent: 'AI coding agent',
    titleSuffix: '.',
    subtitle:
      'Traditional IDEs were built for typing code by hand. Spec ADE is built for the new way: you describe what you want, AI agents plan and ship it — and you stay in the driver\'s seat.',
    installPrompt: 'Install in one command',
    installComingSoon: 'coming soon · @spec-ade/cli ships with public beta',
    primaryCta: 'Get Started',
    secondaryCta: 'Learn more',
    runningOn: 'Runs on Windows, macOS, and Linux · Tauri desktop · PWA',
  },
  spotlight: {
    claw: {
      hook: 'Run AI agents on a schedule, even while you sleep.',
      body: 'Schedule AI agents like cron jobs. Trigger them from REST. Pause them with one click when they need your input. Connect them to Telegram so you can run a code review from your phone.',
    },
    goal: {
      hook: 'Tell the AI when to stop, not when to continue.',
      body: 'Send a task with a success criterion. The AI iterates — code, test, refine — and a watcher agent decides each turn whether to keep going or call it done. Live thinking streams inline.',
    },
    multiCli: {
      hook: 'Use Claude Code, Auggie, Codex, or any ACP agent — switch with one click.',
      body: "Spec ADE doesn't lock you into a model. The workspace is yours. The agents are guests. Switch CLIs mid-session, attach a custom ACP agent, run multiple in parallel — your chat history stays intact.",
    },
    db: {
      hook: 'Stop alt-tabbing to TablePlus. Your AI can read the DB, you can edit it — same app.',
      body: '6 drivers (Postgres, MySQL, MariaDB, SQLite, MongoDB, Redis), encrypted backups, ER diagrams, SSH tunnels. Safe Mode auto-escalates on production. The AI can query your schema directly.',
    },
    binary: {
      hook: 'One file. No Docker. No Node. Same command on your laptop or your VPS.',
      body: 'The entire app — frontend, backend, embedded SPA — packs into one Rust binary. Install as a desktop app, a PWA, or a user-level service. macOS launchd, Linux systemd, Windows Task Scheduler — no admin required.',
    },
  },
  featuresRecap: {
    title: 'Everything else built in',
    subtitle: 'No plugins, no install scripts. The rest of the workspace.',
    columns: [
      {
        heading: 'Editor & Workspace',
        bullets: [
          { label: 'Recursive splits', desc: 'Stack panes any direction, any depth' },
          { label: '9 tab kinds', desc: 'Code, terminal, git log, database, monitor, in one tab bar' },
          { label: 'Layout presets', desc: 'Save your favorite arrangement, restore in one click' },
          { label: 'xterm Teleport', desc: 'Terminals stay alive when you switch projects' },
          { label: 'CodeMirror 6 + Vim', desc: 'Full editor with Vim mode and minimap' },
          { label: 'Markdown preview', desc: 'KaTeX math, Mermaid diagrams, GitHub alerts' },
          { label: 'Live file watcher', desc: 'Tree updates as files change on disk' },
          { label: 'Slash commands', desc: 'Discover and run AI commands by typing /' },
        ],
      },
      {
        heading: 'Git & Source Control',
        bullets: [
          { label: 'Hybrid git2 + CLI', desc: 'Native-speed reads, full CLI compatibility for writes' },
          { label: 'Log graph with lanes', desc: 'Visual commit tree with branch labels' },
          { label: '3-way merge editor', desc: 'Resolve conflicts visually, hunk by hunk' },
          { label: 'Interactive rebase', desc: 'Drag-reorder commits, squash, fixup, drop' },
          { label: 'Blame & diff', desc: 'See who wrote each line, hunk-stage, branch compare' },
          { label: 'Worktrees as projects', desc: 'Multiple branches checked out, no stashing' },
          { label: 'AI commit messages', desc: 'Sparkles button drafts a commit from the diff' },
          { label: 'Live status', desc: 'SSE-driven, debounced, network-FS aware' },
        ],
      },
      {
        heading: 'Terminal, System & Cross-Platform',
        bullets: [
          { label: 'PTY emulation', desc: 'Real shell, full UTF-8 safety, OSC sequences' },
          { label: 'Port forwarding proxy', desc: 'Tunnel local services through the workspace' },
          { label: 'Process monitor', desc: 'Live CPU/RAM/disk/GPU, sortable, killable' },
          { label: 'Mobile-first PWA', desc: 'Touch targets, virtual keyboard handling' },
          { label: 'Tauri desktop', desc: 'Native installers for macOS, Windows, Linux' },
          { label: 'User-level service', desc: 'Auto-start on login, no admin needed' },
          { label: 'Boot ID restart', desc: 'Browser auto-reconnects when server restarts' },
          { label: 'OSC 5522 image paste', desc: 'Paste screenshots directly into AI chats' },
        ],
      },
    ],
  },
  whatIsSpecAde: {
    chip: 'What is Spec ADE?',
    title: 'What is Spec ADE?',
    pillar1Title: 'An Agentic Development Environment, not just an editor',
    pillar1Body:
      'Software used to mean writing every line by hand. Then AI assistants made hand-writing faster. Spec ADE is something different — you describe what you want to build, and AI agents handle the planning, coding, and testing. You stay in charge of the direction.',
    pillar2Title: 'Specs, not prompts',
    pillar2Body:
      'The difference between an AI chatbot and an ADE is one word: spec. A chatbot reacts to prompts. Spec ADE works from a living specification — a structured plan that all agents share, update, and verify against. That\'s why the code agents produce here is coherent and shippable, not a pile of one-off snippets.',
    pillar3Title: 'Built for parallel agents',
    pillar3Body:
      'Even the best AI IDEs were designed for one developer in one workspace. Spec ADE is built for a world where multiple agents work in parallel on the same codebase — with isolated execution, multi-agent orchestration, and human-in-the-loop review at the moments that matter.',
    comparisonTitle: 'How Spec ADE is different',
    comparisonHeaders: ['Traditional IDE', 'AI IDE', 'Spec ADE'],
    comparisonRows: [
      { label: 'Operator', cols: ['Human writes every line', 'Human + AI suggestions', 'AI agents execute, you direct'] },
      { label: 'Unit of work', cols: ['Lines and functions', 'Files and features', 'Goals and lifecycles'] },
      { label: 'Source of truth', cols: ['Code itself', 'Ad-hoc prompts', 'Living specification'] },
      { label: 'Who is it for', cols: ['Developers', 'Developers using AI', 'Anyone with an idea'] },
    ],
  },
  architecture: {
    chip: 'Protocols',
    title: 'Built for performance, designed for trust',
    subtitle:
      'Spec ADE is a Rust + Vue 3 stack that ships as a single binary. Frontend and backend speak REST, WebSocket, and SSE; everything else stays local.',
    backend: 'Backend (Rust 2024 + Axum)',
    frontend: 'Frontend (Vue 3 + Quasar + Pinia)',
    storage: 'Storage',
    backendDesc:
      'PTY manager, ACP threading model, hybrid Git engine, six-driver DB layer, Goal/Claw runners, license verification — all coordinated through a typed AppState.',
    frontendDesc:
      'Fifty-plus Pinia stores in Composition API, recursive pane tree, xterm Teleport pool, CodeMirror 6 with Vim and minimap, and a context-aware shortcut store.',
    storageDesc:
      'Single `~/.config/spec-ade/settings.json` file. Passwords go to the OS keychain (with AES-GCM headless fallback). License keys come from the Ed25519-signing portal.',
  },
  tech: {
    title: 'Modern stack, no compromises',
    items: [
      { name: 'Rust 2024', desc: 'Axum, tokio, portable-pty, git2 (vendored), sqlx' },
      { name: 'Vue 3 + Quasar v2', desc: 'Pinia (Composition API), Vite, TypeScript strict' },
      { name: 'CodeMirror 6', desc: 'Vim, minimap, language servers, MergeView' },
      { name: 'Tauri', desc: 'Cross-platform desktop wrapper with sidecar pattern' },
      { name: 'WebSocket / SSE', desc: 'PTY I/O, ACP relay, DB streaming, git events' },
      { name: 'Ed25519', desc: 'License signing & verification via spec-ade-portal' },
    ],
  },
  useCases: {
    title: 'Built for every kind of builder',
    items: [
      {
        role: 'AI-Coding Engineers',
        desc: 'Run Claude Code and Auggie side-by-side, attach ACP agents, and dispatch goal-driven tasks while you keep building.',
      },
      {
        role: 'DBAs & Data Engineers',
        desc: 'Six-driver console, Safe Mode for production, EXPLAIN visualizers, ER diagrams, encrypted backups — in the same window as your code.',
      },
      {
        role: 'DevOps & SREs',
        desc: 'PTY terminals with port forwarding, system metrics, GPU monitoring, background services, and a single-file deploy story.',
      },
      {
        role: 'Mobile-First Teams',
        desc: 'Touch targets, virtual keyboard handling, long-press context menus, and a PWA build mean the workspace works on tablets and phones too.',
      },
    ],
  },
  trust: {
    ai: { value: '4+', label: 'AI agents supported' },
    db: { value: '6', label: 'Database drivers' },
    deploy: { value: '1 binary', label: 'No Docker. No setup.' },
    privacy: { value: '100%', label: 'Local-first. Project files stay on your machine.' },
  },
  screenshots: {
    title: 'See it in action',
    subtitle: 'Screenshots coming soon.',
    items: [
      { title: 'Multi-pane workspace' },
      { title: 'Database workspace' },
      { title: 'Goal-Agent in action' },
      { title: 'Git workflow' },
      { title: 'System monitor' },
    ],
  },
  licenseModel: {
    chip: 'License',
    title: 'Free during private beta',
    body: 'Spec ADE is a private product by the viber.vn team. It is free to use during the current beta period. Each install is bound to a machine ID — contact our support team to receive your activation key.',
    faqLink: 'See FAQ for details',
  },
  faq: {
    title: 'Frequently asked questions',
    subtitle: 'Honest answers about access, privacy, and how Spec ADE works.',
    pageTitle: 'Frequently asked questions',
    backToHome: '← Back to home',
    seeAll: 'See all questions →',
    items: [
      {
        q: 'Is Spec ADE open source?',
        a: 'Not yet — Spec ADE is a private product developed by the viber.vn team. The source code is not public today. We plan to open-source it in the future once the product reaches stable maturity.',
      },
      {
        q: 'How much does it cost?',
        a: 'Spec ADE is free to use during the current private beta. Pricing for future tiers will be announced separately — beta users will get advance notice and grandfathered terms.',
      },
      {
        q: 'How do I install it?',
        a: 'Run `npx -y @spec-ade/cli@latest` in your terminal. The CLI bootstraps Spec ADE on your local machine or your own VPS and opens it in your browser automatically. No need to clone a repo or compile anything yourself.',
      },
      {
        q: 'Can I self-host on my own VPS?',
        a: 'Yes. The same `npx -y @spec-ade/cli@latest` command runs on any machine — laptop, workstation, or VPS. Spec ADE serves both the API and the embedded SPA on the same port. No cloud dependency.',
      },
      {
        q: 'How do I activate my install?',
        a: 'On first run, Spec ADE shows an activation page with your machine ID in the format `ADE-xxx` (a fingerprint derived from your hardware). Send the ID to the viber.vn support team and we will issue a signed activation key.',
      },
      {
        q: 'How do I contact support to get a key?',
        a: 'Reach out to the viber.vn support team via the official viber.vn channels. Include your machine ID (`ADE-xxx` format) shown on the activation page. Keys are issued manually during the private beta.',
      },
      {
        q: 'Does my code or data leave my machine?',
        a: 'No — all project data, settings, and credentials stay local. Settings are stored in `~/.config/spec-ade/settings.json` and passwords go to the OS keychain. The only outbound calls are the ones you initiate yourself (AI CLI, git remotes, database connections).',
      },
      {
        q: 'What platforms are supported?',
        a: 'Windows, macOS, and Linux are all first-class targets. Spec ADE also ships as a Tauri desktop app and a PWA. The same binary runs on all three platforms.',
      },
    ],
  },
  getStarted: {
    chip: 'Install',
    title: 'Ready in under a minute',
    subtitle: 'One command installs Spec ADE on your machine or your own VPS.',
    pageTitle: 'Install Spec ADE',
    pageSubtitle: 'Get Spec ADE running on your machine or VPS in under a minute.',
    macTab: 'macOS',
    linuxTab: 'Linux',
    winTab: 'Windows',
    sourceTab: 'VPS',
    installLabel: 'Install & run',
    serviceLabel: 'Optional · install as a user-level service',
    note: 'Spec ADE serves both the API and the embedded SPA on the same port. No web server required.',
    comingSoonNote: 'On first run, Spec ADE shows your machine ID (format `ADE-xxx`). Send it to the viber.vn support team to receive your activation key.',
    recommendedBadge: '★ Recommended',
    autoOpenNote: 'After running, Spec ADE opens automatically in your browser.',
    vpsNote: 'On a VPS, the CLI prints the URL — open it from your local browser.',
    nodejsRequired: 'Spec ADE requires Node.js 22 or later.',
    dontHaveNpx: "Don't have npm/npx installed?",
    installNode: 'Install Node.js',
    nodeMac: 'macOS',
    nodeLinux: 'Linux',
    nodeWin: 'Windows',
    npmComingSoon: '@spec-ade/cli is not yet published on npm. The install commands below are aspirational — they will work once the public beta launches.',
  },
  footer: {
    tagline: 'AI-native workspace by the viber.vn team.',
    links: 'Links',
    docs: 'Documentation',
    support: 'Support',
    supportHref: 'mailto:hi@viber.vn',
    rights: 'All rights reserved.',
  },
}

export const vi: typeof en = {
  meta: {
    title: 'Spec ADE — Workspace lập trình AI-native',
    description:
      'GUI full-stack cho AI coding assistants. Multi-CLI chat, recursive panes, Git hybrid, database 6 drivers, ACP agents, và Claw headless agent farm — trong một binary duy nhất.',
  },
  nav: {
    features: 'Tính năng',
    architecture: 'Kiến trúc',
    faq: 'FAQ',
    getStarted: 'Bắt đầu',
    switchTo: 'English',
  },
  hero: {
    badge: 'Miễn phí trong giai đoạn beta',
    titlePrefix: 'Một workspace. Mọi ',
    titleAccent: 'AI coding agent',
    titleSuffix: '.',
    subtitle:
      'IDE truyền thống được sinh ra để gõ code bằng tay. Spec ADE được sinh ra cho cách làm việc mới: bạn mô tả muốn xây gì, AI agents lên kế hoạch và ship — bạn vẫn là người cầm lái.',
    installPrompt: 'Cài đặt trong một lệnh',
    installComingSoon: 'sắp ra mắt · @spec-ade/cli sẽ có khi public beta',
    primaryCta: 'Bắt đầu ngay',
    secondaryCta: 'Tìm hiểu thêm',
    runningOn: 'Chạy trên Windows, macOS, Linux · Tauri desktop · PWA',
  },
  spotlight: {
    claw: {
      hook: 'Chạy AI agents theo lịch, kể cả khi bạn đang ngủ.',
      body: 'Lập lịch AI agents như cron job. Trigger qua REST. Pause bằng một click khi agent cần ý kiến của bạn. Kết nối Telegram để chạy code review từ điện thoại.',
    },
    goal: {
      hook: 'Nói AI khi nào dừng, không phải khi nào tiếp tục.',
      body: 'Gửi task kèm tiêu chí thành công. AI tự lặp — code, test, refine — và một watcher agent quyết định mỗi turn nên tiếp tục hay đã xong. Live thinking stream inline.',
    },
    multiCli: {
      hook: 'Dùng Claude Code, Auggie, Codex, hoặc bất kỳ ACP agent nào — đổi chỉ một click.',
      body: 'Spec ADE không khóa bạn vào một model. Workspace là của bạn. Agents là khách. Đổi CLI giữa session, attach ACP agent tùy chỉnh, chạy nhiều agent song song — chat history của bạn vẫn còn nguyên.',
    },
    db: {
      hook: 'Đừng alt-tab sang TablePlus nữa. AI đọc được DB, bạn edit được — cùng một app.',
      body: '6 drivers (Postgres, MySQL, MariaDB, SQLite, MongoDB, Redis), backup mã hóa, ER diagram, SSH tunnel. Safe Mode tự nâng cấp ở production. AI có thể query schema trực tiếp.',
    },
    binary: {
      hook: 'Một file. Không Docker. Không Node. Cùng lệnh trên laptop hay VPS.',
      body: 'Toàn bộ ứng dụng — frontend, backend, SPA embedded — đóng gói trong một Rust binary. Cài như desktop app, PWA, hoặc user-level service. macOS launchd, Linux systemd, Windows Task Scheduler — không cần admin.',
    },
  },
  featuresRecap: {
    title: 'Mọi thứ khác đã có sẵn',
    subtitle: 'Không plugin, không install script. Phần còn lại của workspace.',
    columns: [
      {
        heading: 'Editor & Workspace',
        bullets: [
          { label: 'Recursive splits', desc: 'Chia pane theo bất kỳ hướng nào, bất kỳ độ sâu nào' },
          { label: '9 loại tab', desc: 'Code, terminal, git log, database, monitor, trong cùng một tab bar' },
          { label: 'Layout presets', desc: 'Lưu bố cục yêu thích, restore chỉ một click' },
          { label: 'xterm Teleport', desc: 'Terminal vẫn chạy khi bạn chuyển project' },
          { label: 'CodeMirror 6 + Vim', desc: 'Editor đầy đủ với Vim mode và minimap' },
          { label: 'Markdown preview', desc: 'KaTeX math, Mermaid diagrams, GitHub alerts' },
          { label: 'Live file watcher', desc: 'Tree tự update khi file thay đổi trên đĩa' },
          { label: 'Slash commands', desc: 'Khám phá và chạy AI commands bằng cách gõ /' },
        ],
      },
      {
        heading: 'Git & Source Control',
        bullets: [
          { label: 'Hybrid git2 + CLI', desc: 'Đọc native-speed, ghi đầy đủ tương thích CLI' },
          { label: 'Log graph với lanes', desc: 'Cây commit trực quan với branch labels' },
          { label: '3-way merge editor', desc: 'Resolve conflict trực quan, từng hunk' },
          { label: 'Interactive rebase', desc: 'Drag-reorder commit, squash, fixup, drop' },
          { label: 'Blame & diff', desc: 'Xem ai viết từng dòng, hunk-stage, so branch' },
          { label: 'Worktrees as projects', desc: 'Nhiều branch checkout cùng lúc, không cần stash' },
          { label: 'AI commit messages', desc: 'Nút sparkles tự draft commit từ diff' },
          { label: 'Live status', desc: 'SSE-driven, debounced, network-FS aware' },
        ],
      },
      {
        heading: 'Terminal, System & Cross-Platform',
        bullets: [
          { label: 'PTY emulation', desc: 'Shell thực, UTF-8 đầy đủ, OSC sequences' },
          { label: 'Port forwarding proxy', desc: 'Tunnel local services qua workspace' },
          { label: 'Process monitor', desc: 'Live CPU/RAM/disk/GPU, sortable, killable' },
          { label: 'Mobile-first PWA', desc: 'Touch target, virtual keyboard handling' },
          { label: 'Tauri desktop', desc: 'Native installers cho macOS, Windows, Linux' },
          { label: 'User-level service', desc: 'Auto-start khi login, không cần admin' },
          { label: 'Boot ID restart', desc: 'Browser tự reconnect khi server restart' },
          { label: 'OSC 5522 image paste', desc: 'Paste ảnh trực tiếp vào AI chat' },
        ],
      },
    ],
  },
  whatIsSpecAde: {
    chip: 'Spec ADE là gì?',
    title: 'Spec ADE là gì?',
    pillar1Title: 'Một Agentic Development Environment, không chỉ là editor',
    pillar1Body:
      'Phần mềm trước đây có nghĩa là gõ từng dòng code bằng tay. AI assistants đến và làm việc gõ tay nhanh hơn. Spec ADE khác hẳn — bạn mô tả muốn xây gì, AI agents lo phần kế hoạch, code, và test. Bạn nắm quyền quyết định hướng đi.',
    pillar2Title: 'Spec, không phải prompt',
    pillar2Body:
      'Khác biệt giữa một AI chatbot và một ADE chỉ một từ: spec. Chatbot phản ứng theo prompt. Spec ADE làm việc với một bản spec sống — kế hoạch có cấu trúc mà mọi agent đều theo, update, và verify. Đó là lý do code các agent sinh ra coherent và ship được thật, không phải đống snippet rời rạc.',
    pillar3Title: 'Built cho nhiều agent chạy song song',
    pillar3Body:
      'Kể cả AI IDE tốt nhất cũng được thiết kế cho một developer trong một workspace. Được thiết kế cho thế giới nơi nhiều agent làm việc song song trên cùng codebase — với execution riêng biệt, orchestration đa agent, và human-in-the-loop review ở những moment quan trọng.',
    comparisonTitle: 'Spec ADE khác biệt như thế nào',
    comparisonHeaders: ['IDE truyền thống', 'AI IDE', 'Spec ADE'],
    comparisonRows: [
      { label: 'Người vận hành', cols: ['Con người viết từng dòng', 'Con người + AI gợi ý', 'AI agents thực thi, bạn định hướng'] },
      { label: 'Đơn vị công việc', cols: ['Dòng và hàm', 'File và tính năng', 'Mục tiêu và vòng đời'] },
      { label: 'Nguồn sự thật', cols: ['Chính code', 'Prompt tùy hứng', 'Bản spec sống'] },
      { label: 'Dành cho ai', cols: ['Developer', 'Developer dùng AI', 'Bất kỳ ai có ý tưởng'] },
    ],
  },
  architecture: {
    chip: 'Giao thức',
    title: 'Hiệu năng cao, thiết kế để tin cậy',
    subtitle:
      'Spec ADE là stack Rust + Vue 3 ship như single binary. Frontend và backend nói REST, WebSocket, SSE; mọi thứ khác đều local.',
    backend: 'Backend (Rust 2024 + Axum)',
    frontend: 'Frontend (Vue 3 + Quasar + Pinia)',
    storage: 'Storage',
    backendDesc:
      'PTY manager, ACP threading model, Git engine hybrid, DB layer 6 drivers, Goal/Claw runners, license verification — đều phối hợp qua AppState typed.',
    frontendDesc:
      'Hơn 50 Pinia stores Composition API, recursive pane tree, xterm Teleport pool, CodeMirror 6 với Vim và minimap, shortcut store context-aware.',
    storageDesc:
      'Một file `~/.config/spec-ade/settings.json` duy nhất. Password lưu OS keychain (AES-GCM fallback nếu headless). License keys ký Ed25519 từ portal.',
  },
  tech: {
    title: 'Modern stack, không thỏa hiệp',
    items: [
      { name: 'Rust 2024', desc: 'Axum, tokio, portable-pty, git2 (vendored), sqlx' },
      { name: 'Vue 3 + Quasar v2', desc: 'Pinia (Composition API), Vite, TypeScript strict' },
      { name: 'CodeMirror 6', desc: 'Vim, minimap, language servers, MergeView' },
      { name: 'Tauri', desc: 'Desktop wrapper đa nền tảng với sidecar pattern' },
      { name: 'WebSocket / SSE', desc: 'PTY I/O, ACP relay, DB streaming, git events' },
      { name: 'Ed25519', desc: 'License signing & verification qua spec-ade-portal' },
    ],
  },
  useCases: {
    title: 'Dành cho mọi kiểu developer',
    items: [
      {
        role: 'AI-Coding Engineers',
        desc: 'Chạy Claude Code và Auggie song song, attach ACP agents, dispatch goal-driven tasks trong khi vẫn tiếp tục code.',
      },
      {
        role: 'DBA & Data Engineer',
        desc: 'Console 6 drivers, Safe Mode cho production, EXPLAIN visualizer, ER diagram, backup mã hóa — cùng cửa sổ với code.',
      },
      {
        role: 'DevOps & SRE',
        desc: 'PTY terminal với port forwarding, system metrics, GPU monitoring, background services, deploy 1 file duy nhất.',
      },
      {
        role: 'Mobile-First Teams',
        desc: 'Touch targets, xử lý virtual keyboard, long-press context menu, và PWA build cho phép workspace chạy trên tablet và phone.',
      },
    ],
  },
  trust: {
    ai: { value: '4+', label: 'AI agents hỗ trợ' },
    db: { value: '6', label: 'Database drivers' },
    deploy: { value: '1 binary', label: 'Không Docker. Không setup.' },
    privacy: { value: '100%', label: 'Local-first. File project ở lại máy bạn.' },
  },
  screenshots: {
    title: 'Xem thực tế',
    subtitle: 'Screenshots sắp ra mắt.',
    items: [
      { title: 'Multi-pane workspace' },
      { title: 'Database workspace' },
      { title: 'Goal-Agent in action' },
      { title: 'Git workflow' },
      { title: 'System monitor' },
    ],
  },
  licenseModel: {
    chip: 'License',
    title: 'Miễn phí trong giai đoạn private beta',
    body: 'Spec ADE là sản phẩm private do team viber.vn phát triển. Hiện đang miễn phí trong giai đoạn beta. Mỗi cài đặt được gắn với một machine ID — liên hệ team support để nhận key kích hoạt.',
    faqLink: 'Xem FAQ để biết thêm',
  },
  faq: {
    title: 'Câu hỏi thường gặp',
    subtitle: 'Câu trả lời thành thật về cách dùng, privacy, và cách Spec ADE hoạt động.',
    pageTitle: 'Câu hỏi thường gặp',
    backToHome: '← Về trang chủ',
    seeAll: 'Xem tất cả câu hỏi →',
    items: [
      {
        q: 'Spec ADE có open source không?',
        a: 'Hiện chưa — Spec ADE là sản phẩm private do team viber.vn phát triển. Source code chưa public. Chúng tôi dự kiến open-source trong tương lai khi sản phẩm đạt độ ổn định.',
      },
      {
        q: 'Spec ADE có mất phí không?',
        a: 'Spec ADE hiện miễn phí trong giai đoạn private beta. Giá cho các tier sau sẽ được thông báo riêng — beta users sẽ được báo trước và hưởng điều kiện grandfathered.',
      },
      {
        q: 'Cài đặt như thế nào?',
        a: 'Chạy `npx -y @spec-ade/cli@latest` trong terminal. CLI tự bootstrap Spec ADE trên máy local hoặc VPS của bạn và tự mở trên trình duyệt. Không cần clone repo hay compile thủ công.',
      },
      {
        q: 'Tôi có thể tự host trên VPS riêng không?',
        a: 'Có. Cùng lệnh `npx -y @spec-ade/cli@latest` chạy được trên mọi máy — laptop, workstation, hay VPS. Spec ADE serve cả API và SPA embedded trên cùng port. Không cloud dependency.',
      },
      {
        q: 'Làm sao kích hoạt sau khi cài?',
        a: 'Lần đầu chạy, Spec ADE hiển thị trang kích hoạt với machine ID dạng `ADE-xxx` (fingerprint từ phần cứng máy bạn). Gửi machine ID này cho team support viber.vn, chúng tôi sẽ cấp signed key.',
      },
      {
        q: 'Liên hệ support viber.vn để lấy key thế nào?',
        a: 'Liên hệ team support qua các kênh chính thức của viber.vn. Kèm theo machine ID dạng `ADE-xxx` hiển thị trên trang kích hoạt. Trong giai đoạn private beta, key được cấp thủ công bởi team.',
      },
      {
        q: 'Code hay data của tôi có rời máy không?',
        a: 'Không — tất cả project data, settings, và credentials đều ở local. Settings lưu trong `~/.config/spec-ade/settings.json` và passwords vào OS keychain. Các outbound calls duy nhất là những gì bạn tự khởi tạo (AI CLI, git remotes, database connections).',
      },
      {
        q: 'Những nền tảng nào được hỗ trợ?',
        a: 'Windows, macOS, và Linux đều là first-class targets. Spec ADE cũng ship như Tauri desktop app và PWA. Cùng binary chạy trên cả ba nền tảng.',
      },
    ],
  },
  getStarted: {
    chip: 'Cài đặt',
    title: 'Sẵn sàng dưới một phút',
    subtitle: 'Một lệnh duy nhất để cài Spec ADE trên máy hoặc VPS của bạn.',
    pageTitle: 'Cài đặt Spec ADE',
    pageSubtitle: 'Cài Spec ADE trên máy hoặc VPS dưới 1 phút.',
    macTab: 'macOS',
    linuxTab: 'Linux',
    winTab: 'Windows',
    sourceTab: 'VPS',
    installLabel: 'Cài và chạy',
    serviceLabel: 'Tùy chọn · cài thành user-level service',
    note: 'Spec ADE serve cả API và SPA embedded trên cùng port. Không cần web server riêng.',
    comingSoonNote: 'Lần đầu chạy, Spec ADE hiển thị machine ID (dạng `ADE-xxx`). Gửi cho team support viber.vn để nhận key kích hoạt.',
    recommendedBadge: '★ Khuyến nghị',
    autoOpenNote: 'Sau khi chạy, Spec ADE tự mở trên trình duyệt của bạn.',
    vpsNote: 'Trên VPS, CLI sẽ in URL — bạn mở từ browser local.',
    nodejsRequired: 'Spec ADE cần Node.js 22 trở lên.',
    dontHaveNpx: 'Chưa cài npm/npx?',
    installNode: 'Cài Node.js',
    nodeMac: 'macOS',
    nodeLinux: 'Linux',
    nodeWin: 'Windows',
    npmComingSoon: '@spec-ade/cli chưa được publish lên npm. Các lệnh cài đặt bên dưới là dự kiến — chúng sẽ hoạt động khi public beta ra mắt.',
  },
  footer: {
    tagline: 'Workspace AI-native do team viber.vn phát triển.',
    links: 'Liên kết',
    docs: 'Tài liệu',
    support: 'Hỗ trợ',
    supportHref: 'mailto:hi@viber.vn',
    rights: 'Bảo lưu mọi quyền.',
  },
}

export const dict = { en, vi } as const

export function t(lang: Lang): typeof en {
  return dict[lang]
}
