/**
 * Định nghĩa kiểu dữ liệu chuẩn hệ thống Football Hub Việt Nam
 * Ánh xạ 1:1 với cấu trúc bảng và trường trong cơ sở dữ liệu PostgreSQL Supabase
 */

export type TrangThaiTranDau =
  | 'chua_dien_ra'
  | 'dang_dien_ra'
  | 'nghi_giua_hiep'
  | 'hiep_phu'
  | 'luan_luu'
  | 'da_ket_thuc'
  | 'hoan'
  | 'huy'
  | 'tam_dung';

export const NHAN_TRANG_THAI_TRAN_DAU: Record<TrangThaiTranDau, string> = {
  chua_dien_ra: 'Chưa diễn ra',
  dang_dien_ra: 'Đang diễn ra',
  nghi_giua_hiep: 'Nghỉ giữa hiệp',
  hiep_phu: 'Hiệp phụ',
  luan_luu: 'Đang đá luân lưu',
  da_ket_thuc: 'Đã kết thúc',
  hoan: 'Hoãn',
  huy: 'Hủy',
  tam_dung: 'Tạm dừng',
};

export interface QuocGia {
  id: string;
  ten: string;
  ten_tieng_anh?: string;
  ma_quoc_gia?: string;
  co_quoc_gia?: string;
  chau_luc?: string;
}

export interface GiaiDau {
  id: string;
  ten: string;
  ten_tieng_anh?: string;
  slug: string;
  quoc_gia_id?: string;
  hang_dau?: string;
  loai_giai?: 'cau_lac_bo' | 'doi_tuyen_quoc_gia';
  logo?: string;
  mo_ta?: string;
  thu_tu_uu_tien: number;
  ma_nha_cung_cap?: string;
  trang_thai: string;
}

export interface SanVanDong {
  id: string;
  ten: string;
  thanh_pho?: string;
  suc_chua?: number;
  nam_khanh_thanh?: number;
  hinh_anh?: string;
}

export interface DoiBong {
  id: string;
  ten: string;
  ten_tieng_anh?: string;
  ten_viet_tat?: string;
  slug: string;
  quoc_gia_id?: string;
  san_van_dong_id?: string;
  ten_san_van_dong?: string;
  logo: string;
  mau_ao_chinh?: string;
  mau_ao_phu?: string;
  nam_thanh_lap?: number;
  website?: string;
  ma_nha_cung_cap?: string;
  giai_dau_hien_tai?: string;
}

export interface CauThu {
  id: string;
  ho_va_ten: string;
  ten_goc?: string;
  slug: string;
  quoc_tich?: string;
  doi_bong_id?: string;
  ten_doi_bong?: string;
  vi_tri: 'Thủ môn' | 'Hậu vệ' | 'Tiền vệ' | 'Tiền đạo';
  so_ao: number;
  ngay_sinh?: string;
  chieu_cao_cm?: number;
  can_nang_kg?: number;
  chan_thuan?: string;
  anh_dai_dien?: string;
  ban_thang?: number;
  kien_tao?: number;
}

export interface SuKienTranDau {
  id: string;
  tran_dau_id: string;
  doi_bong_id: string;
  ten_doi_bong?: string;
  cau_thu_chinh_id?: string;
  ten_cau_thu_chinh: string;
  cau_thu_phu_id?: string;
  ten_cau_thu_phu?: string;
  loai_su_kien:
    | 'ban_thang'
    | 'phan_luoi_nha'
    | 'penalty_thanh_cong'
    | 'penalty_hong'
    | 'the_vang'
    | 'the_do'
    | 'thay_nguoi'
    | 'var';
  phut: number;
  phut_bu_gio?: number;
  mo_ta?: string;
}

export interface ThongKeTranDau {
  id: string;
  tran_dau_id: string;
  kiem_soat_bong_chu_nha: number;
  kiem_soat_bong_doi_khach: number;
  so_cu_dut_diem_chu_nha: number;
  so_cu_dut_diem_doi_khach: number;
  dut_diem_trung_dich_chu_nha: number;
  dut_diem_trung_dich_doi_khach: number;
  so_qua_phat_goc_chu_nha: number;
  so_qua_phat_goc_doi_khach: number;
  pham_loi_chu_nha: number;
  pham_loi_doi_khach: number;
  the_vang_chu_nha: number;
  the_vang_doi_khach: number;
  the_do_chu_nha: number;
  the_do_doi_khach: number;
  viet_vi_chu_nha: number;
  viet_vi_doi_khach: number;
}

