# Spec ADE — Hướng dẫn sử dụng

Spec ADE là môi trường làm việc tích hợp cho lập trình viên dùng AI. Trong một cửa sổ duy nhất, bạn có thể chat với trợ lý AI, mở file, chạy lệnh terminal, quản lý git, làm việc với database, và theo dõi tài nguyên hệ thống — tất cả gọn trong cùng một không gian dự án.

Bộ tài liệu này hướng dẫn bạn cách sử dụng từng tính năng. Mỗi chương đứng độc lập, đọc theo thứ tự hay tra cứu nhanh đều được.

## Mục lục

1. [Bắt đầu nhanh](01-getting-started.md) — Cài đặt, mở app, cấu hình lần đầu
2. [Quản lý Project & Session](02-projects-sessions.md) — Tạo project, mở session, chuyển giữa các phiên làm việc
3. [Chat với AI Agent](03-ai-chat.md) — Trò chuyện với Auggie, Claude, các agent ACP, slash command, đính kèm hình ảnh
4. [Terminal tích hợp](04-terminal.md) — Mở terminal, chạy lệnh, chia nhiều terminal song song
5. [Soạn thảo File](05-file-editor.md) — Mở file, sửa, lưu, xem media, duyệt cây thư mục
6. [Quy trình Git](06-git.md) — Stage, commit, push/pull, xem diff, giải quyết conflict, AI viết commit message
7. [Database Workspace](07-database.md) — Kết nối Postgres/MySQL/SQLite/MongoDB/Redis, query, sửa dữ liệu, backup/restore
8. [Layout & Tab](08-pane-tabs.md) — Chia ô, kéo-thả tab, lưu layout
9. [Process Monitor](09-monitor.md) — Theo dõi CPU/RAM/GPU, kết thúc tiến trình
10. [Cài đặt & Phím tắt](10-settings.md) — Cấu hình toàn cục, theme, font, shortcuts
11. [Send-with-Goal](11-send-with-goal.md) — Giao mục tiêu cho AI tự lặp đến khi hoàn thành
12. [Spec Workspace](12-spec.md) — Soạn proposal, design, tasks và lưu trữ thay đổi

## Quy ước trong tài liệu

- **Phím tắt** ghi theo dạng `Ctrl+S` (Windows/Linux) hoặc `⌘S` (macOS).
- **Đường dẫn menu** ghi theo dạng `Settings → Editor → Theme`.
- **Nút bấm** đặt trong dấu nháy: nhấn "Commit" hoặc "Save".

## Nền tảng được hỗ trợ

Spec ADE chạy trên Windows, macOS, và Linux. Có thể dùng dưới dạng:

- **App desktop** — chạy như một ứng dụng độc lập trên hệ điều hành của bạn.
- **Trình duyệt** — mở qua trình duyệt web nếu bạn chạy chế độ server.
- **Service nền** — cài đặt làm service tự khởi động cùng máy, không cần mở terminal.

Ở mọi nền tảng, giao diện và thao tác đều giống nhau.
