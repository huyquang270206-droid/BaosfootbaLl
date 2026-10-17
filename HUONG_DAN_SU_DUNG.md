# TÀI LIỆU HỆ THỐNG: FOOTBALL HUB VIỆT NAM

Nền tảng tin tức, lịch thi đấu, kết quả, tỷ số trực tiếp và bảng xếp hạng bóng đá chuyên nghiệp hàng đầu Việt Nam.

---

## 1. TỔNG QUAN HỆ THỐNG

- **Ngôn ngữ giao diện**: 100% tiếng Việt có dấu chuẩn xác (không tồn tại các nhãn mặc định tiếng Anh như *Home*, *News*, *Fixtures*, *Standings*, *Loading*, *No data*).
- **Múi giờ**: `Asia/Ho_Chi_Minh` (GMT+7), định dạng ngày `DD/MM/YYYY`, định dạng giờ `HH:mm` (24 giờ).
- **Kiến trúc ứng dụng**: Full-Stack React + TypeScript + Tailwind CSS kết hợp máy chủ Express API.
- **Ngân sách vận hành**: Hoàn toàn **0 đồng**, sử dụng nguồn dữ liệu mở và gói miễn phí của `football-data.org`.
- **Cơ sở dữ liệu**: Thiết kế theo chuẩn PostgreSQL Supabase với quy ước đặt tên bảng và cột **tiếng Việt không dấu, chữ thường và phân tách bằng dấu gạch dưới (`snake_case`)**.

---

## 2. QUY ƯỚC CƠ SỞ DỮ LIỆU POSTGRESQL / SUPABASE

Tệp migration chính thức được lưu tại:
`/supabase/migrations/20261017000000_khoi_tao_co_so_du_lieu_bong_da.sql`

### Danh sách các bảng nghiệp vụ chính:
1. `vai_tro`: Phân quyền quản trị (quan_tri_vien, bien_tap_vien, doc_gia).
2. `nguoi_dung`: Thông tin tài khoản độc giả và quản trị.
3. `ho_so_nguoi_dung`: Chi tiết hồ sơ cá nhân.
4. `quoc_gia`: Quốc gia của giải đấu, câu lạc bộ và cầu thủ.
5. `giai_dau`: Giải đấu bóng đá (V.League 1, Ngoại hạng Anh, UEFA Champions League, La Liga, Serie A, Bundesliga).
6. `mua_giai`: Mùa giải thi đấu hiện tại và lịch sử.
7. `doi_bong`: Câu lạc bộ bóng đá (Hà Nội FC, CAHN, Thể Công Viettel, Nam Định, Arsenal, Liverpool, Real Madrid...).
8. `san_van_dong`: Thông tin sân vận động thi đấu.
9. `cau_thu`: Hồ sơ cầu thủ chuyên nghiệp.
10. `tran_dau`: Lịch thi đấu, tỷ số hiệp một, tỷ số cả trận, trạng thái trận đấu.
11. `su_kien_tran_dau`: Diễn biến trận (bàn thắng, thẻ vàng, thẻ đỏ, penalty, thay người).
12. `thong_ke_tran_dau`: Số liệu chuyên sâu (kiểm soát bóng, dứt điểm trúng đích, phạt góc, phạm lỗi).
13. `doi_hinh_tran_dau`: Sơ đồ chiến thuật (4-3-3, 4-2-3-1), đội hình ra sân chính thức và dự bị.
14. `bang_xep_hang`: Điểm số, trận thắng - hòa - thua, bàn thắng - bàn thua, hiệu số và phong độ 5 trận gần nhất.
15. `danh_muc_bai_viet`: Danh mục tin tức (Bóng đá Việt Nam, Ngoại hạng Anh, Cúp C1, Chuyển nhượng, Phân tích chiến thuật...).
16. `bai_viet`: Bài viết, tin tức thể thao xuất bản trên website.
17. `the_bai_viet`: Từ khóa gắn với bài viết.
18. `binh_luan`: Ý kiến và nhận định của độc giả về bài viết và trận đấu.
19. `doi_bong_yeu_thich`: Câu lạc bộ độc giả theo dõi.
20. `bai_viet_da_luu`: Bài viết được đánh dấu để đọc sau.
21. `nha_cung_cap_du_lieu`: Cấu hình nguồn API bên ngoài.
22. `nhat_ky_dong_bo`: Lưu vết chi tiết từng lần đồng bộ dữ liệu (số bản ghi xử lý, thời gian thực thi ms, trạng thái).

---

## 3. CÁC TÍNH NĂNG ĐÃ TRIỂN KHAI HOÀN THIỆN

