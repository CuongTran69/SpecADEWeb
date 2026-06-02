# 3. Chat với AI Agent

Mỗi session trong Spec ADE có một khu chat. Bạn gõ câu hỏi hoặc yêu cầu, AI trả lời và có thể tự thực hiện hành động — đọc file, sửa code, chạy lệnh, gọi tools — tuỳ năng lực của agent bạn chọn.

## Các loại Agent

Spec ADE hỗ trợ nhiều loại agent. Bạn chọn loại khi tạo session.

### Auggie

Trợ lý AI chạy ở chế độ PTY (giao tiếp qua dòng lệnh). Phù hợp cho coding agent quen với CLI workflow. Dấu hiệu: chấm tròn ● bên cạnh tên session.

### Claude (Claude Code)

Trợ lý từ Anthropic chạy ở chế độ PTY. Phù hợp cho cuộc hội thoại lập luận sâu, sửa code chính xác. Dấu hiệu: hình thoi ◆ bên cạnh tên session.

### Agent ACP (Agent Client Protocol)

Bạn có thể đăng ký bất kỳ agent nào tuân thủ chuẩn ACP. Mỗi agent ACP có giao diện chat riêng — hiển thị tool call, plan, file thay đổi rõ ràng theo từng bước.

Vào Settings → Agents để xem danh sách agent có sẵn và đăng ký agent mới.

## Khu chat trông như thế nào

Khu chat gồm 4 phần chính từ trên xuống:

- **Tiêu đề session** — tên session, loại CLI, nút thiết lập.
- **Vùng tin nhắn** — lịch sử trò chuyện, cuộn xem lại.
- **Khu nhập liệu** (input) — nơi bạn gõ tin nhắn.
- **Thanh công cụ** dưới input — các nút đính kèm, slash command, gửi.

## Gửi tin nhắn

Gõ nội dung vào khu nhập liệu và:

- Nhấn **Enter** để gửi.
- Nhấn **Shift+Enter** để xuống dòng (không gửi).

Sau khi gửi, AI bắt đầu trả lời. Tin nhắn của AI hiện theo từng đoạn (streaming) — bạn không phải đợi xong toàn bộ mới đọc được.

## Slash Command

Gõ dấu **`/`** ở đầu khu nhập liệu để mở menu slash command — danh sách lệnh nhanh tương ứng với agent bạn đang dùng. Ví dụ:

- `/help` — xem hướng dẫn của agent.
- `/clear` — xóa lịch sử hội thoại.
- Các lệnh tuỳ biến do dự án định nghĩa (mỗi project có thể có file lệnh riêng).

Cách dùng:

1. Gõ `/` — menu xuất hiện.
2. Gõ vài chữ tên lệnh để lọc.
3. Nhấn **Tab** hoặc **Enter** để chọn.
4. Gõ tham số (nếu có), nhấn Enter để chạy.

Spec ADE quét slash command từ thư mục dự án (`.augment/commands/`, `.claude/commands/`) và cả thư mục cá nhân của bạn (`$HOME/.claude/commands/`, `$HOME/.augment/commands/`). Lệnh nào trùng tên thì lệnh trong dự án ưu tiên hơn.

## Skill

Tương tự slash command, "Skill" là gói kiến thức chuyên môn được kích hoạt theo tên (`/skill-name`). Mở **Skill Manager** trong sidebar để duyệt skill có sẵn, bật/tắt skill, hoặc tự tạo skill mới.

## @Mention

Gõ **`@`** trong khu nhập liệu để chèn nhanh một file hoặc thư mục từ project vào tin nhắn. Menu lọc theo tên file. Khi gửi, AI sẽ thấy bạn đang nói về file nào.

## Đính kèm hình ảnh

Có ba cách đưa hình vào chat:

1. **Paste trực tiếp** — copy ảnh vào clipboard rồi paste (Ctrl/⌘+V) trong khu nhập liệu.
2. **Kéo-thả** — kéo file ảnh từ desktop hoặc file explorer vào khu chat.
3. **Nút đính kèm** — nhấn nút "Attach" trên thanh công cụ dưới input.

Hình ảnh được gửi cho AI cùng tin nhắn của bạn. Hữu ích khi mô tả lỗi UI, tham chiếu mockup, hoặc hỏi về sơ đồ.

## Enhance Prompt

Nút "Enhance Prompt" trên thanh công cụ giúp viết lại tin nhắn của bạn cho rõ ràng và đầy đủ hơn trước khi gửi. Phù hợp khi bạn vội gõ ngắn, muốn AI "tô màu" thêm bối cảnh.

Bạn có thể cấu hình provider AI, model, và prompt mẫu cho tính năng này trong Settings → Enhance Prompt.

## Plan & Tool Call (chỉ với Agent ACP)

Khi dùng agent ACP, khu chat hiển thị thêm:

- **Plan** — danh sách bước AI dự định làm. Bạn xem trước, biết AI sẽ làm gì.
- **Tool call** — mỗi lần AI gọi một công cụ (đọc file, sửa file, chạy lệnh) hiện thành một thẻ riêng có thể bung ra xem chi tiết.
- **Permission request** — khi AI muốn làm gì cần xác nhận (sửa file, chạy lệnh nguy hiểm), hộp thoại xác nhận xuất hiện. Bạn duyệt hoặc từ chối.

## Hủy / Dừng AI

Khi AI đang trả lời, nút "Send" đổi thành nút "Stop" (biểu tượng vuông). Nhấn để dừng phản hồi giữa chừng.

## Lịch sử Chat

- **Cuộn lên** xem lại tin nhắn cũ.
- **Tìm trong chat** — gõ phím tắt tìm kiếm để lọc tin nhắn theo từ khoá.
- **Xoá lịch sử** — nút trên thanh tiêu đề session, hoặc lệnh `/clear`.
- **Lịch sử ACP** — riêng agent ACP có hộp thoại "History" để xem lại các session ACP đã đóng.

## Ẩn / Hiện khu chat

Mỗi loại CLI có thể ẩn/hiện khu chat riêng. Nhấn nút "Toggle Chat" ở góc session — bạn vẫn xem được terminal/file mà không bị chat chiếm chỗ. Tuỳ chọn này được ghi nhớ riêng cho Auggie và Claude.

## Connection Mode

Trên thanh tiêu đề session bạn thấy chỉ báo kết nối:

- **Connected** — agent sẵn sàng nhận tin.
- **Connecting / Reconnecting** — đang khôi phục kết nối, có thanh trạng thái.
- **Disconnected** — agent đã thoát hoặc lỗi. Có nút "Restart" để khởi động lại.

## Bước tiếp theo

- [Send-with-Goal](11-send-with-goal.md) — giao mục tiêu cho AI tự lặp đến khi đạt.
- [Quy trình Git](06-git.md) — AI có thể viết commit message hộ bạn.
- [Cài đặt & Phím tắt](10-settings.md) — chỉnh provider AI cho Enhance Prompt và AI Commit.
