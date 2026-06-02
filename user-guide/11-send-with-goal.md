# 11. Send-with-Goal

Send-with-Goal là cách bạn giao **mục tiêu** cho AI thay vì chỉ một câu hỏi đơn lẻ. Bạn nói rõ "thành công nghĩa là gì", AI sẽ tự lặp các lượt trả lời cho đến khi đạt mục tiêu (hoặc hết giới hạn iteration).

Ví dụ:

- Mục tiêu: "Tất cả test pass và `cargo clippy` không còn warning."
- Bạn gửi yêu cầu cùng mục tiêu này.
- AI sửa code → chạy test → còn lỗi → sửa tiếp → chạy lại → … cho đến khi tất cả pass.

Bạn không phải bấm "Continue" sau mỗi lượt — Spec ADE tự làm.

## Bật Goal Agent

Trong Settings → **Goal Agent**, chọn agent ACP nào sẽ làm "trọng tài" — agent này nhìn cuộc hội thoại sau mỗi lượt, đánh giá mục tiêu đã đạt chưa, quyết định "continue" hay "complete".

Bạn có thể dùng cùng một loại agent với target (ví dụ Claude làm cả target và goal), hoặc dùng agent khác (target Auggie, goal Claude).

## Mở Send-with-Goal Modal

Cạnh nút **Send** trong khu chat input có nút **"Send with Goal"** (icon mục tiêu / cờ đích).

Nhấn nút này → modal mở ra với các trường:

- **Composer Text** — tin nhắn bạn vừa gõ trong chat input (auto điền vào, có thể sửa).
- **Success Criterion** — tiêu chí để xác định mục tiêu hoàn thành. Viết rõ ràng, có thể kiểm chứng được. Ví dụ: "Tất cả test trong `tests/` pass và không có warning từ linter."
- **Goal Agent** — chọn agent giám sát (mặc định lấy từ Settings).
- **Max Iterations** — số lần lặp tối đa (mặc định 10). Đạt giới hạn này, goal sẽ tự dừng dù chưa đạt mục tiêu.

Nhấn **"Start"** — Spec ADE đồng thời:

1. Gửi composer text vào target session như tin nhắn bình thường.
2. Khởi động goal agent ngầm.

## Vòng lặp diễn ra thế nào

Sau khi target session AI trả lời xong **một lượt** (turn-end):

1. Spec ADE gửi sang goal agent: prompt template với `{{goal}}` (success criterion), `{{conversation}}` (lịch sử gần đây), `{{iteration}}` (lượt thứ mấy), `{{maxIterations}}`.
2. Goal agent phân tích, trả lời với cú pháp:
   - `<action type="continue">` + nội dung prompt tiếp theo cho target → Spec ADE forward prompt đó vào target session.
   - `<action type="complete">` → Spec ADE đánh dấu goal **đã đạt**, dừng lặp.
3. Lặp đến khi complete hoặc đạt max iterations.

Bạn không phải động tay vào trong suốt quá trình — chỉ ngồi xem.

## Hiển thị Trạng thái

### GoalStatusChip

Trên Status Bar dưới cùng có **chip Goal Status**:

- **Idle** — không có goal đang chạy.
- **Running (3/10)** — goal đang chạy, lượt 3/10.
- **Achieved** — đã hoàn thành.
- **Failed** — thất bại (hết iteration, parse error, agent thoát).

Hover qua chip để thấy success criterion. Click chip để mở **GoalPanel**.

### GoalPanel

Panel hiện chi tiết goal đang chạy:

- Tên session đích.
- Success criterion.
- Iteration đếm.
- Lịch sử các action goal agent đã ra ("continue" với prompt nào, "complete" lúc nào).
- Nút **"Stop"** để bạn dừng giữa chừng nếu thấy không ổn.

### Live Goal Activity

Trong khi goal agent đang "suy nghĩ" giữa các lượt target, Spec ADE stream luôn token / tool call / response của goal agent vào khu chat dưới dạng "Streaming Activity Card". Bạn thấy goal đang nghĩ gì.

## Dừng Goal

Có 4 cách goal kết thúc:

1. **Goal agent ra `complete`** — đạt mục tiêu, ✅ Achieved.
2. **User nhấn Stop** — bạn chủ động dừng, ⏹ Stopped.
3. **Hết max iterations** — vượt giới hạn, ⚠ Failed (max iter).
4. **Lỗi parse** — goal agent trả lời sai cú pháp 2 lần liên tiếp hoặc agent thoát giữa chừng → Failed.

## Persist Goal

Mỗi project lưu danh sách goal record (success criterion, kết quả, thời điểm) vào cài đặt. Lần sau mở app, các goal đã hoàn thành vẫn thấy được. Spec ADE giữ tối đa 50 record active để không nặng.

## Ví dụ thực tế

### Ví dụ 1 — Sửa lỗi test

- **Composer**: "Hãy sửa các test đang fail trong module auth."
- **Success Criterion**: "Chạy `cargo test --package auth` không còn fail."
- **Max Iter**: 8.

AI sẽ chạy test, đọc lỗi, sửa code, chạy lại, lặp.

### Ví dụ 2 — Refactor đến khi clippy sạch

- **Composer**: "Refactor module `parser` cho gọn hơn."
- **Success Criterion**: "`cargo clippy` không có warning, test vẫn pass."
- **Max Iter**: 6.

### Ví dụ 3 — Implement feature đầy đủ

- **Composer**: "Implement endpoint `/users/me`."
- **Success Criterion**: "Endpoint trả 200 với token hợp lệ, có test case 401 và 200, doc cập nhật."
- **Max Iter**: 12.

## Mẹo viết Success Criterion

- **Cụ thể, đo được** — "Test pass" tốt hơn "code đúng".
- **Cho lệnh kiểm tra** — "Chạy `just check` không lỗi" giúp AI biết cách verify.
- **Tránh tiêu chí mơ hồ** như "Code đẹp", "Tốt hơn" — AI khó biết khi nào dừng.

## Bước tiếp theo

- [Chat với AI Agent](03-ai-chat.md) — phần cơ bản về chat.
- [Cài đặt & Phím tắt](10-settings.md) — chỉnh prompt template Goal Agent.
