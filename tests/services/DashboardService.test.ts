import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/utils/api', () => ({
  default: {
    get: vi.fn()
  }
}));

import api from '@/utils/api';
import DashboardService from '@/services/DashboardService';

const apiGet = vi.mocked(api.get);

const envelope = (data) => ({
  code: 200,
  status: true,
  message: 'ok',
  data
});

describe('DashboardService', () => {
  beforeEach(() => {
    apiGet.mockReset();
    apiGet.mockResolvedValue(envelope({}));
  });

  it('getStatistik memanggil GET /dashboard/statistik dan mengembalikan data envelope', async () => {
    const payload = {
      kategoris: [
        { slug: 'hidrologi', artikel: 4, berita: 3, pemetaan: 2, pos: 1 },
        { slug: 'hidrometeorologi', artikel: 0, berita: 0, pemetaan: 0, pos: 0 }
      ],
      total_produk_hukum: 7
    };
    apiGet.mockResolvedValueOnce(envelope(payload));

    const { response, parser } = DashboardService.getStatistik({ token: 'token-123' });

    expect(apiGet).toHaveBeenCalledWith('/dashboard/statistik', expect.objectContaining({ token: 'token-123' }));

    const awaited = await response;
    expect(awaited.data).toEqual(payload);
    expect(parser(awaited.data)).toEqual(payload);
  });

  it('getWilayahSungai memanggil endpoint yang benar', async () => {
    const payload = [{ id: 1, nama: 'WS Limboto', thumbnail: 'ws.png', artikel: 2, berita: 1, pos: 0 }];
    apiGet.mockResolvedValueOnce(envelope(payload));

    const { response, parser } = DashboardService.getWilayahSungai({ token: 'token-123' });

    expect(apiGet).toHaveBeenCalledWith('/dashboard/wilayah-sungai', expect.objectContaining({ token: 'token-123' }));

    const awaited = await response;
    expect(parser(awaited.data)).toEqual(payload);
  });

  it('getAktivitasTerbaru meneruskan per_page + params', async () => {
    apiGet.mockResolvedValueOnce(envelope([]));

    DashboardService.getAktivitasTerbaru({ token: 'token-123', per_page: 5, jenis: 'artikel' });

    expect(apiGet).toHaveBeenCalledWith(
      '/dashboard/aktivitas-terbaru',
      expect.objectContaining({
        token: 'token-123',
        params: { per_page: 5, jenis: 'artikel' }
      })
    );
  });

  it('getAktivitasTerbaru membuang filter kosong', async () => {
    apiGet.mockResolvedValueOnce(envelope([]));

    DashboardService.getAktivitasTerbaru({ token: 'token-123', per_page: 5, search: null, jenis: '' });

    expect(apiGet).toHaveBeenCalledWith('/dashboard/aktivitas-terbaru', expect.objectContaining({ params: { per_page: 5 } }));
  });

  it('getStatistikTambahan memanggil endpoint yang benar', async () => {
    const payload = {
      top_artikel: [{ judul: 'A', total_kunjungan: 10, total_unduh: 2 }],
      pos_per_jenis: [{ nama: 'AWLR', total: 3 }],
      kuesioner: { rata_rata_nilai: 4.5, jumlah_responden: 20 }
    };
    apiGet.mockResolvedValueOnce(envelope(payload));

    const { response, parser } = DashboardService.getStatistikTambahan({ token: 'token-123' });

    expect(apiGet).toHaveBeenCalledWith('/dashboard/statistik-tambahan', expect.objectContaining({ token: 'token-123' }));

    const awaited = await response;
    expect(parser(awaited.data)).toEqual(payload);
  });

  it('parser mengembalikan shape kontrak: kategoris, quick_access, top_artikel, pos_per_jenis, kuesioner', async () => {
    const payload = {
      kategoris: [],
      quick_access: { artikel: 1, berita: 2, pemetaan: 3, pos: 4 },
      top_artikel: [],
      pos_per_jenis: [],
      kuesioner: { rata_rata_nilai: 0, jumlah_responden: 0 }
    };
    apiGet.mockResolvedValueOnce(envelope(payload));

    const { response, parser } = DashboardService.getStatistikTambahan({ token: 'token-123' });
    const awaited = await response;
    const parsed = parser(awaited.data);

    expect(parsed).toHaveProperty('top_artikel');
    expect(parsed).toHaveProperty('pos_per_jenis');
    expect(parsed).toHaveProperty('kuesioner');
    expect(parsed.kuesioner).toHaveProperty('rata_rata_nilai');
    expect(parsed.kuesioner).toHaveProperty('jumlah_responden');

    apiGet.mockResolvedValueOnce(
      envelope({
        kategoris: [],
        quick_access: { artikel: 1, berita: 2, pemetaan: 3, pos: 4 }
      })
    );

    const statistik = DashboardService.getStatistik({ token: 'token-123' });
    const statistikAwaited = await statistik.response;
    expect(statistik.parser(statistikAwaited.data)).toHaveProperty('kategoris');
    expect(statistik.parser(statistikAwaited.data)).toHaveProperty('quick_access');
  });
});
