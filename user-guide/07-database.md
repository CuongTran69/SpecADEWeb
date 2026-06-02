# 7. Database Workspace

Database Workspace là client SQL + NoSQL tích hợp trong Spec ADE. Bạn kết nối tới nhiều loại cơ sở dữ liệu, chạy query, sửa dữ liệu, vẽ ER diagram, sao lưu/khôi phục — tất cả trong cùng app.

## Mở Database Workspace

Click tab **"Database"** trên đầu sidebar (cùng dòng với Chat, Design, Deploy, Settings).

## Loại Database hỗ trợ

- **PostgreSQL**
- **MySQL / MariaDB**
- **SQLite**
- **MongoDB**
- **Redis**

Mỗi loại có giao diện chuyên biệt phù hợp đặc tính của nó (table cho SQL, collection cho Mongo, key-value cho Redis).

## Tạo kết nối mới

1. Trong Database sidebar, nhấn nút "+ New Connection".
2. Chọn loại database (Postgres / MySQL / SQLite / Mongo / Redis).
3. Điền thông tin:
   - **Name** — tên hiển thị.
   - **Host, Port** — cho server-based.
   - **Database / Path** — tên database hoặc đường dẫn file (SQLite).
   - **Username, Password** — nếu cần.
   - **Environment** — `dev`, `staging`, `prod`. Chọn `prod` sẽ tự bật Safe Mode chặt nhất.
4. (Tuỳ chọn) Bật **SSH Tunnel** nếu kết nối qua bastion.
5. Nhấn **"Test Connection"** để kiểm tra.
6. Nhấn **"Save"** để lưu.

Mật khẩu được lưu an toàn trong keychain hệ điều hành — không bao giờ lưu plain text trong file cài đặt.

### Import Connection từ ứng dụng khác

Spec ADE đọc được cấu hình kết nối từ:

- **TablePlus**
- **DBeaver**
- **Sequel Ace**
- **Beekeeper Studio**

Vào "Import Connections" trong Database sidebar, chọn ứng dụng nguồn — Spec ADE quét và liệt kê các kết nối có sẵn để bạn import. **Lưu ý:** chỉ import metadata (host, port, user). Mật khẩu **không** được giải mã từ ứng dụng kia — bạn phải nhập lại trong Spec ADE.

## Cấu trúc Sidebar Database

Sidebar bên trái Database Workspace hiện cây kết nối:

```
Connection 1
  ├── Database / Schema
  │     ├── Tables
  │     ├── Views
  │     ├── Functions
  │     └── …
  └── …
Connection 2
  └── …
```

Click chuột phải vào bất kỳ node nào để thấy menu phù hợp:

- **Trên kết nối** — Connect / Disconnect / Edit / Delete / Duplicate / Backup / Restore.
- **Trên schema** — New Table, View Stats, Drop Schema.
- **Trên table** — View Data, Edit Structure, Drop Table, Generate SQL.

## Tab Database

Mỗi tab Database mở một panel riêng. Có nhiều loại tab:

- **Data Grid** — xem/sửa dữ liệu bảng dạng lưới.
- **Query Editor** — viết SQL/Mongo aggregation/Redis command.
- **Schema** — cấu trúc bảng (cột, kiểu, ràng buộc, index, trigger).
- **ER Diagram** — sơ đồ quan hệ.
- **Server Dashboard** — tổng quan server (connections, queries, slow log…).

Chuyển tab nhanh bằng **Database Quick Switcher**.

## Data Grid (Lưới Dữ liệu)

Mở từ chuột phải table → "View Data" hoặc double-click table.

### Xem dữ liệu

- Hiển thị dạng lưới hàng × cột.
- Phân trang khi có nhiều bản ghi.
- Sort theo cột (click header).
- Filter theo cột.
- Resize cột bằng kéo viền.

### Sửa dữ liệu

Spec ADE dùng cơ chế **Deferred Commit** — bạn sửa nhiều ô, các thay đổi đánh dấu màu nhưng **chưa ghi xuống database**. Khi muốn áp:

1. Nhấn nút "**Preview SQL**" — Spec ADE hiện các câu SQL sẽ chạy.
2. Đọc kỹ, xác nhận đúng ý.
3. Nhấn "**Apply**" — chạy SQL trong transaction.
4. Hoặc "**Discard**" — bỏ hết thay đổi.

Cách này tránh sửa nhầm vô tình mà không thấy.

### Thêm / Xoá hàng

- Nút "+ New Row" thêm dòng mới (chưa commit).
- Click chuột phải vào dòng → "Delete Row" (đánh dấu xoá, chưa commit).
- Mọi thay đổi đều qua bước Preview trước khi áp.

### FK Preview

Click vào ô khoá ngoại — popover hiện thông tin bản ghi của bảng được tham chiếu. Tránh phải mở thêm tab để xem.

## Query Editor

Mở tab Query Editor để viết câu lệnh:

- **SQL** cho Postgres/MySQL/SQLite.
- **MongoDB Aggregation Pipeline** cho Mongo.
- **Redis Command** cho Redis.

### Tính năng

- **Syntax highlight** theo loại database.
- **Autocomplete** tên bảng, cột.
- **Run** — chạy query (Ctrl/⌘+Enter).
- **Cancel** — huỷ query đang chạy.
- **History** — danh sách query đã chạy, click để load lại.
- **Favorites** — đánh dấu query hay dùng.
- **Parameters** — query có placeholder (`:name`) sẽ hiện panel nhập tham số.

