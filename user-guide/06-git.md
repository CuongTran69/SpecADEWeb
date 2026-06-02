# 6. Quy trình Git

Spec ADE có panel Git tích hợp giúp bạn làm trọn vẹn vòng đời commit — xem thay đổi, stage, viết commit message (có hỗ trợ AI), push/pull, đổi nhánh, merge, giải quyết conflict — không cần rời khỏi app.

## Mở Git Panel

- Nhấn icon Git trên sidebar bên trái khu vực Chat.
- Hoặc dùng tab Git trong workspace.

Panel mở ra hiện trạng thái repo của project hiện tại.

## Phần "Repo" — Trạng thái File

Phần đầu Git panel hiện danh sách file thay đổi, chia làm:

- **Staged Changes** — những thay đổi sẽ vào commit kế.
- **Changes** — file đã sửa nhưng chưa stage.
- **Untracked** — file mới Git chưa biết.
- **Conflicts** — file đang có xung đột (nếu có).

Mỗi file có nhãn ngắn:

- **M** — Modified (sửa).
- **A** — Added (mới thêm vào index).
- **D** — Deleted (xoá).
- **R** — Renamed (đổi tên).
- **U** — Unmerged (xung đột).
- **?** — Untracked.

Màu sắc tương ứng giúp nhìn nhanh.

### Stage / Unstage

- Nhấn **+** cạnh file để stage.
- Nhấn **−** cạnh file đã stage để unstage.
- Click nút "Stage All" hoặc "Unstage All" để xử lý hàng loạt.
- Click **chuột phải** → menu thao tác đầy đủ (stage, unstage, discard, view diff, open file…).

### Discard Changes

Click chuột phải → "Discard Changes" để bỏ thay đổi (Git checkout file). Có xác nhận trước khi xoá.

### Xem Diff

Click vào tên file để mở **Diff Viewer** trong khu trung tâm:

- So sánh nội dung cũ và mới cạnh nhau (side-by-side) hoặc xen kẽ (inline).
- Cuộn đồng bộ giữa hai bên.
- Stage / unstage **từng đoạn (hunk)** hoặc **từng dòng** trực tiếp trong viewer.

## Commit

Khu nhập commit message nằm phía dưới danh sách file:

- Gõ commit message.
- Nhấn nút **"Commit"** để commit các file đã stage.

### AI Commit Message

Cạnh ô nhập có nút hình tia sáng (Sparkles). Nhấn nút này, AI đọc diff hiện tại và sinh ra commit message mẫu, stream từng chữ vào ô. Bạn có thể:

- Đợi hoàn tất, chỉnh sửa theo ý.
- Nhấn lại nút (đã đổi thành biểu tượng vuông) để **huỷ** giữa chừng.
- Phím tắt **Ctrl/⌘+Alt+G** khi con trỏ nằm trong ô commit để gọi nhanh.

Để dùng AI Commit, bạn cần cấu hình provider AI trong **Settings → Git → AI Commit Messages**. Hỗ trợ:

- OpenAI-compatible (OpenAI, các API tương thích).
- Anthropic.
- Ollama (local).

Bạn nhập URL provider, model, và API key. API key được lưu an toàn trong keychain hệ điều hành (không lưu plain text).

Nếu chưa cấu hình hoặc repo không có thay đổi nào, nút Sparkles hiện tooltip giải thích lý do bị tắt.

## Branch (Nhánh)

### Hiển thị Branch hiện tại

Nhánh hiện tại hiện ở **Status Bar** dưới cùng và trong dropdown branch của Git panel.

### Đổi Branch (Checkout)

- Click dropdown branch → chọn nhánh muốn checkout.
- Hoặc click chuột phải vào nhánh → "Checkout".

Nếu working tree có thay đổi chưa commit, Spec ADE cảnh báo và đề xuất stash trước khi checkout (Smart Checkout).

### Tạo Branch mới

- Dropdown branch → "New Branch".
- Đặt tên, chọn nhánh nguồn (mặc định là HEAD hiện tại).
- Tuỳ chọn checkout luôn sang nhánh mới.

### Đổi tên / Xoá Branch

