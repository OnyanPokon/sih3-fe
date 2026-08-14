/* eslint-disable no-unused-vars */
import api from '@/utils/api';

export default class DashboardService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: { kategoris?: { slug, artikel, berita, pemetaan, pos }[]; total_produk_hukum?: number; quick_access?: { artikel, berita, pemetaan, pos } };
   * }>}
   * */
  static getStatistik({ token }) {
    const abortController = new AbortController();
    const response = api.get('/dashboard/statistik', {
      token,
      signal: abortController.signal
    });

    return {
      abortController,
      response,
      parser: (apiData) => apiData?.data ?? apiData
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: { id, nama, thumbnail, artikel, berita, pos }[];
   * }>}
   * */
  static getWilayahSungai({ token }) {
    const abortController = new AbortController();
    const response = api.get('/dashboard/wilayah-sungai', {
      token,
      signal: abortController.signal
    });

    return {
      abortController,
      response,
      parser: (apiData) => apiData?.data ?? apiData
    };
  }

  /**
   * @param {string} token
   * @param {object} filters
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: { jenis: 'artikel'|'berita'|'pemetaan'|'produk_hukum'; judul; unor_nama; tanggal }[];
   * }>}
   * */
  static getAktivitasTerbaru({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/dashboard/aktivitas-terbaru', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => apiData?.data ?? apiData
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: { top_artikel?: { judul, total_kunjungan, total_unduh }[]; pos_per_jenis?: { nama, total }[]; kuesioner?: { rata_rata_nilai, jumlah_responden } };
   * }>}
   * */
  static getStatistikTambahan({ token }) {
    const abortController = new AbortController();
    const response = api.get('/dashboard/statistik-tambahan', {
      token,
      signal: abortController.signal
    });

    return {
      abortController,
      response,
      parser: (apiData) => apiData?.data ?? apiData
    };
  }
}
