# 2. Quản lý Project & Session

Project là một thư mục code trên máy bạn. Session là một phiên trò chuyện hoặc làm việc bên trong project. Một project có thể chứa nhiều session song song, mỗi session độc lập với nhau.

## Tạo Project

Có ba cách tạo project mới:

### Mở thư mục có sẵn

1. Nhấn nút "Add Project" hoặc dấu "+" trong danh sách project.
2. Chọn "Open existing folder".
3. Trỏ đến thư mục dự án trên máy bạn.

Project được thêm vào danh sách. Lần sau mở Spec ADE, project vẫn còn đó.

### Clone từ Git

1. Nhấn "Add Project" → "Clone from VCS".
2. Dán URL repo Git (HTTPS hoặc SSH).
3. Chọn thư mục đích trên máy.
4. Đặt tên project (mặc định lấy tên repo).

Spec ADE sẽ tự clone và thêm vào danh sách.

### Tạo project rỗng

Tạo một thư mục mới và mở nó như project trống. Phù hợp nếu bạn muốn AI tạo dự án từ đầu.

## Đổi tên, đổi icon, sắp xếp Project

Click chuột phải vào tên project trong sidebar:

- **Rename** — đổi tên hiển thị (không đổi tên thư mục thật).
- **Change icon** — chọn biểu tượng cho project (giúp phân biệt nhanh khi có nhiều project).
- **Remove** — xóa project khỏi Spec ADE (không xóa thư mục thật).

Kéo-thả để sắp xếp lại thứ tự project trong danh sách.

## Project Switcher

Khi có nhiều project, dùng "Project Switcher" để nhảy nhanh giữa các project bằng phím tắt thay vì click. Mở Project Switcher, gõ một phần tên project, nhấn Enter để chuyển.

## Session là gì?

Session là một "phiên" độc lập bên trong project. Mỗi session có:

- Một loại AI agent (Auggie, Claude, hoặc agent ACP do bạn cấu hình).
- Lịch sử trò chuyện riêng.
- Bộ tab file/terminal riêng.
- Không ảnh hưởng các session khác trong cùng project.

Bạn có thể có nhiều session cùng lúc — ví dụ một session dùng Auggie để code, một session khác dùng Claude để review, chạy song song trong cùng project.

## Tạo Session mới

Trong sidebar, dưới tên project, nhấn nút "+" hoặc "New Session". Hộp thoại hỏi bạn:

- **Loại CLI** — chọn Auggie, Claude, hoặc một agent ACP đã cấu hình. Mỗi loại có biểu tượng riêng (● Auggie, ◆ Claude) để dễ phân biệt.
- **Tên session** (tuỳ chọn) — nếu để trống, hệ thống tự đặt theo loại CLI và số thứ tự (ví dụ "Auggie 2", "Claude 3").

Sau khi tạo, session xuất hiện trong danh sách session của project.

## Thao tác với Session

Click chuột phải vào tên session:

- **Rename** — đổi tên session.
- **Duplicate** — tạo session giống hệt để thử nhánh khác.
- **Close** — đóng session (vẫn giữ trong danh sách).
- **Delete** — xóa hẳn session và lịch sử của nó.

**Kéo-thả** để sắp xếp lại thứ tự session.

**Double-click** vào tên session để đổi tên ngay tại chỗ.

## Chuyển đổi Session

Click vào session trong sidebar để chuyển sang session đó. Nội dung trên khu trung tâm thay đổi tương ứng — chat, file đang mở, terminal đều khôi phục về trạng thái lúc bạn rời session đó.

Nếu bạn đang gõ trong một session rồi chuyển sang session khác, nội dung đang gõ được giữ lại — quay lại sẽ thấy còn nguyên.

## Auggie session từ CLI bên ngoài

Nếu bạn từng chạy `auggie` trực tiếp trong terminal hệ thống (không qua Spec ADE), các session đó vẫn hiện trong Spec ADE dưới mục "Auggie sessions". Bạn có thể mở chúng và tiếp tục cuộc hội thoại trong Spec ADE.

## Remote Sessions

Nếu bạn cài Spec ADE ở chế độ server và truy cập qua trình duyệt từ xa, danh sách "Running Sessions" giúp bạn thấy ai đang dùng session nào. Hữu ích khi làm việc nhóm trên cùng một máy server.

## Bước tiếp theo

- [Chat với AI Agent](03-ai-chat.md) — bắt đầu trò chuyện trong session.
- [Layout & Tab](08-pane-tabs.md) — chia màn hình để dùng nhiều thứ song song.
- [Cài đặt & Phím tắt](10-settings.md) — đổi CLI mặc định cho session mới.
