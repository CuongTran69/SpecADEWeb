# 1. Bắt đầu nhanh

Chương này giúp bạn cài đặt và mở Spec ADE lần đầu tiên.

## Spec ADE là gì?

Spec ADE là môi trường làm việc cho lập trình viên dùng AI. Bạn mở một dự án (thư mục code), Spec ADE sẽ hiện ra một cửa sổ tích hợp gồm:

- **Khu chat** — nơi trò chuyện với trợ lý AI để hỏi, sửa code, xây tính năng.
- **Cây file** — duyệt thư mục dự án, mở file để đọc hoặc sửa.
- **Terminal** — chạy lệnh dòng lệnh ngay trong app.
- **Git panel** — xem thay đổi, commit, push, pull.
- **Database** — kết nối tới các cơ sở dữ liệu của bạn.
- **Process monitor** — xem máy đang chạy gì, có nặng không.

Mọi thứ ở trong một cửa sổ duy nhất, không cần chuyển đổi giữa nhiều ứng dụng.

## Cài đặt

Có ba cách dùng Spec ADE:

### Cách 1 — App desktop

Tải bản cài đặt cho hệ điều hành của bạn (Windows, macOS, hoặc Linux), chạy file cài đặt, mở app như mọi ứng dụng khác. Cách này phù hợp nếu bạn chỉ muốn dùng một mình trên máy của mình.

### Cách 2 — Trình duyệt (chế độ server)

Khởi chạy Spec ADE ở chế độ server, sau đó mở trình duyệt và truy cập địa chỉ hiển thị (mặc định là cổng 3100). Cách này tiện khi bạn muốn truy cập từ xa, hoặc dùng chung trong nhóm.

### Cách 3 — Service nền

Cài Spec ADE làm service tự khởi động cùng máy. Sau khi cài, mỗi lần đăng nhập máy là Spec ADE đã sẵn sàng, không cần mở thủ công. Hỗ trợ:

- **Windows** — đăng ký với Task Scheduler.
- **macOS** — đăng ký với launchd.
- **Linux** — đăng ký với systemd.

Vào tab "Settings" sau khi mở app lần đầu để bật/tắt service nền.

## Lần khởi chạy đầu tiên

Khi bạn mở Spec ADE lần đầu, hệ thống sẽ yêu cầu:

1. **Đăng nhập** — đăng ký tài khoản hoặc đăng nhập nếu đã có.
2. **Kích hoạt license** — nhập mã license đã mua. Mã license gắn với máy bạn đang dùng (qua mã định danh thiết bị hiển thị trên màn hình kích hoạt).
3. **Tạo project đầu tiên** — chọn thư mục dự án trên máy. Spec ADE sẽ ghi nhớ và mở lại lần sau.

Sau ba bước này, bạn vào màn hình làm việc chính.

## Bố cục màn hình chính

Màn hình chính chia làm ba khu vực:

- **Sidebar bên trái** — danh sách project, danh sách session trong project hiện tại, các tab điều hướng (Chat, Design, Database, Deploy, Settings).
- **Khu trung tâm** — các pane (ô làm việc) chứa chat, file editor, terminal, git, database… Bạn có thể chia khu này thành nhiều ô song song.
- **Status bar dưới cùng** — hiển thị nhánh git, trạng thái goal, thông số CPU/RAM, thông báo nhanh.

## Chuyển workspace

Spec ADE có 5 workspace lớn, chuyển bằng các tab trên đầu sidebar:

| Workspace | Dùng cho |
|-----------|----------|
| **Chat** | Nói chuyện với AI, sửa code, làm việc trên file |
| **Design** | Vẽ sơ đồ, mockup, tài liệu thiết kế |
| **Database** | Kết nối và làm việc với cơ sở dữ liệu |
| **Deploy** | Triển khai dự án (sẽ phát triển thêm) |
| **Settings** | Cài đặt toàn cục cho ứng dụng |

Bạn có thể vào workspace nào tùy ý — dữ liệu của workspace này không ảnh hưởng workspace khác.

## Bước tiếp theo

- Đọc chương [Quản lý Project & Session](02-projects-sessions.md) để học cách tổ chức công việc.
- Đọc chương [Chat với AI Agent](03-ai-chat.md) nếu bạn muốn bắt đầu làm việc với AI ngay.
- Đọc chương [Cài đặt & Phím tắt](10-settings.md) để cá nhân hóa giao diện.
