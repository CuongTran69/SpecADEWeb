import type { Lang } from '~/i18n/strings'

export type Localized<T = string> = Record<Lang, T>

export type TableRow = { col1: Localized; col2: Localized }

export type KitSection =
  | { type: 'p'; html: Localized }
  | { type: 'callout'; html: Localized }
  | { type: 'h2'; text: Localized }
  | { type: 'h3'; text: Localized }
  | { type: 'ul'; items: Localized[] }
  | { type: 'pre'; code: Localized }
  | { type: 'table'; cols: Localized[]; rows: TableRow[] }
  | { type: 'copy'; label: Localized; hint?: Localized; command: string }
  | { type: 'skills-grid' }
  | { type: 'subagents-grid' }

export const OPENSPEC_CLI_CMD = 'npm i -g @fission-ai/openspec@latest'
export const KIT_INSTALL_CMD = 'bunx @dccxx/auggiegw@latest kit cmnh98bn200o5ro01gvq96wy1'

const workflowMainVi = `  User gọi command
  (/osf feat, /osf fix, /osf chore, ...)
         |
         v
  +------+-------+
  |  PLAN PHASE  |  <-- Explore codebase, clarify requirements
  |  (command)   |      Không implement, chỉ lên kế hoạch
  +------+-------+      Delegate osf-analyze khi cần structural insight
         |
         v
  Scope nhỏ hay lớn?
         |
    +----------+-----------+
    |          |           |
  Nhỏ        Lớn       Autopilot
    |          |           |
    v          v           v
  Apply     Tạo spec    Tự động chạy
  luôn      trước       spec → apply → verify
    |         |          (không dừng)
    |    proposal            |
    |    subagent             |
    |         |               |
    |         v               |
    +-----> APPLY PHASE <-----+
           (apply subagent)
           Viết code
           Auto-verify nếu rủi ro cao
                |
                v
          VERIFY PHASE (tùy chọn)
          (verify subagent)
                |
                v
          ARCHIVE PHASE (chỉ khi có spec)
          (archive subagent)`

const workflowMainEn = `  User invokes a command
  (/osf feat, /osf fix, /osf chore, ...)
         |
         v
  +------+-------+
  |  PLAN PHASE  |  <-- Explore codebase, clarify requirements
  |  (command)   |      No implementation — planning only
  +------+-------+      Delegate osf-analyze for structural insight
         |
         v
  Small or large scope?
         |
    +----------+-----------+
    |          |           |
  Small      Large     Autopilot
    |          |           |
    v          v           v
  Apply     Create spec  Auto-run
  directly  first        spec → apply → verify
    |         |           (no stops)
    |    proposal            |
    |    subagent             |
    |         |               |
    |         v               |
    +-----> APPLY PHASE <-----+
           (apply subagent)
           Write code
           Auto-verify if high risk
                |
                v
          VERIFY PHASE (optional)
          (verify subagent)
                |
                v
          ARCHIVE PHASE (spec-driven only)
          (archive subagent)`

const workflowAutopilotVi = `  /osf autopilot [request]
         |
         v
  Classify (feat/fix/chore/...)
         |
         v
  Autonomous exploration
  (cùng độ sâu brainstorm,
   tự quyết mọi thứ,
   dùng osf-analyze cho structural insight)
         |
         v
  spec → apply → verify → archive
  (verify-fix loop nếu có CRITICAL)
         |
         v
  ✅ Done (không dừng lần nào)`

const workflowAutopilotEn = `  /osf autopilot [request]
         |
         v
  Classify (feat/fix/chore/...)
         |
         v
  Autonomous exploration
  (brainstorm-level depth,
   decides everything,
   uses osf-analyze for structural insight)
         |
         v
  spec → apply → verify → archive
  (verify-fix loop on CRITICAL)
         |
         v
  ✅ Done (never stops midway)`

const exampleAutopilotVi = `User: /osf autopilot thêm refresh token cho auth flow

AI:  Autopilot: classifying as feat
     [Autonomous exploration] Đọc code, trace auth flow...
     Quyết định: dùng rotating refresh token, lưu DB, 7-day expiry.

     Starting pipeline: spec → implement → verify

     [proposal] Tạo spec...
     [osf-apply] Implement 5 tasks...
     [osf-verify] Kiểm tra... 1 CRITICAL found
     [osf-apply] Fix CRITICAL...
     [osf-verify] Re-verify... All clear ✓
     [osf-archive] Archived ✓

     ✅ Autopilot complete.`

