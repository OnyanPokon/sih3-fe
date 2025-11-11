/* eslint-disable no-unused-vars */
import { Articles } from '@/models';
import api from '@/utils/api';

export default class ArticlesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Articles[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/artikel', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const artikel = apiData?.artikel ?? apiData?.data ?? apiData ?? [];
        return Articles.fromApiData(artikel);
      }
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: News[];
   * }>}
   * */
  static getAllInLanding({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/landing/artikel', {
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const artikel = apiData?.artikel ?? apiData?.data ?? apiData ?? [];
        return Articles.fromApiData(artikel);
      }
    };
  }

  static async getBySlug({ slug, token }) {
    const response = await api.get(`/landing/artikel/${slug}`, token ? { token } : {});
    if (!response.data) return response;
    return { ...response, data: Articles.fromApiData(response.data) };
  }

  static async store(data, token) {
    const apiData = Articles.toApiData(data);

    const formData = new FormData();

    formData.append('kategori_id', String(apiData.kategori_id));
    formData.append('judul', apiData.judul);
    formData.append('konten', apiData.konten);
    formData.append('kuesioner_tambahan', String(apiData.kuesioner_tambahan));

    if (Array.isArray(data.thumbnails)) {
      data.thumbnails.forEach((file) => {
        formData.append('thumbnails[]', file);
      });
    }

    if (Array.isArray(data.doc)) {
      data.doc.forEach((file) => {
        formData.append('dokumen[]', file);
      });
    }

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/artikel`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const json = await res.json();

    return {
      code: json.code ?? res.status,
      status: json.status ?? res.ok,
      message: json.message ?? 'Unknown error',
      data: json.data ?? null
    };
  }

  static async update({ id, data, token }) {
    const apiData = Articles.toApiData(data);
    const formData = new FormData();

    formData.append('_method', 'PUT');
    formData.append('kategori_id', String(apiData.kategori_id));
    formData.append('judul', apiData.judul);
    formData.append('konten', apiData.konten);
    formData.append('kuesioner_tambahan', String(apiData.kuesioner_tambahan));

    // === FILES LAMA + BARU ===
    apiData.thumbnails.forEach((file) => {
      formData.append('thumbnails[]', file.thumbnail);
    });

    apiData.dokumen?.forEach((file) => {
      formData.append('dokumen[]', file.doc);
    });

    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/artikel/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const json = await res.json();

    return {
      code: json.code ?? res.status,
      status: json.status ?? res.ok,
      message: json.message ?? 'Unknown error',
      data: json.data ?? null
    };
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async delete(id, token) {
    return await api.delete(`/artikel/${id}`, { token });
  }

  /**
   * @param {number[]} ids
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async deleteBatch(ids, token) {
    return await api.delete(`/artikel/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