### 1. Trang chủ (Trang chủ)
- **Dải tỷ số trực tiếp (Live Ticker)**: Hiển thị liên tục các trận đang diễn ra kèm số phút thi đấu (`68'`), tỷ số và kết quả mới nhất.
- **Hero Grid tin nổi bật**: Bài viết trọng điểm với hình ảnh phóng sự thể thao sắc nét, mô tả cô đọng và danh sách tin đọc nhiều.
- **Tâm điểm vòng đấu**: Thẻ trận đấu với logo câu lạc bộ, tỷ số, thời gian bắt đầu, sân vận động và trạng thái trực tiếp.
- **Bảng xếp hạng rút gọn**: Cập nhật nhanh Top 5 giải V.League 1 và Ngoại hạng Anh.
- **Góc nhìn chiến thuật & Chuyển nhượng**: Phân tích chuyên sâu về lối chơi pressing, chuyển nhượng mùa hè và mùa đông.

### 2. Lịch thi đấu & Kết quả
- Bộ lọc trạng thái: **Tất cả**, **Trực tiếp**, **Sắp diễn ra**, **Đã kết thúc**.
- Bộ lọc giải đấu: **V.League 1**, **Ngoại hạng Anh**, **UEFA Champions League**, **La Liga**, **Serie A**, **Bundesliga**.
- Thẻ trận đấu chi tiết với khả năng nhấn xem diễn biến đầy đủ.

### 3. Chi tiết trận đấu (Match Modal)
Gồm 4 tab chuyên sâu:
- **Tổng quan**: Thông tin giải đấu, thời gian, sân thi đấu, trọng tài bắt chính và các bàn thắng ghi được.
- **Diễn biến**: Dòng thời gian chi tiết từng phút ghi bàn, thẻ vàng, thẻ đỏ và diễn biến kịch tính.
- **Đội hình**: Sơ đồ chiến thuật (4-3-3, 4-2-3-1), tên HLV trưởng, danh sách 11 cầu thủ đá chính kèm số áo và vị trí thi đấu.
- **Thống kê**: Biểu đồ so sánh tỷ lệ kiểm soát bóng %, dứt điểm, sút trúng đích, phạt góc, phạm lỗi và thẻ phạt.

### 4. Hệ thống Tin tức & Bài viết
- Phân loại chuyên mục rõ ràng bằng tiếng Việt.
- Trình đọc bài viết chuyên nghiệp với lượt đọc, tác giả, nguồn tin, thẻ chủ đề.
- **Hệ thống bình luận thể thao**: Độc giả có thể gửi ý kiến nhận định trực tiếp với lưu vết tức thì.

### 5. Quản trị CMS & Đồng bộ dữ liệu
- **Tổng quan hệ thống**: Thống kê số lượng bài viết, trận đấu, trạng thái API 0 đồng.
- **Soạn thảo và xuất bản bài viết**: Biểu mẫu CMS với chọn ảnh thể thao có sẵn, tiêu đề, mô tả ngắn, nội dung, danh mục, tác giả và thẻ.
- **Quản lý bài viết**: Danh sách bài viết, lượt đọc, thao tác xem và xóa bài viết.
- **Đồng bộ API bóng đá**: Nút kích hoạt đồng bộ trực tiếp từ `football-data.org`, bảng nhật ký đồng bộ (`nhat_ky_dong_bo`) hiển thị thời gian, số lượng bản ghi mới/cập nhật và thời gian phản hồi (ms).

### 6. Không gian người hâm mộ & Yêu thích
- Bật/tắt theo dõi câu lạc bộ thân thuộc (Hà Nội FC, CAHN, Thể Công Viettel, Nam Định, Arsenal, Liverpool, Real Madrid...).
- Danh sách bài viết đã lưu để đọc lại mọi lúc.

### 7. Tìm kiếm thông minh toàn diện
- Hỗ trợ gõ tiếng Việt có dấu hoặc không dấu (accent-insensitive).
- Tìm kiếm đồng thời: Bài viết thể thao, Câu lạc bộ, Giải đấu và Trận đấu.

---

## 4. HƯỚNG DẪN CẤU HÌNH VÀ TRIỂN KHAI

### Biến môi trường (`.env`):
```bash
# Khóa API miễn phí từ football-data.org (tùy chọn để tăng hạn mức request)
FOOTBALL_DATA_ORG_API_KEY=""

# Kết nối cơ sở dữ liệu Supabase (nếu kết nối vào dự án Supabase ngoài)
SUPABASE_URL=""
SUPABASE_ANON_KEY=""
SUPABASE_SERVICE_ROLE_KEY=""
DATABASE_URL=""

# Cổng máy chủ
PORT=3000
```

### Lệnh chạy máy chủ:
```bash
# Chạy môi trường phát triển (Full-Stack dev)
npm run dev

# Kiểm tra cú pháp và kiểu dữ liệu TypeScript
npm run lint

# Đóng gói ứng dụng cho môi trường sản xuất
npm run build

# Chạy ứng dụng đã đóng gói
npm start
```