Click chuột phải vào tên nhánh:

- **Rename** — đổi tên (cả local, hoặc kèm rename remote).
- **Delete** — xoá local. Nếu chưa merge sẽ có cảnh báo.

### Branch Submenu

Mỗi nhánh có submenu nhanh: checkout, compare with current, merge into current, rebase onto, cherry-pick, copy name, view log.

## Remote

### Quản lý Remote

Nhấn nút "Manage Remotes" để mở danh sách remote (origin, upstream, …):

- Thêm remote mới (URL fetch + push).
- Sửa URL.
- Xoá remote.

### Fetch / Pull / Push

- **Fetch** — tải cập nhật từ remote, không gộp.
- **Pull** — fetch + merge/rebase nhánh hiện tại.
- **Push** — đẩy commit lên remote. Có cờ `--force-with-lease` an toàn nếu cần force push.

Có chỉ báo "ahead/behind" cho biết bạn đi trước/sau remote bao nhiêu commit.

## Stash

Stash giúp tạm cất thay đổi để chuyển nhánh nhanh:

- Nhấn "Stash Changes" — đặt tên stash (tuỳ chọn).
- Vào danh sách stash để **Apply** (giữ stash) hoặc **Pop** (apply rồi xoá).
- Có thể xoá stash riêng lẻ.

## So sánh Branch (Compare)

Mở **GitCompareTab**:

1. Chọn 2 branch (hoặc 1 branch và HEAD).
2. Spec ADE liệt kê danh sách commit khác biệt.
3. Click vào commit để xem diff chi tiết.
4. Click vào file để mở diff viewer cho file đó.

Hữu ích khi review nhánh feature trước khi merge.

## Git Log

Mở **Git Log Tab** để xem lịch sử commit theo timeline:

- Đồ thị nhánh (branch graph).
- Chi tiết commit: tác giả, thời gian, thông điệp, file thay đổi.
- Click vào commit để xem diff so với commit trước.
- Filter theo tác giả, từ khoá message, file.

## Merge & Conflict

### Merge Branch

Click chuột phải vào nhánh khác → "Merge into current". Spec ADE chạy merge:

- **Thành công** — commit merge tự động.
- **Có conflict** — chuyển sang chế độ giải quyết xung đột.

### Giải quyết Conflict

Khi có conflict, Git panel hiện danh sách "Conflicts". Click vào file conflict để mở **Git Merge Editor**:

- Hiển thị 3 cột: nhánh của bạn — kết quả — nhánh kia.
- Mỗi đoạn xung đột có nút "Accept Yours", "Accept Theirs", "Accept Both".
- Sửa thủ công nếu cần.
- Nhấn "Resolve" khi xong → file rời khỏi danh sách Conflicts.

Sau khi xử lý hết, commit merge từ Git panel như bình thường.

## Rebase

### Rebase đơn giản

Click chuột phải vào nhánh → "Rebase current onto this".

### Interactive Rebase

Hộp thoại "Interactive Rebase" cho phép sắp xếp lại commit:

- **Pick** — giữ nguyên.
- **Reword** — đổi message.
- **Squash** — gộp vào commit phía trên.
- **Drop** — bỏ commit.
- Kéo-thả để đổi thứ tự.

Nhấn "Start" để chạy.

## Worktree

Nếu dự án dùng Git Worktree:

- **Worktree Section** trong Git panel liệt kê các worktree.
- Tạo worktree mới qua hộp thoại "Create Worktree".
- Hộp thoại "Merge Worktree" giúp gộp worktree về nhánh chính.

## Watcher tự động

Git panel tự cập nhật khi:

- Bạn sửa file trong dự án.
- Có thao tác git từ bên ngoài (terminal, IDE khác).

Nếu dự án nằm trên ổ mạng (network drive), watcher chuyển sang chế độ "polling" để vẫn cập nhật được, dù chậm hơn.

## Bước tiếp theo

- [Spec Workspace](12-spec.md) — quản lý thay đổi lớn theo proposal trước khi commit.
- [Cài đặt & Phím tắt](10-settings.md) — bật/tắt AI Commit, đổi prompt template.
