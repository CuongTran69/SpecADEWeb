# 12. Spec Workspace

Spec Workspace giúp bạn tổ chức **những thay đổi lớn** trong dự án theo quy trình rõ ràng — viết proposal, thiết kế, danh sách task, triển khai, rồi lưu trữ — trước khi gộp vào codebase. Phù hợp khi nhiều người cùng làm hoặc khi thay đổi ảnh hưởng nhiều phần.

Spec ADE dùng cấu trúc **OpenSpec** quen thuộc (`openspec/changes/<tên-change>/`) để lưu trữ các thay đổi.

## Mở Spec Workspace

- Mở tab loại **"Spec"** từ pane "+" → chọn change muốn xem.
- Hoặc click một spec từ Spec Panel trong sidebar.

## Cấu trúc một Change

Mỗi change là một thư mục có:

| File | Vai trò |
|------|---------|
| **proposal.md** | Đề xuất: vấn đề, giải pháp, lý do |
| **design.md** | Thiết kế chi tiết: kiến trúc, API, edge case |
| **tasks.md** | Danh sách task có thể tick được |
| **specs/** | (Tuỳ chọn) Spec mới hoặc cập nhật cho từng module |

## Spec Panel

Spec Panel trong sidebar hiển thị:

- **Active Changes** — các change đang triển khai.
- **Archive** — các change đã hoàn thành (lưu dưới dạng `YYYY-MM-DD-<name>`).

## Spec Viewer

Click vào một change → mở Spec Viewer. Viewer chia tab nhỏ:

- **Proposal** — render `proposal.md` thành nội dung dễ đọc.
- **Design** — render `design.md`.
- **Tasks** — danh sách task có checkbox, tick / untick trực tiếp.
- **Specs** — duyệt các file spec liên quan.

Mọi thay đổi (tick task, sửa nội dung) lưu xuống file ngay.

## Tasks — Tick để hoàn thành

Tab Tasks là nơi bạn theo dõi tiến độ:

- Mỗi task là một checkbox `[ ]` hoặc `[x]`.
- Click vào checkbox để tick / untick — file được cập nhật.
- Có thể chú thích phụ dưới mỗi task.

Trạng thái progress hiển thị trên đầu (vd "5/12 task hoàn thành").

## Tạo Change mới

Có hai cách tạo:

### Cách 1 — Qua AI

Trong khu chat, dùng slash command để khởi tạo (`/feat`, `/fix`, `/proposal` …). AI sẽ:

1. Hỏi bạn về vấn đề và giải pháp.
2. Sinh ra proposal, design, tasks dưới dạng draft.
3. Lưu vào `openspec/changes/<tên>/`.

Sau đó bạn dùng Spec Workspace để xem/sửa.

### Cách 2 — Tạo thủ công

Tạo thư mục `openspec/changes/<tên-change>/` và các file `proposal.md`, `design.md`, `tasks.md`. Spec ADE tự nhận và liệt kê.

## Apply (Triển khai)

Khi sẵn sàng làm:

- Trong chat, dùng slash command apply (`/apply <tên-change>` hoặc tương tự).
- AI đọc tasks.md, làm từng task, tick xong từng cái.
- Bạn theo dõi tiến độ trên Spec Viewer.

## Verify

Sau khi apply, dùng `/verify` để có một AI khác (independent) review xem implementation có khớp với spec không. Verify sinh report — báo cáo:

- ✅ Khớp đầy đủ.
- ⚠ Chưa rõ ràng / không xác minh được.
- ❌ CRITICAL — sai khác lớn cần sửa.

## Archive (Lưu trữ)

Khi change đã hoàn thành và verify pass:

- Dùng `/archive <tên-change>` (qua AI).
- Spec ADE đổi tên thư mục thành `archive/<YYYY-MM-DD>-<tên>/`.
- Change rời khỏi Active Changes, vào Archive.

Archive là nguồn tham khảo lịch sử — sau này muốn xem "thay đổi này được làm thế nào, tại sao" thì đọc lại.

## Spec Context Menu

Click chuột phải vào một change trong Spec Panel:

- **Open** — mở viewer.
- **Open Folder** — mở thư mục change trong file tree.
- **Rename Change**.
- **Archive** — đẩy vào archive.
- **Delete** — xoá hẳn (xác nhận trước).

## Liên kết với Git

Spec Workspace **không** tự commit. Bạn dùng Git Panel (chương 6) để commit các thay đổi spec + code cùng nhau. Thường flow là:

1. Tạo branch mới cho change.
2. Apply → AI sửa code và tick tasks.
3. Commit định kỳ trên Git Panel.
4. Verify → fix critical → commit fix.
5. Archive → commit archive.
6. Push, mở PR.

## Bước tiếp theo

- [Quy trình Git](06-git.md) — commit và quản lý branch cho change.
- [Send-with-Goal](11-send-with-goal.md) — set goal "Tasks tick hết và verify pass" để AI chạy autonomous.
- [Chat với AI Agent](03-ai-chat.md) — slash command tạo proposal, apply, verify.