### Result Panel

Kết quả hiện dưới editor, dạng lưới (giống Data Grid). Có thể:

- Export ra CSV / JSON.
- Copy ô / hàng / cả lưới.

### Explain

Nút "Explain" gọi `EXPLAIN`/`EXPLAIN ANALYZE` của database. Spec ADE vẽ cây kế hoạch trực quan giúp đọc dễ hơn.

## MongoDB

### Document Viewer

Click vào collection → mở MongoDoc Viewer:

- Xem document dạng JSON/Tree.
- Sửa document inline.
- Thêm field, đổi kiểu (string, number, ObjectId, Date, bool).

### Aggregation Builder

Xây pipeline aggregation theo từng stage có form (match, group, project, lookup…). Hiển thị JSON tương đương khi chạy.

## Redis

### Key Tree

Sidebar Redis hiện danh sách keys, group theo prefix (mặc định dấu `:`). Click để xem.

### Type View

Mỗi loại key có panel riêng:

- **String** — xem/sửa giá trị.
- **List** — danh sách phần tử.
- **Set / Sorted Set** — tập hợp.
- **Hash** — bảng field-value.
- **Stream** — danh sách event.

### TTL Editor

Đặt thời gian sống cho key (Time To Live). Nhập số giây hoặc dùng presets (1 phút, 1 giờ, 1 ngày…).

## ER Diagram

Vào tab "ER Diagram" để xem sơ đồ quan hệ:

- Mỗi bảng là một block.
- Các đường nối thể hiện khoá ngoại.
- Kéo-thả block để sắp xếp.
- Zoom/pan bằng chuột giữa hoặc phím tắt.
- Export ra hình ảnh.

## Server Dashboard

Hiển thị thông số server thời gian thực:

- Số kết nối hiện tại.
- Truy vấn đang chạy.
- Slow query log (nếu bật).
- CPU/RAM của server (nếu có quyền).

Có nút "**Kill Session**" để chấm dứt session đang treo (yêu cầu xác nhận để tránh kill nhầm).

## Backup & Restore

### Backup

Click chuột phải vào kết nối → "Backup":

1. Chọn schema/database cần dump.
2. Chọn định dạng (SQL dump, custom binary, …).
3. Tuỳ chọn **Encrypt** — đặt mật khẩu để mã hoá file backup (Argon2id + AES-GCM-256).
4. Chọn nơi lưu file.
5. Nhấn "Start" — backup chạy nền, có thanh tiến độ.

Backup log hiện trong tab "Backup Log" để theo dõi lịch sử.

### Restore

Click chuột phải vào kết nối → "Restore":

1. Chọn file backup.
2. Nhập mật khẩu nếu file đã mã hoá.
3. Chọn target database.
4. Nhấn "Start".

### CLI Tools

Backup/Restore dùng CLI tools chuẩn của từng database (`pg_dump`, `mysqldump`, `mongodump`…). Spec ADE quản lý chúng:

- **PostgreSQL tools** — đi kèm sẵn khi cài Spec ADE.
- **MariaDB / Mongo tools** — tải tự động lần đầu cần dùng (xác minh checksum để đảm bảo bản tải đúng).

Nếu thiếu tool, hộp thoại "Install CLI Tool" sẽ xuất hiện hướng dẫn cài.

## Safe Mode

Spec ADE có 4 mức Safe Mode tránh sửa nhầm dữ liệu nguy hiểm:

- **read-only** — cấm mọi câu lệnh ghi.
- **strict** — chỉ cho ghi với điều kiện chặt (require WHERE clause, etc.).
- **confirm-destructive** — câu DROP/TRUNCATE/DELETE cần xác nhận hộp thoại.
- **off** — không hạn chế.

**Quy tắc tự động:** kết nối có `environment = prod` được nâng lên ít nhất `strict`, không hạ thấp được. Đây là rào chắn để tránh chạy nhầm câu lệnh phá hoại trên môi trường production.

Khi Safe Mode chặn câu lệnh, dialog hiện thông báo lý do và đề xuất cách điều chỉnh.

## SQL Preview Dialog

Mỗi khi Spec ADE sắp chạy SQL có khả năng thay đổi dữ liệu (apply edits, drop table, …), hộp thoại **SQL Preview** hiện ra:

- SQL được sinh ra hiển thị có syntax highlight.
- Bạn có thể chỉnh tay nếu cần.
- Nhấn "Run" để áp, "Cancel" để bỏ.

## Drop Table / Drop Database

Cực kỳ thận trọng: hộp thoại **DropTableDialog** yêu cầu bạn gõ đúng tên đối tượng để xác nhận. Có cảnh báo to nếu đang chạy trên môi trường prod.

## Multi-connection Tab

Bạn có thể mở nhiều tab Database song song, mỗi tab thuộc một kết nối khác nhau. Khi chuyển tab, panel của tab cũ giữ nguyên trạng thái — pending edits, query đang chạy, scroll position đều còn nguyên khi quay lại.

## Bước tiếp theo

- [Cài đặt & Phím tắt](10-settings.md) — cấu hình SSH Tunnel, port forwarding cho database.
- [Quy trình Git](06-git.md) — lưu file SQL trong dự án và commit.
