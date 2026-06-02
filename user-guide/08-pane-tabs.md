# 8. Layout & Tab

Spec ADE cho phép chia màn hình làm việc thành nhiều ô (pane), mỗi ô có thể chứa nhiều tab khác nhau — chat, file editor, terminal, git, database… Bạn sắp xếp giao diện theo nhịp làm việc của mình.

## Pane là gì?

**Pane** là một ô làm việc trong khu trung tâm. Mỗi pane:

- Có thanh tab riêng phía trên.
- Chứa nhiều tab cùng loại hoặc khác loại.
- Có thể chia thành 2 pane nhỏ (split).

Khi mở Spec ADE lần đầu, bạn có một pane duy nhất. Có thể chia tuỳ ý.

## Loại Tab

Spec ADE có 9 loại tab khác nhau:

| Loại | Nội dung |
|------|----------|
| **Session** | Khu chat AI |
| **File** | Trình soạn thảo file |
| **Spec** | Tài liệu spec / proposal |
| **Diff** | So sánh nội dung 2 file |
| **Compare** | So sánh 2 nhánh git |
| **Merge** | Trình giải quyết xung đột merge |
| **Git Log** | Lịch sử commit |
| **Terminal** | Terminal độc lập |
| **Monitor** | Process monitor |

Mỗi loại có biểu tượng riêng để nhận diện trên thanh tab.

## Tạo Tab Mới

Trên đầu pane:

- Nhấn nút **"+"** rồi chọn loại tab muốn mở.
- Hoặc dùng phím tắt mở từng loại tab cụ thể.

## Đóng Tab

- Click nút **X** trên tab.
- **Chuột giữa** vào tab.
- Phím tắt đóng tab (ví dụ Ctrl/⌘+W).

Khi pane chỉ còn 1 tab và bạn đóng nốt, pane tự gộp với pane bên cạnh (auto-unsplit).

## Sắp xếp Tab

- **Kéo-thả tab** trong cùng một pane để đổi thứ tự.
- **Kéo tab sang pane khác** — tab di chuyển sang pane đích.
- **Click chuột phải tab** — menu Close, Close Others, Close All, Close to the Right, Pin, Move…

## Đổi tên Tab Session

**Double-click** vào tên tab session để đổi tên ngay tại chỗ. Tên này thay tên hiển thị trong sidebar và tab.

## Dirty Indicator

Tab file có thay đổi chưa lưu hiện một **dấu chấm tròn** sau tên file. Sau khi lưu, dấu chấm biến mất.

## Chia Pane (Split)

### Chia ngang / dọc

Khi đang ở một tab, bạn có thể:

- **Phím tắt chia phải** — mở pane mới bên phải, tab hiện tại sang đó.
- **Phím tắt chia xuống** — mở pane mới bên dưới.
- **Click chuột phải tab → "Split Right" / "Split Down"**.

Bạn có thể chia nhiều tầng — pane bên phải lại chia tiếp xuống, v.v… tạo lưới linh hoạt.

### Kéo-thả vào vùng split

Khi kéo tab, **Split Overlay** xuất hiện chỉ ra các vùng có thể thả:

- **Trung tâm pane** — gộp tab vào pane đó.
- **Các cạnh** (trái, phải, trên, dưới) — tạo pane mới ở vị trí đó.

Thả vào cạnh, Spec ADE tự chia.

### Resize Pane

Kéo viền giữa hai pane để đổi kích thước. Spec ADE nhớ tỉ lệ — lần sau mở app vẫn giữ nguyên.

## Layout

Tổng thể các pane và tab tạo thành một **layout**.

### Layout tự lưu

Mỗi project có layout riêng. Spec ADE tự lưu khi bạn:

- Chia/gộp pane.
- Mở/đóng tab.
- Resize.

Lần sau mở project, layout khôi phục y nguyên.

### Layout Presets

Vào menu **"Layout Presets"** trên thanh công cụ:

- **Save Current as Preset** — lưu layout hiện tại với tên gợi nhớ.
- **Apply Preset** — áp dụng nhanh một layout đã lưu.
- **Manage Layouts** — đổi tên, xoá, sắp xếp các preset.

Hữu ích khi bạn có nhiều mode làm việc:

- **"Coding mode"** — file editor + terminal.
- **"Review mode"** — diff viewer + git log + chat.
- **"Database mode"** — query editor + data grid + ER diagram.

### Last Layout (Toàn cục)

Spec ADE còn lưu một layout "global" cuối cùng — khi bạn tạo project mới hoặc mở project chưa có layout, Spec ADE áp dụng layout này (đã bỏ tab cụ thể) để bạn không phải dựng lại từ đầu.

## Kéo-thả Tab giữa Project

Khi chuyển project, tab của project cũ ẩn đi, tab project mới hiện ra. Một số tab "global" (như terminal độc lập, monitor) vẫn hiện trên mọi project.

## Pane Drag-Resize Handles

Giữa hai pane có một thanh mảnh — đưa chuột tới sẽ thấy con trỏ resize. Kéo để đổi tỉ lệ. Double-click vào handle để reset về 50/50.

## Bước tiếp theo

- [Cài đặt & Phím tắt](10-settings.md) — gán phím tắt riêng cho split / chuyển tab.
- [Soạn thảo File](05-file-editor.md) — kết hợp file editor với split để xem 2 file song song.
