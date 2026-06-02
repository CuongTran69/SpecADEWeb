# 10. Cài đặt & Phím tắt

Settings là nơi bạn cá nhân hoá toàn bộ trải nghiệm Spec ADE — theme, font, AI provider, phím tắt, security, …

## Mở Settings

- Click tab **"Settings"** trong sidebar trên cùng.
- Hoặc dùng phím tắt mở Settings (Ctrl/⌘+,).

Cửa sổ Settings chia 2 cột: sidebar trái liệt kê các nhóm cài đặt, khu phải hiển thị nội dung nhóm đang chọn.

## Các nhóm Cài đặt

| Nhóm | Nội dung |
|------|---------|
| **Appearance** | Theme tối/sáng, accent color |
| **Editor** | Font, kích thước, line numbers, autocomplete… |
| **Terminal** | Font terminal, line height, font weight |
| **Shell** | Shell mặc định, cấu hình shell theo OS |
| **Agents** | Đăng ký AI agent (Auggie, Claude, ACP custom) |
| **Goal Agent** | Cấu hình Send-with-Goal |
| **Enhance Prompt** | Cấu hình AI viết lại prompt |
| **Git** | AI commit message, prompt template |
| **Notifications** | Bật/tắt thông báo, âm thanh |
| **SSH Tunnel** | Cấu hình tunnel cho database |
| **Port Forwarding** | Forward cổng |
| **Security** | License, mã hoá backup |
| **License** | Quản lý license, kích hoạt máy |
| **Advanced** | Cài đặt nâng cao, debug |

## Appearance

### Theme tối / sáng

- **Dark** — chế độ tối (mặc định).
- **Light** — chế độ sáng.
- **Auto** — theo hệ điều hành.

Đổi theme tức thì, không cần khởi động lại.

### Accent Color

Màu nhấn dùng cho nút Submit, link, viền đang focus. Chọn từ palette hoặc nhập mã hex.

## Editor

### Font

- **Font Family** — font cho editor (mặc định: Lilex). Bật "Use Custom Font" để chọn font khác từ hệ thống.
- **Font Size** — kích thước chữ trong editor.
- **Preview Font Size** — kích thước cho chế độ xem (Markdown render, etc.).
- **Code Font Size** — kích thước cho block code trong markdown.

Có **Font Preview** ngay bên cạnh để bạn thấy font hiệu chỉnh trông thế nào trước khi áp.

### Hiển thị

- **Line Numbers** — đánh số dòng.
- **Line Wrapping** — tự xuống dòng cho dòng dài.
- **Bracket Matching** — tô sáng dấu ngoặc khớp.
- **Indent Guides** — đường thụt lề.
- **Highlight Active Line** — tô sáng dòng đang gõ.
- **Rainbow Brackets** — màu khác nhau cho cấp ngoặc.
- **Lint Gutter** — chỉ báo lỗi/cảnh báo ở viền trái.

### Autocomplete

- **Autocomplete** — bật gợi ý tự động.
- **Activate on Typing** — tự gọi gợi ý khi gõ (vs chỉ khi nhấn phím gọi).
- **Close Brackets** — tự đóng ngoặc/quote khi gõ ngoặc mở.

## Terminal

- **Font Family** — font terminal.
- **Use Custom Font** — chọn font khác.
- **Custom Font Family** — nếu bật, gõ tên font.
- **Font Size** — cỡ chữ.
- **Font Weight** — đậm hay thường.
- **Line Height** — giãn dòng.

## Shell

Chọn shell mặc định cho terminal mới:

- **Windows** — `pwsh`, `powershell`, `cmd`, hoặc custom path.
- **Unix** — bash, zsh, fish, hoặc custom.

Có ô "Custom Args" để thêm tham số khởi động shell.

## Agents

Tab Agents quản lý các AI agent có thể dùng cho session:

### Builtin Agents

- **Auggie** — chạy ở chế độ PTY.
- **Claude** — chạy ở chế độ PTY.

Bạn không xoá được builtin nhưng có thể chỉnh **command** (ví dụ `auggie` → `/usr/local/bin/auggie`) và **timing** (slash delay, tab delay, enter delay).

### Custom ACP Agent

Nhấn "Add Agent" để đăng ký agent ACP mới:

- **Name** — tên hiển thị.
- **Mode** — `acp`.
- **Command** — đường dẫn binary chạy agent.
- **Args** — tham số dòng lệnh.
- **Env** — biến môi trường.

Agent xuất hiện trong dropdown khi tạo session mới.

## Goal Agent

Cấu hình tính năng **Send-with-Goal** (xem chương 11):

