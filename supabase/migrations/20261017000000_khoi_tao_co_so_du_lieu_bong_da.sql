-- ==============================================================================
-- DỰ ÁN: FOOTBALL HUB VIỆT NAM
-- HỆ THỐNG CƠ SỞ DỮ LIỆU POSTGRESQL / SUPABASE
-- QUY ƯỚC: TÊN BẢNG VÀ TÊN CỘT TIẾNG VIỆT KHÔNG DẤU, CHỮ THƯỜNG, SNAKE_CASE
-- ==============================================================================

-- Bật các extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. BẢNG VAI TRÒ (roles)
CREATE TABLE IF NOT EXISTS vai_tro (
    id VARCHAR(50) PRIMARY KEY,
    ten_vai_tro VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- Khởi tạo các vai trò cơ bản
INSERT INTO vai_tro (id, ten_vai_tro, mo_ta) VALUES
    ('quan_tri_vien', 'Quản trị viên', 'Toàn quyền quản trị hệ thống, quản lý nội dung và đồng bộ dữ liệu'),
    ('bien_tap_vien', 'Biên tập viên', 'Biên tập, viết bài và xuất bản bài viết thể thao'),
    ('doc_gia', 'Độc giả', 'Đọc tin tức, lưu bài viết, theo dõi đội bóng và bình luận')
ON CONFLICT (id) DO NOTHING;

-- 2. BẢNG NGƯỜI DÙNG (users)
CREATE TABLE IF NOT EXISTS nguoi_dung (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    ten_hien_thi VARCHAR(150) NOT NULL,
    anh_dai_dien TEXT,
    vai_tro_id VARCHAR(50) DEFAULT 'doc_gia' REFERENCES vai_tro(id),
    trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG HỒ SƠ NGƯỜI DÙNG (user profiles)
CREATE TABLE IF NOT EXISTS ho_so_nguoi_dung (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID UNIQUE NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    so_dien_thoai VARCHAR(20),
    gioi_thieu TEXT,
    thanh_pho VARCHAR(100),
    ngay_sinh DATE,
    thong_bao_email BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG QUỐC GIA (countries)
CREATE TABLE IF NOT EXISTS quoc_gia (
    id VARCHAR(50) PRIMARY KEY,
    ten VARCHAR(150) NOT NULL,
    ten_tieng_anh VARCHAR(150),
    ma_quoc_gia VARCHAR(10),
    co_quoc_gia TEXT,
    chau_luc VARCHAR(50),
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG GIẢI ĐẤU (leagues / competitions)
CREATE TABLE IF NOT EXISTS giai_dau (
    id VARCHAR(100) PRIMARY KEY,
    ten VARCHAR(200) NOT NULL,
    ten_tieng_anh VARCHAR(200),
    slug VARCHAR(200) UNIQUE NOT NULL,
    quoc_gia_id VARCHAR(50) REFERENCES quoc_gia(id),
    hang_dau VARCHAR(50) DEFAULT 'hang_nhat',
    loai_giai VARCHAR(50) DEFAULT 'cau_lac_bo', -- cau_lac_bo / doi_tuyen_quoc_gia
    logo TEXT,
    mo_ta TEXT,
    thu_tu_uu_tien INT DEFAULT 10,
    ma_nha_cung_cap VARCHAR(100),
    trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG MÙA GIẢI (seasons)
CREATE TABLE IF NOT EXISTS mua_giai (
    id VARCHAR(100) PRIMARY KEY,
    giai_dau_id VARCHAR(100) NOT NULL REFERENCES giai_dau(id) ON DELETE CASCADE,
    ten VARCHAR(100) NOT NULL,
    nam_bat_dau INT NOT NULL,
    nam_ket_thuc INT NOT NULL,
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE,
    vong_hien_tai INT DEFAULT 1,
    dang_dien_ra BOOLEAN DEFAULT TRUE,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 7. BẢNG SÂN VẬN ĐỘNG (stadiums / venues)
CREATE TABLE IF NOT EXISTS san_van_dong (
    id VARCHAR(100) PRIMARY KEY,
    ten VARCHAR(200) NOT NULL,
    thanh_pho VARCHAR(150),
    suc_chua INT,
    nam_khanh_thanh INT,
    hinh_anh TEXT,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 8. BẢNG ĐỘI BÓNG (clubs / teams)
CREATE TABLE IF NOT EXISTS doi_bong (
    id VARCHAR(100) PRIMARY KEY,
    ten VARCHAR(200) NOT NULL,
    ten_tieng_anh VARCHAR(200),
    ten_viet_tat VARCHAR(50),
    slug VARCHAR(200) UNIQUE NOT NULL,
    quoc_gia_id VARCHAR(50) REFERENCES quoc_gia(id),
    san_van_dong_id VARCHAR(100) REFERENCES san_van_dong(id),
    logo TEXT,
    mau_ao_chinh VARCHAR(50),
    mau_ao_phu VARCHAR(50),
    nam_thanh_lap INT,
    website VARCHAR(255),
    ma_nha_cung_cap VARCHAR(100),
    trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BẢNG ĐỘI BÓNG THAM DỰ MÙA GIẢI (teams in season)
CREATE TABLE IF NOT EXISTS doi_bong_tham_du_mua_giai (
    id VARCHAR(150) PRIMARY KEY,
    mua_giai_id VARCHAR(100) NOT NULL REFERENCES mua_giai(id) ON DELETE CASCADE,
    doi_bong_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id) ON DELETE CASCADE,
    bang_dau VARCHAR(20),
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mua_giai_id, doi_bong_id)
);

-- 10. BẢNG CẦU THỦ (players)
CREATE TABLE IF NOT EXISTS cau_thu (
    id VARCHAR(100) PRIMARY KEY,
    ho_va_ten VARCHAR(200) NOT NULL,
    ten_goc VARCHAR(200),
    slug VARCHAR(200) UNIQUE NOT NULL,
    quoc_tich_id VARCHAR(50) REFERENCES quoc_gia(id),
    doi_bong_hien_tai_id VARCHAR(100) REFERENCES doi_bong(id),
    vi_tri VARCHAR(50) NOT NULL, -- Thu mon, Hau ve, Tien ve, Tien dao
    so_ao INT,
    ngay_sinh DATE,
    chieu_cao_cm INT,
    can_nang_kg INT,
    chan_thuan VARCHAR(20),
    anh_dai_dien TEXT,
    gia_tri_chuyen_nhuong_eur BIGINT,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 11. BẢNG TRẬN ĐẤU (matches / fixtures)
CREATE TABLE IF NOT EXISTS tran_dau (
    id VARCHAR(100) PRIMARY KEY,
    giai_dau_id VARCHAR(100) NOT NULL REFERENCES giai_dau(id),
    mua_giai_id VARCHAR(100) NOT NULL REFERENCES mua_giai(id),
    vong_dau INT DEFAULT 1,
    ten_vong_dau VARCHAR(100),
    doi_chu_nha_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id),
    doi_khach_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id),
    san_van_dong_id VARCHAR(100) REFERENCES san_van_dong(id),
    trong_tai VARCHAR(150),
    thoi_gian_bat_dau TIMESTAMPTZ NOT NULL,
    trang_thai VARCHAR(50) DEFAULT 'chua_dien_ra',
    -- Trang thai: chua_dien_ra, dang_dien_ra, nghi_giua_hiep, hiep_phu, luan_luu, da_ket_thuc, hoan, huy, tam_dung
    phut_thi_dau INT DEFAULT 0,
    ti_so_chu_nha INT DEFAULT 0,
    ti_so_doi_khach INT DEFAULT 0,
    ti_so_hiep_mot_chu_nha INT DEFAULT 0,
    ti_so_hiep_mot_doi_khach INT DEFAULT 0,
    ti_so_luan_luu_chu_nha INT,
    ti_so_luan_luu_doi_khach INT,
    ma_nha_cung_cap VARCHAR(100),
    du_lieu_nguon JSONB DEFAULT '{}'::jsonb,
    lan_dong_bo_cuoi TIMESTAMPTZ DEFAULT NOW(),
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 12. BẢNG SỰ KIỆN TRẬN ĐẤU (match events: goals, cards, substitutions)
CREATE TABLE IF NOT EXISTS su_kien_tran_dau (
    id VARCHAR(100) PRIMARY KEY,
    tran_dau_id VARCHAR(100) NOT NULL REFERENCES tran_dau(id) ON DELETE CASCADE,
    doi_bong_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id),
    cau_thu_chinh_id VARCHAR(100) REFERENCES cau_thu(id),
    cau_thu_phu_id VARCHAR(100) REFERENCES cau_thu(id), -- cau thu kien tao hoac bi thay ra
    loai_su_kien VARCHAR(50) NOT NULL, -- ban_thang, phan_luoi_nha, penalty_thanh_cong, penalty_hong, the_vang, the_do, thay_nguoi, var
    phut INT NOT NULL,
    phut_bu_gio INT DEFAULT 0,
    mo_ta TEXT,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 13. BẢNG THỐNG KÊ TRẬN ĐẤU (match statistics)
CREATE TABLE IF NOT EXISTS thong_ke_tran_dau (
    id VARCHAR(100) PRIMARY KEY,
    tran_dau_id VARCHAR(100) UNIQUE NOT NULL REFERENCES tran_dau(id) ON DELETE CASCADE,
    kiem_soat_bong_chu_nha INT DEFAULT 50,
    kiem_soat_bong_doi_khach INT DEFAULT 50,
    so_cu_dut_diem_chu_nha INT DEFAULT 0,
    so_cu_dut_diem_doi_khach INT DEFAULT 0,
    dut_diem_trung_dich_chu_nha INT DEFAULT 0,
    dut_diem_trung_dich_doi_khach INT DEFAULT 0,
    so_qua_phat_goc_chu_nha INT DEFAULT 0,
    so_qua_phat_goc_doi_khach INT DEFAULT 0,
    pham_loi_chu_nha INT DEFAULT 0,
    pham_loi_doi_khach INT DEFAULT 0,
    the_vang_chu_nha INT DEFAULT 0,
    the_vang_doi_khach INT DEFAULT 0,
    the_do_chu_nha INT DEFAULT 0,
    the_do_doi_khach INT DEFAULT 0,
    viet_vi_chu_nha INT DEFAULT 0,
    viet_vi_doi_khach INT DEFAULT 0,
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 14. BẢNG ĐỘI HÌNH TRẬN ĐẤU (lineups)
CREATE TABLE IF NOT EXISTS doi_hinh_tran_dau (
    id VARCHAR(100) PRIMARY KEY,
    tran_dau_id VARCHAR(100) NOT NULL REFERENCES tran_dau(id) ON DELETE CASCADE,
    doi_bong_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id),
    so_do_chien_thuat VARCHAR(50) DEFAULT '4-3-3',
    huan_luyen_vien VARCHAR(150),
    danh_sach_da_chinh JSONB DEFAULT '[]'::jsonb,
    danh_sach_du_bi JSONB DEFAULT '[]'::jsonb,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 15. BẢNG BẢNG XẾP HẠNG (standings)
CREATE TABLE IF NOT EXISTS bang_xep_hang (
    id VARCHAR(150) PRIMARY KEY,
    mua_giai_id VARCHAR(100) NOT NULL REFERENCES mua_giai(id) ON DELETE CASCADE,
    doi_bong_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id) ON DELETE CASCADE,
    bang_dau VARCHAR(20) DEFAULT 'chung',
    thu_hang INT NOT NULL,
    so_tran INT DEFAULT 0,
    thang INT DEFAULT 0,
    hoa INT DEFAULT 0,
    thua INT DEFAULT 0,
    ban_thang INT DEFAULT 0,
    ban_thua INT DEFAULT 0,
    hieu_so INT DEFAULT 0,
    diem INT DEFAULT 0,
    phong_do_gan_nhat VARCHAR(20) DEFAULT '-----', -- Vi du: 'WWDLD' hoac 'TTTHB'
    ghi_chu TEXT,
    lan_dong_bo_cuoi TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(mua_giai_id, doi_bong_id, bang_dau)
);

-- 16. BẢNG DANH MỤC BÀI VIẾT (article categories)
CREATE TABLE IF NOT EXISTS danh_muc_bai_viet (
    id VARCHAR(100) PRIMARY KEY,
    ten VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    mo_ta TEXT,
    thu_tu INT DEFAULT 0,
    trang_thai VARCHAR(50) DEFAULT 'hien_thi',
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- Khởi tạo danh mục mặc định chuẩn bóng đá Việt Nam
INSERT INTO danh_muc_bai_viet (id, ten, slug, mo_ta, thu_tu) VALUES
    ('tin_moi_nhat', 'Tin mới nhất', 'tin-moi-nhat', 'Cập nhật tin tức bóng đá trong nước và quốc tế 24/7', 1),
    ('bong_da_viet_nam', 'Bóng đá Việt Nam', 'bong-da-viet-nam', 'V-League, Đội tuyển quốc gia Việt Nam, U23 và các giải trong nước', 2),
    ('ngoai_hang_anh', 'Ngoại hạng Anh', 'ngoai-hang-anh', 'Premier League, tin tức các CLB Man Utd, Arsenal, Liverpool, Man City, Chelsea', 3),
    ('cup_c1_champions_league', 'Champions League', 'champions-league', 'Cúp C1 Châu Âu, bảng đấu, lịch thi đấu và kết quả kịch tính', 4),
    ('bong_da_tay_ban_nha', 'La Liga', 'la-liga', 'Bóng đá Tây Ban Nha, Real Madrid, Barcelona, Atletico Madrid', 5),
    ('bong_da_y', 'Serie A', 'serie-a', 'Bóng đá Ý, Juventus, Inter Milan, AC Milan, AS Roma', 6),
    ('bong_da_duc', 'Bundesliga', 'bundesliga', 'Bóng đá Đức, Bayern Munich, Dortmund, Leverkusen', 7),
    ('chuyen_nhuong', 'Chuyển nhượng', 'chuyen-nhuong', 'Tin tức chuyển nhượng cầu thủ mùa hè và mùa đông uy tín', 8),
    ('phan_tich_chien_thuat', 'Phân tích chiến thuật', 'phan-tich-chien-thuat', 'Mổ xẻ sơ đồ chiến thuật, lối chơi và hiệu suất cầu thủ', 9),
    ('nhan_dinh_du_doan', 'Nhận định trận đấu', 'nhan-dinh-du-doan', 'Nhận định trước trận, phân tích phong độ và tỷ lệ cơ hội', 10)
ON CONFLICT (id) DO NOTHING;

-- 17. BẢNG THẺ BÀI VIẾT (article tags)
CREATE TABLE IF NOT EXISTS the_bai_viet (
    id VARCHAR(100) PRIMARY KEY,
    ten VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 18. BẢNG BÀI VIẾT (articles / news)
CREATE TABLE IF NOT EXISTS bai_viet (
    id VARCHAR(100) PRIMARY KEY,
    tieu_de VARCHAR(300) NOT NULL,
    slug VARCHAR(350) UNIQUE NOT NULL,
    mo_ta_ngan TEXT NOT NULL,
    noi_dung TEXT NOT NULL,
    anh_dai_dien TEXT,
    tac_gia VARCHAR(150) NOT NULL DEFAULT 'Ban Biên Tập Football Hub',
    nguon_tin VARCHAR(200) DEFAULT 'Football Hub Việt Nam',
    danh_muc_id VARCHAR(100) NOT NULL REFERENCES danh_muc_bai_viet(id),
    giai_dau_lien_quan_id VARCHAR(100) REFERENCES giai_dau(id),
    doi_bong_lien_quan_id VARCHAR(100) REFERENCES doi_bong(id),
    cau_thu_lien_quan_id VARCHAR(100) REFERENCES cau_thu(id),
    noi_bat BOOLEAN DEFAULT FALSE,
    luot_xem INT DEFAULT 0,
    trang_thai VARCHAR(50) DEFAULT 'xuat_ban', -- ban_nhap, cho_duyet, xuat_ban, an
    ngay_xuat_ban TIMESTAMPTZ DEFAULT NOW(),
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    ngay_cap_nhat TIMESTAMPTZ DEFAULT NOW()
);

-- 19. BẢNG BÀI VIẾT - THẺ (article tags relation)
CREATE TABLE IF NOT EXISTS the_cua_bai_viet (
    bai_viet_id VARCHAR(100) NOT NULL REFERENCES bai_viet(id) ON DELETE CASCADE,
    the_id VARCHAR(100) NOT NULL REFERENCES the_bai_viet(id) ON DELETE CASCADE,
    PRIMARY KEY (bai_viet_id, the_id)
);

-- 20. BẢNG BÌNH LUẬN (comments)
CREATE TABLE IF NOT EXISTS binh_luan (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bai_viet_id VARCHAR(100) NOT NULL REFERENCES bai_viet(id) ON DELETE CASCADE,
    nguoi_dung_id UUID REFERENCES nguoi_dung(id) ON DELETE SET NULL,
    ten_nguoi_gui VARCHAR(150) NOT NULL,
    email_nguoi_gui VARCHAR(255),
    noi_dung TEXT NOT NULL,
    trang_thai VARCHAR(50) DEFAULT 'hien_thi', -- cho_duyet, hien_thi, bi_an, spam
    so_luot_thich INT DEFAULT 0,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 21. BẢNG ĐỘI BÓNG YÊU THÍCH (favorite clubs)
CREATE TABLE IF NOT EXISTS doi_bong_yeu_thich (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    doi_bong_id VARCHAR(100) NOT NULL REFERENCES doi_bong(id) ON DELETE CASCADE,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(nguoi_dung_id, doi_bong_id)
);

-- 22. BẢNG GIẢI ĐẤU YÊU THÍCH (favorite leagues)
CREATE TABLE IF NOT EXISTS giai_dau_yeu_thich (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    giai_dau_id VARCHAR(100) NOT NULL REFERENCES giai_dau(id) ON DELETE CASCADE,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(nguoi_dung_id, giai_dau_id)
);

-- 23. BẢNG BÀI VIẾT ĐÃ LƯU (saved articles)
CREATE TABLE IF NOT EXISTS bai_viet_da_luu (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID NOT NULL REFERENCES nguoi_dung(id) ON DELETE CASCADE,
    bai_viet_id VARCHAR(100) NOT NULL REFERENCES bai_viet(id) ON DELETE CASCADE,
    ngay_tao TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(nguoi_dung_id, bai_viet_id)
);

-- 24. BẢNG NHÀ CUNG CẤP DỮ LIỆU (data providers)
CREATE TABLE IF NOT EXISTS nha_cung_cap_du_lieu (
    id VARCHAR(50) PRIMARY KEY,
    ten VARCHAR(150) NOT NULL,
    dia_chi_api VARCHAR(255),
    loai_du_lieu VARCHAR(100),
    trang_thai VARCHAR(50) DEFAULT 'hoat_dong',
    ghi_chu TEXT,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO nha_cung_cap_du_lieu (id, ten, dia_chi_api, loai_du_lieu, trang_thai, ghi_chu) VALUES
    ('football_data_org', 'football-data.org', 'https://api.football-data.org/v4', 'lich_thi_dau_ket_qua_bxh', 'hoat_dong', 'Hỗ trợ Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League'),
    ('open_football_vleague', 'Open Football VN Feed', 'internal_feed', 'bong_da_viet_nam', 'hoat_dong', 'Nguồn dữ liệu chuyên biệt bóng đá Việt Nam và Đội tuyển quốc gia')
ON CONFLICT (id) DO NOTHING;

-- 25. BẢNG NHẬT KÝ ĐỒNG BỘ DỮ LIỆU (sync logs)
CREATE TABLE IF NOT EXISTS nhat_ky_dong_bo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nha_cung_cap_id VARCHAR(50) REFERENCES nha_cung_cap_du_lieu(id),
    loai_dong_bo VARCHAR(100) NOT NULL, -- tran_dau, bang_xep_hang, doi_bong, tin_tuc
    trang_thai VARCHAR(50) NOT NULL, -- thanh_cong, that_bai, dang_xu_ly
    so_ban_ghi_xu_ly INT DEFAULT 0,
    so_ban_ghi_moi INT DEFAULT 0,
    so_ban_ghi_cap_nhat INT DEFAULT 0,
    thoi_gian_thuc_thi_ms INT DEFAULT 0,
    thong_bao_loi TEXT,
    chi_tiet JSONB DEFAULT '{}'::jsonb,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- 26. BẢNG NHẬT KÝ QUẢN TRỊ (admin audit logs)
CREATE TABLE IF NOT EXISTS nhat_ky_quan_tri (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nguoi_dung_id UUID REFERENCES nguoi_dung(id),
    hanh_dong VARCHAR(150) NOT NULL,
    doi_tuong VARCHAR(100),
    doi_tuong_id VARCHAR(100),
    dia_chi_ip VARCHAR(50),
    du_lieu_cu JSONB,
    du_lieu_moi JSONB,
    ngay_tao TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEX TỐI ƯU HÓA TRUY VẤN
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_tran_dau_giai_dau ON tran_dau(giai_dau_id);
CREATE INDEX IF NOT EXISTS idx_tran_dau_thoi_gian ON tran_dau(thoi_gian_bat_dau);
CREATE INDEX IF NOT EXISTS idx_tran_dau_trang_thai ON tran_dau(trang_thai);
CREATE INDEX IF NOT EXISTS idx_tran_dau_doi_chu ON tran_dau(doi_chu_nha_id);
CREATE INDEX IF NOT EXISTS idx_tran_dau_doi_khach ON tran_dau(doi_khach_id);

CREATE INDEX IF NOT EXISTS idx_bai_viet_slug ON bai_viet(slug);
CREATE INDEX IF NOT EXISTS idx_bai_viet_danh_muc ON bai_viet(danh_muc_id);
CREATE INDEX IF NOT EXISTS idx_bai_viet_trang_thai_ngay ON bai_viet(trang_thai, ngay_xuat_ban DESC);
CREATE INDEX IF NOT EXISTS idx_bai_viet_noi_bat ON bai_viet(noi_bat) WHERE noi_bat = TRUE;

CREATE INDEX IF NOT EXISTS idx_bang_xep_hang_mua_giai ON bang_xep_hang(mua_giai_id, thu_hang);
CREATE INDEX IF NOT EXISTS idx_binh_luan_bai_viet ON binh_luan(bai_viet_id, ngay_tao DESC);
CREATE INDEX IF NOT EXISTS idx_nhat_ky_dong_bo_ngay ON nhat_ky_dong_bo(ngay_tao DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE nguoi_dung ENABLE ROW LEVEL SECURITY;
ALTER TABLE bai_viet ENABLE ROW LEVEL SECURITY;
ALTER TABLE binh_luan ENABLE ROW LEVEL SECURITY;
ALTER TABLE tran_dau ENABLE ROW LEVEL SECURITY;
ALTER TABLE giai_dau ENABLE ROW LEVEL SECURITY;
ALTER TABLE doi_bong ENABLE ROW LEVEL SECURITY;
ALTER TABLE bang_xep_hang ENABLE ROW LEVEL SECURITY;
ALTER TABLE doi_bong_yeu_thich ENABLE ROW LEVEL SECURITY;
ALTER TABLE bai_viet_da_luu ENABLE ROW LEVEL SECURITY;

-- 1. Cho phép công chúng đọc dữ liệu bóng đá và bài viết đã xuất bản
CREATE POLICY "Công chúng có thể xem giải đấu" ON giai_dau FOR SELECT USING (true);
CREATE POLICY "Công chúng có thể xem đội bóng" ON doi_bong FOR SELECT USING (true);
CREATE POLICY "Công chúng có thể xem trận đấu" ON tran_dau FOR SELECT USING (true);
CREATE POLICY "Công chúng có thể xem bảng xếp hạng" ON bang_xep_hang FOR SELECT USING (true);
CREATE POLICY "Công chúng có thể xem bài viết đã xuất bản" ON bai_viet FOR SELECT USING (trang_thai = 'xuat_ban');
CREATE POLICY "Công chúng có thể xem bình luận hợp lệ" ON binh_luan FOR SELECT USING (trang_thai = 'hien_thi');

-- 2. Người dùng quản lý dữ liệu cá nhân của mình
CREATE POLICY "Người dùng xem hồ sơ của mình" ON nguoi_dung FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Người dùng quản lý đội bóng yêu thích" ON doi_bong_yeu_thich FOR ALL USING (auth.uid() = nguoi_dung_id);
CREATE POLICY "Người dùng quản lý bài viết đã lưu" ON bai_viet_da_luu FOR ALL USING (auth.uid() = nguoi_dung_id);