export interface DoiHinhTranDau {
  id: string;
  tran_dau_id: string;
  doi_chu_nha: {
    doi_bong_id: string;
    ten_doi_bong: string;
    so_do: string;
    huan_luyen_vien: string;
    da_chinh: Array<{ so_ao: number; ho_ten: string; vi_tri: string }>;
    du_bi: Array<{ so_ao: number; ho_ten: string; vi_tri: string }>;
  };
  doi_khach: {
    doi_bong_id: string;
    ten_doi_bong: string;
    so_do: string;
    huan_luyen_vien: string;
    da_chinh: Array<{ so_ao: number; ho_ten: string; vi_tri: string }>;
    du_bi: Array<{ so_ao: number; ho_ten: string; vi_tri: string }>;
  };
}

export interface TranDau {
  id: string;
  giai_dau_id: string;
  ten_giai_dau: string;
  slug_giai_dau: string;
  logo_giai_dau?: string;
  vong_dau: number;
  ten_vong_dau?: string;
  doi_chu_nha_id: string;
  doi_khach_id: string;
  doi_chu_nha: DoiBong;
  doi_khach: DoiBong;
  san_van_dong?: string;
  trong_tai?: string;
  thoi_gian_bat_dau: string; // ISO String
  trang_thai: TrangThaiTranDau;
  phut_thi_dau: number;
  ti_so_chu_nha: number;
  ti_so_doi_khach: number;
  ti_so_hiep_mot_chu_nha?: number;
  ti_so_hiep_mot_doi_khach?: number;
  ti_so_luan_luu_chu_nha?: number;
  ti_so_luan_luu_doi_khach?: number;
  su_kien?: SuKienTranDau[];
  thong_ke?: ThongKeTranDau;
  doi_hinh?: DoiHinhTranDau;
  ma_nha_cung_cap?: string;
  lan_dong_bo_cuoi?: string;
}

export interface HangBongDa {
  id: string;
  giai_dau_id: string;
  doi_bong_id: string;
  doi_bong: DoiBong;
  thu_hang: number;
  so_tran: number;
  thang: number;
  hoa: number;
  thua: number;
  ban_thang: number;
  ban_thua: number;
  hieu_so: number;
  diem: number;
  phong_do_gan_nhat: string; // Vi du: 'WWDLD' hoac 'TTTHB'
}

export interface DanhMucBaiViet {
  id: string;
  ten: string;
  slug: string;
  mo_ta?: string;
  thu_tu: number;
}

export interface BaiViet {
  id: string;
  tieu_de: string;
  slug: string;
  mo_ta_ngan: string;
  noi_dung: string;
  anh_dai_dien: string;
  tac_gia: string;
  nguon_tin: string;
  danh_muc_id: string;
  ten_danh_muc: string;
  giai_dau_lien_quan_id?: string;
  doi_bong_lien_quan_id?: string;
  noi_bat: boolean;
  luot_xem: number;
  trang_thai: 'ban_nhap' | 'cho_duyet' | 'xuat_ban' | 'an';
  the: string[];
  ngay_xuat_ban: string;
  ngay_cap_nhat: string;
}

export interface BinhLuan {
  id: string;
  bai_viet_id: string;
  ten_nguoi_gui: string;
  email_nguoi_gui?: string;
  noi_dung: string;
  trang_thai: 'cho_duyet' | 'hien_thi' | 'bi_an';
  so_luot_thich: number;
  ngay_tao: string;
}

export interface NhatKyDongBo {
  id: string;
  nha_cung_cap_id: string;
  ten_nha_cung_cap: string;
  loai_dong_bo: 'tran_dau' | 'bang_xep_hang' | 'doi_bong' | 'tin_tuc';
  trang_thai: 'thanh_cong' | 'that_bai' | 'dang_xu_ly';
  so_ban_ghi_xu_ly: number;
  so_ban_ghi_moi: number;
  so_ban_ghi_cap_nhat: number;
  thoi_gian_thuc_thi_ms: number;
  thong_bao_loi?: string;
  ngay_tao: string;
}

export interface NguoiDung {
  id: string;
  email: string;
  ten_hien_thi: string;
  anh_dai_dien?: string;
  vai_tro: 'quan_tri_vien' | 'bien_tap_vien' | 'doc_gia';
  doi_bong_yeu_thich_ids: string[];
  giai_dau_yeu_thich_ids: string[];
  bai_viet_da_luu_ids: string[];
}