- **Goal Agent** — agent dùng để giám sát.
- **Default Max Iterations** — số lần lặp tối đa mặc định.
- **Prompt Template** — mẫu prompt gửi cho goal agent. Có placeholder `{{goal}}`, `{{conversation}}`, `{{iteration}}`, `{{maxIterations}}`.

## Enhance Prompt

Cấu hình tính năng "Enhance Prompt" trong chat:

- **Provider** — OpenAI-compatible / Anthropic / Ollama.
- **URL** — endpoint provider.
- **Model** — tên model.
- **API Key** — lưu trong keychain hệ điều hành.
- **Prompt Template** — mẫu nâng cấp prompt.

## Git → AI Commit Messages

- **Provider, URL, Model, API Key** — như Enhance Prompt.
- **Prompt Template** — chứa `{{rules}}`, `{{subject_hint}}`, `{{diff}}`.
- **Diff Byte Budget** — số byte tối đa gửi cho AI (mặc định 20,000).

Nút **"Save API Key"** lưu key qua endpoint riêng vào keychain. Nút **"Delete API Key"** xoá key.

## Notifications

- **Bật/tắt** thông báo desktop.
- **Âm thanh** khi AI trả lời xong, build done, …
- **Quiet Hours** — không quấy lúc rảnh.

## SSH Tunnel

Cấu hình tunnel mặc định cho database:

- **Host, Port, User, Auth** — auth bằng password hoặc private key file.
- **Identity File** — đường dẫn key (chỉ Spec ADE biết, không lưu nội dung key).

## Security

- **Backup Encryption Default** — mặc định bật mã hoá backup database.
- **Vault Lock** — đặt mật khẩu vault thay cho keychain hệ điều hành (cho headless Linux).

## License

- **Activate License** — nhập key.
- **Machine Fingerprint** — mã định danh máy này.
- **Deactivate** — gỡ kích hoạt khỏi máy này (giải phóng slot license).

## Advanced

- Reset cài đặt về mặc định.
- Xuất / nhập file cài đặt (settings.json).
- Bật chế độ debug log.

## Phím tắt (Keyboard Shortcuts)

Spec ADE có hệ phím tắt theo phong cách JetBrains, có nhận biết macOS / Windows / Linux.

### Chỉnh phím tắt

Vào Settings → tìm mục "Shortcuts" (hoặc keybindings). Mỗi action có:

- **Tên action**.
- **Phím tắt hiện tại**.
- **Default**.
- **Khi nào hoạt động** (context — ví dụ "git commit input focused").

Click vào ô phím để gán phím mới — gõ tổ hợp muốn dùng. Nhấn "Reset" để về default.

### Một số phím tắt chính

| Action | Mặc định |
|--------|----------|
| Save File | Ctrl/⌘+S |
| Toggle View/Edit | Ctrl/⌘+K |
| Split Right | Ctrl/⌘+\\ |
| Split Down | Ctrl/⌘+Shift+\\ |
| Find in File | Ctrl/⌘+F |
| Find in Files (toàn dự án) | Ctrl/⌘+Shift+F |
| Command Palette | Ctrl/⌘+Shift+P |
| AI Commit Message | Ctrl/⌘+Alt+G (khi focus ô commit) |
| Open Settings | Ctrl/⌘+, |

Phím tắt cụ thể có thể khác giữa các phiên bản — luôn xem Settings để biết bản hiện tại.

### Command Palette

Mở Command Palette để gõ tên action thay vì nhớ phím tắt:

- Phím tắt: Ctrl/⌘+Shift+P.
- Gõ tên action — fuzzy match.
- Enter để chạy.

Hữu ích khi bạn quên phím tắt hoặc muốn tìm action mới.

## Đồng bộ Cài đặt

Hầu hết cài đặt được lưu ở phía server (file cấu hình của Spec ADE), nên:

- Mở app trên trình duyệt khác → vẫn cùng cài đặt.
- Mở app trên máy khác kết nối cùng server → vẫn cùng cài đặt.

Riêng một số cài đặt mang tính thiết bị (kích thước cửa sổ, scroll position, …) lưu local trên trình duyệt/desktop.

## Migration từ phiên bản cũ

Nếu bạn nâng cấp từ phiên bản cũ dùng SQLite, lần đầu chạy bản mới Spec ADE tự động chuyển dữ liệu sang định dạng mới — bạn không cần làm gì. Cũng có migration một lần từ localStorage cho cài đặt editor/terminal.

## Bước tiếp theo

- [Bắt đầu nhanh](01-getting-started.md) — quay lại tổng quan nếu lần đầu dùng.
- [Chat với AI Agent](03-ai-chat.md) — áp dụng Enhance Prompt và Agent settings.
