# 5. Soạn thảo File

Spec ADE có editor mã nguồn tích hợp với cây file (file tree) bên trái. Bạn có thể duyệt thư mục, mở file, sửa, lưu — tương tự một IDE quen thuộc.

## Cây File (File Tree)

Khu file tree nằm ở bên trái khi bạn vào workspace Chat. Cây hiển thị:

- Cấu trúc thư mục dự án theo phân cấp.
- Các file và folder tự lọc theo `.gitignore` của dự án.
- Bỏ qua mặc định: `node_modules`, `.git`, các thư mục cache lớn — để cây gọn nhẹ.

### Mở rộng / Thu gọn

- **Click** vào tên thư mục để mở/đóng.
- **Double-click** thư mục để mở và mở rộng đệ quy con.

### Mở File

- **Click một lần** — mở file ở chế độ xem trước (preview, tab in nghiêng).
- **Double-click** — mở chính thức ở tab giữ lại.
- **Click chuột phải** — menu thao tác (mở, đổi tên, xoá, copy đường dẫn, mở trong terminal…).

### Tìm kiếm trong File Tree

Trên đầu file tree có ô tìm — gõ tên file để lọc. Cây thu gọn lại chỉ còn các nhánh chứa kết quả khớp.

### Tạo File / Folder mới

Click chuột phải vào thư mục → "New File" hoặc "New Folder". Đặt tên rồi nhấn Enter. File mới được tạo trên ổ đĩa và mở luôn trong editor (nếu là file).

### Đổi tên / Xoá

Click chuột phải:

- **Rename** — đổi tên file/folder (đổi cả trên đĩa).
- **Delete** — xoá hẳn (xác nhận trước khi xoá).
- **Move to Trash** — đưa vào thùng rác hệ điều hành thay vì xoá vĩnh viễn.

## File Editor

Khi mở file, editor hiện ra với các tính năng:

### Tô màu cú pháp (Syntax Highlight)

Editor tự nhận định dạng theo phần mở rộng của file (`.ts`, `.py`, `.rs`, `.md`…) và tô màu phù hợp.

### Đánh số dòng

Số dòng hiện ở viền trái. Tắt/bật trong Settings → Editor.

### Wrap dòng

Dòng dài tự xuống dòng theo bề rộng cửa sổ. Tắt/bật trong Settings.

### Bracket Matching

Khi con trỏ đứng cạnh dấu ngoặc, dấu ngoặc khớp được tô sáng.

### Rainbow Brackets

Mỗi cấp độ ngoặc có màu khác nhau giúp đọc code lồng nhau dễ hơn. Tắt/bật trong Settings.

### Autocomplete

Gợi ý từ khoá khi gõ. Bạn có thể chọn "Activate on typing" (tự gợi ý) hoặc "Manual" (chỉ khi nhấn phím gọi gợi ý) trong Settings.

### Indent Guides

Hiển thị các đường dọc mờ chỉ mức thụt lề. Tắt/bật trong Settings.

### Highlight Active Line

Tô sáng dòng đang đặt con trỏ. Tắt/bật trong Settings.

## Lưu File

- **Ctrl+S** (Windows/Linux) hoặc **⌘S** (macOS) — lưu file đang mở.
- Khi bạn rời tab file (chuyển sang tab khác), file tự lưu nếu có thay đổi.
- Tab file có dấu chấm tròn ngay sau tên khi có sửa đổi chưa lưu.

## Chế độ Xem (View) và Sửa (Edit)

Một số file (như Markdown) có cả chế độ xem (đã render) và chế độ sửa (raw text). Chuyển giữa hai chế độ bằng:

- **Ctrl+K** (Windows/Linux) hoặc **⌘K** (macOS).
- Hoặc nút "Toggle View/Edit" trên thanh công cụ editor.

## File Tab

Mỗi file mở chiếm một tab. Thao tác:

- **Kéo-thả** để sắp xếp lại thứ tự.
- **Đóng tab** bằng nút X hoặc phím tắt đóng tab.
- **Chuột giữa** vào tab — đóng nhanh.
- **Click chuột phải** — menu "Close, Close Others, Close All, Close to the Right".

## Tìm trong File hiện tại

Mở thanh tìm trong file (phím tắt tìm tiêu chuẩn). Có:

- **Find** — tìm văn bản.
- **Replace** — thay thế.
- **Match Case / Whole Word / Regex** — các chế độ tìm.

## Tìm trong Toàn dự án

Phím tắt tìm trong file (Find in Files):

- Gõ từ khoá.
- Lọc theo phần mở rộng file.
- Click kết quả để nhảy đến đúng dòng.
- Hỗ trợ tìm bằng `ripgrep` cho hiệu suất cao (tự fall-back sang `grep` nếu không có).

## Preview Media

File ảnh, video, audio, PDF đều có preview tích hợp:

- **Ảnh** (`.png`, `.jpg`, `.svg`, `.gif`, `.webp`, …) — hiển thị trực tiếp.
- **Video** (`.mp4`, `.webm`, …) — phát với điều khiển play/pause/volume.
- **Audio** (`.mp3`, `.wav`, …) — phát với thanh điều khiển.
- **PDF** — xem trong viewer tích hợp.

## Markdown

File Markdown có:

- **Chế độ xem** — render với KaTeX (toán), Mermaid (sơ đồ), highlight code.
- **Chế độ sửa** — chỉnh sửa raw text với syntax highlight.
- **Outline** — popup hiện cấu trúc heading, click để nhảy.
- **Mermaid** — block ` ```mermaid ` được render thành sơ đồ; click để mở dialog xem to.

## Git Blame

Click chuột phải vào dòng code và chọn "Show Git Blame" để xem ai sửa dòng đó lần cuối, vào commit nào. Popover hiện thông tin commit.

## Theme & Font

Editor dùng theme tối (one-dark) hoặc theme sáng (đi cùng theme app). Đổi:

- Font, kích thước, font-family — Settings → Editor.
- Theme tối/sáng — Settings → Appearance.

## Bước tiếp theo

- [Quy trình Git](06-git.md) — xem diff, commit thay đổi.
- [Layout & Tab](08-pane-tabs.md) — mở nhiều file song song, chia editor.
- [Cài đặt & Phím tắt](10-settings.md) — tuỳ biến editor.
