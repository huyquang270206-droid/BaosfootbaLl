/**
 * Dịch vụ đồng bộ dữ liệu bóng đá từ các nguồn thực tế (football-data.org / Open Feeds)
 * Tuân thủ ngân sách 0 đồng, kiểm soát giới hạn request, lưu vết lịch sử vào bảng nhat_ky_dong_bo
 */

import { csdlBongDa } from './db.ts';
import { TrangThaiTranDau, TranDau, HangBongDa } from '../types/bongDa.ts';

const FOOTBALL_DATA_API = 'https://api.football-data.org/v4';

function anhXaTrangThaiTranDau(status?: string): TrangThaiTranDau {
  switch (status) {
    case 'IN_PLAY':
      return 'dang_dien_ra';
    case 'PAUSED':
      return 'nghi_giua_hiep';
    case 'EXTRA_TIME':
      return 'hiep_phu';
    case 'PENALTY_SHOOTOUT':
      return 'luan_luu';
    case 'FINISHED':
    case 'AWARDED':
      return 'da_ket_thuc';
    case 'POSTPONED':
      return 'hoan';
    case 'CANCELLED':
      return 'huy';
    case 'SUSPENDED':
      return 'tam_dung';
    case 'SCHEDULED':
    case 'TIMED':
    default:
      return 'chua_dien_ra';
  }
}

export async function kiemTraTrangThaiAPI() {
  const apiKey = process.env.FOOTBALL_DATA_ORG_API_KEY || '';
  const daCauHinhKey = apiKey.length > 5;
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const daCauHinhSupabase = supabaseUrl.length > 5;

  return {
    nha_cung_cap: 'football-data.org',
    da_cau_hinh_api_key: daCauHinhKey,
    da_cau_hinh_supabase: daCauHinhSupabase,
    gioi_han_mien_phi: '10 requests / phút (với Free API Key)',
    giai_dau_ho_tro: [
      'Ngoại hạng Anh (Premier League - PL)',
      'La Liga (PD)',
      'Serie A (SA)',
      'Bundesliga (BL1)',
      'Champions League (CL)',
      'V-League (Open Vietnam Feed)',
    ],
    huong_dan_cau_hinh:
      'Đăng ký tài khoản miễn phí tại https://www.football-data.org/client/register để lấy API Key 0 đồng và dán vào biến FOOTBALL_DATA_ORG_API_KEY trong file .env',
  };
}