const exampleAutopilotEn = `User: /osf autopilot add refresh token to auth flow

AI:  Autopilot: classifying as feat
     [Autonomous exploration] Read code, trace auth flow...
     Decision: rotating refresh token, DB storage, 7-day expiry.

     Starting pipeline: spec → implement → verify

     [proposal] Create spec...
     [osf-apply] Implement 5 tasks...
     [osf-verify] Check... 1 CRITICAL found
     [osf-apply] Fix CRITICAL...
     [osf-verify] Re-verify... All clear ✓
     [osf-archive] Archived ✓

     ✅ Autopilot complete.`

const exampleBrainstormVi = `User: /osf feat thêm hệ thống notification realtime

AI:  [Plan phase] Explore, brainstorm...
     (nhiều lượt trao đổi)
     Ready to implement!

User: /osf autopilot

AI:  [Picks up brainstorm context]
     Starting pipeline: spec → implement → verify
     ...
     ✅ Done.`

const exampleBrainstormEn = `User: /osf feat add realtime notification system

AI:  [Plan phase] Explore, brainstorm...
     (multiple back-and-forth rounds)
     Ready to implement!

User: /osf autopilot

AI:  [Picks up brainstorm context]
     Starting pipeline: spec → implement → verify
     ...
     ✅ Done.`

const exampleSmallVi = `User: /osf fix login không redirect sau khi đăng nhập

AI:  [Plan phase] Explore codebase...
     Tìm thấy vấn đề ở AuthCallback component.
     Scope nhỏ — fix 1 file.

     Apply luôn không? (y/n)

User: y

AI:  [Delegates to apply subagent]
     apply: Fix redirect logic, mark done.
     Verify không cần thiết cho fix nhỏ này.`

const exampleSmallEn = `User: /osf fix login does not redirect after sign-in

AI:  [Plan phase] Explore codebase...
     Found issue in AuthCallback component.
     Small scope — one file fix.

     Apply directly? (y/n)

User: y

AI:  [Delegates to apply subagent]
     apply: Fix redirect logic, mark done.
     Verify not needed for this small fix.`

const exampleLargeVi = `User: /osf feat thêm hệ thống notification realtime

AI:  [Plan phase] Explore codebase, clarify requirements...
     Scope lớn — cần WebSocket, DB schema, UI components.

     Tạo spec trước hay apply luôn?

User: tạo spec

AI:  [Delegates to proposal subagent]
     proposal: Tạo proposal.md, design.md, tasks.md

     [Auto-chains to apply subagent]
     apply: Implement từng task, auto-verify sau khi xong.

     Verify đầy đủ không?

User: có

AI:  [Delegates to verify subagent]
     verify: Kiểm tra implementation vs spec, report issues.

     Archive change không?

User: có

AI:  [Delegates to archive subagent]`

const exampleLargeEn = `User: /osf feat add realtime notification system

AI:  [Plan phase] Explore codebase, clarify requirements...
     Large scope — WebSocket, DB schema, UI components needed.

     Create spec first or apply directly?

User: create spec

AI:  [Delegates to proposal subagent]
     proposal: Create proposal.md, design.md, tasks.md

     [Auto-chains to apply subagent]
     apply: Implement each task, auto-verify when done.

     Full verify?

User: yes

AI:  [Delegates to verify subagent]
     verify: Check implementation vs spec, report issues.

     Archive change?

User: yes

AI:  [Delegates to archive subagent]`

const planningRows: TableRow[] = [
  { col1: { en: '`/osf feat`', vi: '`/osf feat`' }, col2: { en: 'Add a new feature', vi: 'Thêm tính năng mới' } },
  { col1: { en: '`/osf fix`', vi: '`/osf fix`' }, col2: { en: 'Investigate and fix a bug', vi: 'Điều tra và sửa bug' } },
  { col1: { en: '`/osf chore`', vi: '`/osf chore`' }, col2: { en: 'Maintenance, config, dependencies', vi: 'Maintenance, config, dependencies' } },
  { col1: { en: '`/osf refactor`', vi: '`/osf refactor`' }, col2: { en: 'Restructure code without behavior change', vi: 'Tái cấu trúc code, không đổi behavior' } },
  { col1: { en: '`/osf perf`', vi: '`/osf perf`' }, col2: { en: 'Performance optimization', vi: 'Tối ưu hiệu năng' } },
  { col1: { en: '`/osf docs`', vi: '`/osf docs`' }, col2: { en: 'Write or update documentation', vi: 'Viết hoặc cập nhật tài liệu' } },
  { col1: { en: '`/osf test`', vi: '`/osf test`' }, col2: { en: 'Add or update tests', vi: 'Thêm hoặc sửa tests' } },
  { col1: { en: '`/osf ci`', vi: '`/osf ci`' }, col2: { en: 'CI/CD pipeline, build scripts', vi: 'CI/CD pipeline, build scripts' } },
  { col1: { en: '`/osf docker`', vi: '`/osf docker`' }, col2: { en: 'Dockerfile, docker-compose, container config', vi: 'Dockerfile, docker-compose, container config' } },
]

