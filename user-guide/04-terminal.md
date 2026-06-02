# 4. Terminal tích hợp

Spec ADE có terminal tích hợp y như terminal hệ thống của bạn — chạy mọi lệnh shell quen thuộc, chỉ khác là nó nằm gọn trong cửa sổ Spec ADE và có thể mở nhiều cái song song.

## Mở Terminal

Có nhiều cách mở terminal mới:

- Nhấn nút "+" trong thanh tab và chọn "Terminal".
- Dùng phím tắt mở terminal (xem chương Phím tắt).
- Click chuột phải vào một thư mục trong cây file và chọn "Open Terminal Here" — terminal mở ngay tại thư mục đó.

Terminal mới xuất hiện như một tab trong pane hiện tại.

## Shell mặc định

Spec ADE tự chọn shell phù hợp với hệ điều hành:

- **Windows** — ưu tiên PowerShell 7 (`pwsh`), không có thì dùng PowerShell mặc định, không có thì dùng `cmd`.
- **macOS / Linux** — dùng shell mặc định của bạn (giá trị `$SHELL`), nếu không có thì dùng `bash`.

Bạn có thể đổi shell trong Settings → Shell.

## Thư mục mở đầu

Terminal mở tại thư mục gốc của project, hoặc tại thư mục bạn đã click chuột phải. Spec ADE theo dõi thư mục hiện tại của bạn (bạn `cd` đi đâu, tab terminal hiển thị đúng thư mục đó).

## Gõ lệnh

Gõ như terminal bình thường. Mọi phím tắt của shell vẫn hoạt động:

- `Ctrl+C` — huỷ lệnh đang chạy.
- `Ctrl+D` — gửi EOF / thoát shell.
- `Ctrl+L` — xoá màn hình.
- Mũi tên lên/xuống — duyệt lịch sử lệnh.
- Tab — auto-complete của shell.

## Copy & Paste

- **Bôi đen** rồi **Ctrl/⌘+C** — copy.
- **Ctrl/⌘+V** — paste.
- Click chuột phải để mở menu Copy/Paste/Select All.

Khi paste nhiều dòng, Spec ADE phát hiện và xử lý đúng (không tự động chạy ngay từng dòng).

## Đính kèm hình ảnh trong Terminal

Nếu bạn dùng một CLI hỗ trợ hình ảnh (như Auggie, Claude Code), bạn có thể paste ảnh trực tiếp vào terminal. Spec ADE chuyển ảnh cho CLI an toàn qua một giao thức riêng — CLI nhận đúng nội dung ảnh và xử lý theo khả năng của nó.

## Đa Terminal

Mở nhiều terminal cùng lúc bằng cách:

- Tạo thêm tab terminal mới (nút "+").
- Chia pane (split) và mở terminal ở pane mới.

Mỗi terminal độc lập — chạy riêng tiến trình, có thư mục riêng, lịch sử riêng.

## Đổi tên Tab Terminal

Double-click vào tab terminal để đổi tên. Tên này chỉ là nhãn hiển thị, không ảnh hưởng tiến trình bên trong.

## Thanh công cụ Terminal

Thanh công cụ trên đầu terminal có:

- **Copy** — copy nội dung đang chọn.
- **Clear** — xoá nội dung hiển thị (không thoát shell).
- **Restart** — kết thúc shell và mở lại từ đầu.
- **Settings** — vào nhanh phần cấu hình terminal.

## Tự động chỉnh kích thước

Khi bạn thay đổi kích thước cửa sổ Spec ADE hoặc kéo-thả split, terminal tự cập nhật số dòng/cột (resize). Một số ứng dụng full-screen như `htop`, `vim`, `tmux` sẽ vẽ lại đúng theo kích thước mới.

## Phát hiện CLI sẵn sàng

Khi mở terminal cho session AI (Auggie/Claude), Spec ADE chờ CLI khởi động xong rồi mới cho bạn gõ. Bạn thấy thông báo "Connecting…" rồi "Ready" — sau đó mới gõ được. Việc này tránh tin nhắn của bạn bị mất do gõ quá sớm.

## Lệnh `ade` trong Terminal

Spec ADE tự thêm một lệnh tắt tên `ade` vào terminal của bạn để tương tác lại với app từ trong shell. Cách dùng cụ thể tuỳ phiên bản — gõ `ade help` để xem trợ giúp. Tính năng này hỗ trợ bash, zsh, sh, và PowerShell. Shell khác sẽ bỏ qua.

## Khôi phục sau khi đóng

Nếu bạn đóng tab terminal rồi mở lại, terminal mới là terminal sạch — không khôi phục lịch sử của tab cũ. Để giữ phiên làm việc dài, đừng đóng tab.

Khi bạn rời session rồi quay lại, terminal vẫn còn nguyên — nó chỉ ngủ ngầm chứ không bị xoá.

## Bước tiếp theo

- [Cài đặt & Phím tắt](10-settings.md) — đổi font, kích thước chữ, line-height cho terminal.
- [Layout & Tab](08-pane-tabs.md) — chia ô để có terminal song song với editor.
