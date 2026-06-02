# 9. Process Monitor

Process Monitor là task manager tích hợp giúp bạn xem máy đang chạy gì, dùng tài nguyên thế nào, và kết thúc tiến trình treo nếu cần — tương tự Activity Monitor (macOS), Task Manager (Windows), hay `htop` (Linux), nhưng nằm gọn trong Spec ADE.

## Mở Process Monitor

- Tạo tab loại **"Monitor"** từ nút "+" của pane.
- Hoặc dùng phím tắt mở Monitor.

Monitor mở ra như một tab — có thể chia pane, để cạnh terminal, hay làm tab nền theo dõi.

## Bố cục

Cửa sổ Monitor chia làm 2 khu chính:

- **Phần đầu** — biểu đồ tổng hợp CPU, RAM, GPU, disk, network theo thời gian thực (sparkline).
- **Phần dưới** — bảng danh sách tiến trình.

## Chỉ số Tài nguyên

### CPU

- Phần trăm sử dụng tổng.
- Phân tách theo từng core (nếu mở rộng).
- Sparkline mini hiển thị 60 giây gần nhất.

### RAM

- Đã dùng / tổng.
- Bộ nhớ ảo (swap) sử dụng.

### GPU

Nếu máy có card NVIDIA và driver hỗ trợ:

- % sử dụng GPU.
- Bộ nhớ GPU đã dùng.
- Nhiệt độ.

Nếu không có GPU NVIDIA hoặc thiếu driver, phần GPU ẩn đi tự động.

### Disk

- Tốc độ đọc/ghi hiện tại.
- Phân vùng và mức đầy.

### Network

- Tốc độ tải lên / xuống.
- Tổng dữ liệu đã truyền.

## Bảng Tiến trình

Mỗi dòng là một tiến trình đang chạy:

| Cột | Ý nghĩa |
|-----|--------|
| **PID** | Mã định danh tiến trình |
| **Name** | Tên thực thi |
| **CPU %** | % CPU |
| **Memory** | RAM dùng |
| **User** | Tài khoản chạy |
| **Status** | Đang chạy / ngủ / dừng |
| **Start time** | Thời điểm khởi động |

## Sắp xếp & Lọc

- **Click header cột** để sort theo cột đó (ascending / descending).
- **Ô tìm** trên đầu bảng — gõ tên hoặc PID để lọc.
- Mặc định sort theo CPU giảm dần — tiến trình ngốn CPU nhiều nhất ở trên cùng.

## Cập nhật Real-time

Monitor tự cập nhật mỗi vài giây (mặc định 3 giây). Bạn không cần làm gì.

## Kill Process

Click chuột phải vào dòng tiến trình → "Kill Process". Hộp thoại xác nhận hiện tên và PID; nhấn "Kill" để chấm dứt.

**Cảnh báo:** kill tiến trình có thể làm mất dữ liệu chưa lưu của ứng dụng đó. Hãy chắc chắn trước khi kill.

Trên macOS/Linux, Spec ADE gửi tín hiệu `SIGTERM` trước (kill nhẹ nhàng). Nếu tiến trình vẫn không thoát, bạn có thể chọn "Force Kill" để gửi `SIGKILL`.

## Mini Sparkline

Status bar dưới cùng có sparkline nhỏ hiện CPU/RAM khái quát. Hover qua nó để thấy chi tiết. Click để mở Monitor đầy đủ.

## Bước tiếp theo

- [Layout & Tab](08-pane-tabs.md) — đặt Monitor làm tab nền chia ô để vừa code vừa theo dõi.