const utilityRows: TableRow[] = [
  { col1: { en: '`/osf setup`', vi: '`/osf setup`' }, col2: { en: 'Bootstrap from boilerplate, docs, or stack — researches latest docs before scaffolding', vi: 'Setup project từ boilerplate, docs, hoặc tech stack — tự research docs mới nhất trước khi scaffold' } },
  { col1: { en: '`/osf explain`', vi: '`/osf explain`' }, col2: { en: 'Understand how a feature works (Feynman Technique)', vi: 'Hiểu cách một tính năng hoạt động (Feynman Technique)' } },
  { col1: { en: '`/osf analyze`', vi: '`/osf analyze`' }, col2: { en: 'Codebase analysis via GitNexus — impact, dependencies, blast radius (delegates to osf-analyze)', vi: 'Phân tích codebase bằng GitNexus — impact, dependencies, blast radius (delegates to osf-analyze subagent)' } },
  { col1: { en: '`/osf review`', vi: '`/osf review`' }, col2: { en: 'Code quality review — impacts, hardcoded values, rules, security. Defaults to uncommitted changes', vi: 'Review code quality — missed impacts, hardcoded values, project rules, security. Defaults to uncommitted changes' } },
  { col1: { en: '`/osf autopilot`', vi: '`/osf autopilot`' }, col2: { en: 'Full auto pipeline: explore → spec → apply → verify → archive', vi: 'Chạy toàn bộ pipeline tự động: explore → spec → apply → verify → archive' } },
  { col1: { en: '`/osf git`', vi: '`/osf git`' }, col2: { en: 'Git operations (commit, branch, PR, merge)', vi: 'Git operations (commit, branch, PR, merge)' } },
  { col1: { en: '`/osf browser`', vi: '`/osf browser`' }, col2: { en: 'Browser tasks (scrape, screenshot, UI testing)', vi: 'Tác vụ cần browser (scrape, screenshot, test UI)' } },
]

export function kitTx(lang: Lang, v: Localized): string {
  return v[lang]
}