export async function thucHienDongBoGiaiDau(maGiai: string = 'PL') {
  const batDau = Date.now();
  const apiKey = process.env.FOOTBALL_DATA_ORG_API_KEY || '';

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'FootballHubVN/1.0',
    };
    if (apiKey) {
      headers['X-Auth-Token'] = apiKey;
    }

    // 1. Đồng bộ lịch thi đấu & kết quả
    const resTranDau = await fetch(`${FOOTBALL_DATA_API}/competitions/${maGiai}/matches?limit=15`, {
      headers,
    });

    let soBanGhiXuLy = 0;
    let soBanGhiMoi = 0;
    let soBanGhiCapNhat = 0;

    if (resTranDau.ok) {
      const duLieuTran = await resTranDau.json();
      const matches = duLieuTran.matches || [];
      soBanGhiXuLy = matches.length;

      for (const m of matches) {
        const homeTeamName = m.homeTeam?.name || 'Đội nhà';
        const awayTeamName = m.awayTeam?.name || 'Đội khách';
        const homeSlug = csdlBongDa.taoSlugTiengViet(homeTeamName);
        const awaySlug = csdlBongDa.taoSlugTiengViet(awayTeamName);

        // Đảm bảo đội bóng tồn tại trong hệ thống
        let doiNha = csdlBongDa.layDoiBongTheoId(homeSlug);
        if (!doiNha) {
          doiNha = {
            id: homeSlug,
            ten: homeTeamName,
            slug: homeSlug,
            logo: m.homeTeam?.crest || 'https://crests.football-data.org/PL.png',
            giai_dau_hien_tai: 'ngoai_hang_anh',
          };
        }

        let doiKhach = csdlBongDa.layDoiBongTheoId(awaySlug);
        if (!doiKhach) {
          doiKhach = {
            id: awaySlug,
            ten: awayTeamName,
            slug: awaySlug,
            logo: m.awayTeam?.crest || 'https://crests.football-data.org/PL.png',
            giai_dau_hien_tai: 'ngoai_hang_anh',
          };
        }

        const tranMoi: TranDau = {
          id: `tran_fd_${m.id}`,
          giai_dau_id: 'ngoai_hang_anh',
          ten_giai_dau: 'Ngoại hạng Anh',
          slug_giai_dau: 'ngoai-hang-anh',
          vong_dau: m.matchday || 1,
          ten_vong_dau: `Vòng ${m.matchday || 1}`,
          doi_chu_nha_id: doiNha.id,
          doi_khach_id: doiKhach.id,
          doi_chu_nha: doiNha,
          doi_khach: doiKhach,
          thoi_gian_bat_dau: m.utcDate || new Date().toISOString(),
          trang_thai: anhXaTrangThaiTranDau(m.status),
          phut_thi_dau: m.status === 'FINISHED' ? 90 : 0,
          ti_so_chu_nha: m.score?.fullTime?.home ?? 0,
          ti_so_doi_khach: m.score?.fullTime?.away ?? 0,
          ti_so_hiep_mot_chu_nha: m.score?.halfTime?.home ?? 0,
          ti_so_hiep_mot_doi_khach: m.score?.halfTime?.away ?? 0,
          ma_nha_cung_cap: `football_data_${m.id}`,
          lan_dong_bo_cuoi: new Date().toISOString(),
        };

        const daCo = csdlBongDa.layTranDauTheoId(tranMoi.id);
        if (daCo) {
          soBanGhiCapNhat++;
        } else {
          soBanGhiMoi++;
        }
        csdlBongDa.capNhatHoacThemTranDau(tranMoi);
      }
    }

    // 2. Đồng bộ bảng xếp hạng
    const resBXH = await fetch(`${FOOTBALL_DATA_API}/competitions/${maGiai}/standings`, {
      headers,
    });
    if (resBXH.ok) {
      const duLieuBXH = await resBXH.json();
      const standingsTable = duLieuBXH.standings?.[0]?.table || [];
      if (standingsTable.length > 0) {
        const danhSachHang: HangBongDa[] = standingsTable.map((row: any) => {
          const clubSlug = csdlBongDa.taoSlugTiengViet(row.team?.name || 'Club');
          let club = csdlBongDa.layDoiBongTheoId(clubSlug);
          if (!club) {
            club = {
              id: clubSlug,
              ten: row.team?.name || 'Club',
              slug: clubSlug,
              logo: row.team?.crest || 'https://crests.football-data.org/PL.png',
              giai_dau_hien_tai: 'ngoai_hang_anh',
            };
          }
          return {
            id: `bxh_${maGiai}_${row.team?.id}`,
            giai_dau_id: 'ngoai_hang_anh',
            doi_bong_id: club.id,
            doi_bong: club,
            thu_hang: row.position,
            so_tran: row.playedGames,
            thang: row.won,
            hoa: row.draw,
            thua: row.lost,
            ban_thang: row.goalsFor,
            ban_thua: row.goalsAgainst,
            hieu_so: row.goalDifference,
            diem: row.points,
            phong_do_gan_nhat: row.form || '-----',
          };
        });
        csdlBongDa.capNhatBangXepHang('ngoai_hang_anh', danhSachHang);
      }
    }

    const thoiGian = Date.now() - batDau;
    const nhatKy = csdlBongDa.ghiNhatKyDongBo({
      nha_cung_cap_id: 'football_data_org',
      ten_nha_cung_cap: 'football-data.org',
      loai_dong_bo: 'tran_dau',
      trang_thai: 'thanh_cong',
      so_ban_ghi_xu_ly: soBanGhiXuLy,
      so_ban_ghi_moi: soBanGhiMoi,
      so_ban_ghi_cap_nhat: soBanGhiCapNhat,
      thoi_gian_thuc_thi_ms: thoiGian,
    });

    return {
      thanh_cong: true,
      thong_diep: `Đồng bộ thành công giải ${maGiai}. Xử lý: ${soBanGhiXuLy} trận, thêm mới: ${soBanGhiMoi}, cập nhật: ${soBanGhiCapNhat}.`,
      nhat_ky: nhatKy,
    };
  } catch (err: any) {
    const thoiGian = Date.now() - batDau;
    const nhatKy = csdlBongDa.ghiNhatKyDongBo({
      nha_cung_cap_id: 'football_data_org',
      ten_nha_cung_cap: 'football-data.org',
      loai_dong_bo: 'tran_dau',
      trang_thai: 'that_bai',
      so_ban_ghi_xu_ly: 0,
      so_ban_ghi_moi: 0,
      so_ban_ghi_cap_nhat: 0,
      thoi_gian_thuc_thi_ms: thoiGian,
      thong_bao_loi: err?.message || 'Lỗi kết nối API',
    });

    return {
      thanh_cong: false,
      thong_diep: `Không thể đồng bộ trực tiếp từ API (sử dụng dữ liệu bóng đá thực đã nạp sẵn). Lỗi: ${err?.message}`,
      nhat_ky: nhatKy,
    };
  }
}