export function getKitSections(lang: Lang): KitSection[] {
  const l = lang
  return [
    {
      type: 'p',
      html: {
        en: 'An <a href="https://openspec.dev" target="_blank" rel="noopener noreferrer">OpenSpec</a>-based kit that is more minimal — fewer commands to memorize, more automation. Built from real daily workflows.',
        vi: 'Kit dựa trên <a href="https://openspec.dev" target="_blank" rel="noopener noreferrer">OpenSpec</a> nhưng tối giản hơn — ít lệnh cần nhớ, nhiều tự động hóa hơn. Được xây dựng từ các tác vụ thực tế hàng ngày.',
      },
    },
    {
      type: 'callout',
      html: {
        en: '100% compatible with OpenSpec — you can use both side by side.',
        vi: 'Tương thích 100% với OpenSpec, có thể dùng cả hai cùng lúc.',
      },
    },
    { type: 'h2', text: { en: 'How is it different from vanilla OpenSpec?', vi: 'Khác gì vanilla OpenSpec?' } },
    {
      type: 'ul',
      items: [
        { en: 'Fewer confirmation steps — the agent decides unimportant details', vi: 'Ít bước xác nhận hơn — Agent tự quyết định những thứ không quan trọng' },
        { en: 'Auto-verify after apply for high-risk work', vi: 'Auto-verify sau apply cho công việc rủi ro cao' },
        { en: 'Stress-test protocol: AI answers its own questions first, only asks you when truly necessary', vi: 'Stress-test protocol: AI tự trả lời câu hỏi trước, chỉ hỏi user khi thực sự cần' },
        { en: 'Auto-chain: after proposal completes, apply runs immediately', vi: 'Auto-chain: sau khi proposal xong, apply chạy ngay' },
        { en: 'Delegation: orchestrator only plans — never implements directly, always delegates to subagents', vi: 'Delegation: orchestrator chỉ lên kế hoạch, không tự implement — luôn delegate cho subagent' },
        { en: 'Autopilot: `/osf autopilot [request]` runs the full pipeline — spec → implement → verify — without stopping midway', vi: 'Autopilot: `/osf autopilot [request]` chạy toàn bộ pipeline tự động — spec → implement → verify, không dừng giữa chừng' },
      ],
    },
    { type: 'h2', text: { en: 'Setup', vi: 'Setup' } },
    {
      type: 'copy',
      label: { en: 'Install OpenSpec CLI', vi: 'Cài OpenSpec CLI' },
      hint: { en: 'Required. Initialize your repo with `openspec init --tools none`.', vi: 'Bắt buộc. Khởi tạo repo bằng `openspec init --tools none`.' },
      command: OPENSPEC_CLI_CMD,
    },
    {
      type: 'copy',
      label: { en: 'Install the kit', vi: 'Cài bộ kit' },
      hint: { en: 'Run in your project directory.', vi: 'Chạy trong thư mục dự án.' },
      command: KIT_INSTALL_CMD,
    },
    { type: 'h2', text: { en: 'Workflow', vi: 'Workflow' } },
    {
      type: 'p',
      html: {
        en: 'Every planning command follows the same fluid flow:',
        vi: 'Mọi planning command đều theo cùng một flow fluid:',
      },
    },
    { type: 'pre', code: { en: workflowMainEn, vi: workflowMainVi } },
    {
      type: 'p',
      html: {
        en: 'Or use `/osf autopilot [request]` to run everything from scratch — the AI explores, decides, and runs the pipeline:',
        vi: 'Hoặc dùng `/osf autopilot [request]` để chạy toàn bộ từ đầu — AI tự explore, tự quyết định, tự chạy pipeline:',
      },
    },
    { type: 'pre', code: { en: workflowAutopilotEn, vi: workflowAutopilotVi } },
    {
      type: 'p',
      html: {
        en: '<strong>Fluid</strong> — not locked into a linear path. You can go back to plan anytime, switch paths (apply directly ↔ create spec), or pause and resume later.',
        vi: '<strong>Fluid</strong> — không bị lock-in theo tuyến tính. User có thể quay lại plan bất cứ lúc nào, đổi path (từ "apply luôn" sang "tạo spec" hoặc ngược lại), pause giữa chừng, tiếp tục sau.',
      },
    },
    { type: 'h2', text: { en: 'Commands', vi: 'Commands' } },
    { type: 'h3', text: { en: 'Planning Commands (9)', vi: 'Planning Commands (9)' } },
    {
      type: 'p',
      html: {
        en: 'Each command follows the workflow above. Command name = git commit type.',
        vi: 'Mỗi command đều follow workflow trên. Tên command = git commit type.',
      },
    },
    {
      type: 'table',
      cols: { en: ['Command', 'When to use'], vi: ['Command', 'Dùng khi nào'] },
      rows: planningRows,
    },
    { type: 'h3', text: { en: 'Utility Commands (7)', vi: 'Utility Commands (7)' } },
    {
      type: 'p',
      html: {
        en: 'Not part of the planning workflow — run the task directly.',
        vi: 'Không theo planning workflow — chạy thẳng tác vụ.',
      },
    },
    {
      type: 'table',
      cols: { en: ['Command', 'When to use'], vi: ['Command', 'Dùng khi nào'] },
      rows: utilityRows,
    },
    {
      type: 'callout',
      html: {
        en: '<strong>GitNexus language policy:</strong> Structural analysis uses GitNexus for TypeScript, JavaScript, Python, Java, Kotlin, C#, Go, Rust, PHP, Ruby, Swift, C, C++, and Dart. Other languages fall back to codebase-retrieval + Grep/Read manual tracing.',
        vi: '<strong>GitNexus language policy:</strong> Structural analysis uses GitNexus for TypeScript, JavaScript, Python, Java, Kotlin, C#, Go, Rust, PHP, Ruby, Swift, C, C++, and Dart. Other languages fall back to codebase-retrieval + Grep/Read manual tracing.',
      },
    },
    {
      type: 'h2',
      text: { en: 'Skills vs Subagents', vi: 'Skills vs Subagents' },
    },
    {
      type: 'p',
      html: {
        en: 'Two layers work together: <strong>skills</strong> are slash commands and orchestrator playbooks you invoke (<code>/osf feat</code>, <code>/osf apply</code>, …). <strong>Subagents</strong> are isolated workers in <code>~/.claude/agents/</code> — the orchestrator delegates heavy work to them via the Agent tool and never implements directly.',
        vi: 'Hai lớp phối hợp: <strong>skills</strong> là slash command và playbook orchestrator bạn gọi (<code>/osf feat</code>, <code>/osf apply</code>, …). <strong>Subagents</strong> là worker cô lập trong <code>~/.claude/agents/</code> — orchestrator delegate việc nặng qua Agent tool, không tự implement.',
      },
    },
    {
      type: 'callout',
      html: {
        en: 'You talk to skills. Skills talk to subagents. Example: <code>/osf feat</code> loads the feat + explore skills, then delegates implementation to <code>osf-apply</code> and verification to <code>osf-verify</code>.',
        vi: 'Bạn nói chuyện với skills. Skills gọi subagents. Ví dụ: <code>/osf feat</code> load feat + explore skills, rồi delegate implement cho <code>osf-apply</code> và verify cho <code>osf-verify</code>.',
      },
    },
    { type: 'h3', text: { en: 'Skills (commands)', vi: 'Skills (commands)' } },
    {
      type: 'p',
      html: {
        en: 'Installed under <code>~/.claude/skills/</code>. Dispatch via <code>/osf &lt;skill&gt;</code>.',
        vi: 'Cài trong <code>~/.claude/skills/</code>. Gọi qua <code>/osf &lt;skill&gt;</code>.',
      },
    },
    { type: 'skills-grid' },
    { type: 'h3', text: { en: 'Subagents (workers)', vi: 'Subagents (workers)' } },
    {
      type: 'p',
      html: {
        en: 'Defined in <code>~/.claude/agents/osf-*.md</code> with name, description, model, and color. The orchestrator picks the right worker — you do not call them as slash commands.',
        vi: 'Định nghĩa trong <code>~/.claude/agents/osf-*.md</code> với name, description, model, color. Orchestrator chọn worker phù hợp — bạn không gọi chúng như slash command.',
      },
    },
    { type: 'subagents-grid' },
    { type: 'h2', text: { en: 'Examples', vi: 'Ví dụ thực tế' } },
    { type: 'h3', text: { en: 'Autopilot — full pipeline', vi: 'Autopilot — toàn bộ pipeline tự động' } },
    { type: 'pre', code: { en: exampleAutopilotEn, vi: exampleAutopilotVi } },
    { type: 'h3', text: { en: 'Autopilot after brainstorm', vi: 'Autopilot từ brainstorm có sẵn' } },
    { type: 'pre', code: { en: exampleBrainstormEn, vi: exampleBrainstormVi } },
    { type: 'h3', text: { en: 'Small task — apply directly', vi: 'Small task — apply luôn, không cần spec' } },
    { type: 'pre', code: { en: exampleSmallEn, vi: exampleSmallVi } },
    { type: 'h3', text: { en: 'Large task — spec first', vi: 'Large task — tạo spec trước' } },
    { type: 'pre', code: { en: exampleLargeEn, vi: exampleLargeVi } },
    { type: 'h2', text: { en: 'Tips', vi: 'Tips' } },
    {
      type: 'ul',
      items: [
        { en: 'Start with `/osf feat`, `/osf fix`, etc. — the AI asks only what it needs', vi: 'Dùng `/osf feat`, `/osf fix`, v.v. để bắt đầu — AI sẽ hỏi những gì cần thiết' },
        { en: 'Use `/osf autopilot [request]` to run everything automatically from scratch', vi: 'Dùng `/osf autopilot [request]` khi muốn chạy toàn bộ tự động từ đầu' },
        { en: 'Use `/osf autopilot` mid-session after brainstorm to switch to auto mode', vi: 'Dùng `/osf autopilot` giữa chừng sau brainstorm để chuyển sang chế độ tự động' },
        { en: 'No need to memorize subagents — the orchestrator knows when to delegate', vi: 'Không cần nhớ subagent nào làm gì — orchestrator tự biết delegate' },
        { en: 'Want more control? Use vanilla OpenSpec alongside this kit', vi: 'Nếu muốn kiểm soát nhiều hơn, dùng vanilla OpenSpec song song' },
        { en: '`researcher` and `uiux-designer` can be invoked anytime during plan phase', vi: '`researcher` và `uiux-designer` có thể gọi bất cứ lúc nào trong plan phase' },
        { en: '`analyze` is used automatically in plan phase when structural insight is needed', vi: '`analyze` được tự động dùng trong plan phase khi cần structural insight (blast radius, dependency chains)' },
      ],
    },
  ]
}
