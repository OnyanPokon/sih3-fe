/* eslint-disable no-unused-vars */
import { Maps } from '@/models';
import api, { BASE_URL } from '@/utils/api';

export default class MapsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Maps[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/pemetaan', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const pemetaan = apiData?.pemetaan ?? apiData?.data ?? apiData ?? [];
        return Maps.fromApiData(pemetaan);
      }
    };
  }

  static async getByKategori(page = 1, per_page = 999999) {
    const response = await api.get(`/landing/pemetaan/by-kategori`, { page: page, perPage: per_page });
    if (!response.data) return response;
    return { ...response, data: response.data };
  }

  /**
   * @param {number} id
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Maps;
   * }>}
   */
  static async getById(id, token) {
    const response = await api.get(`/pemetaan/${id}`, { token });
    if (!response.data) return response;
    return { ...response, data: Maps.fromApiData(response.data) };
  }

  /**
   * @param {Maps} data
   * @param {string} token
   * @param {File|Blob|null} [file]
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async store(data, token, file, marker) {
    const payload = {
      body: Maps.toApiData(data),
      token
    };

    if (file) {
      payload.file = { file: file };
    }

    return await api.post('/pemetaan', payload);
  }

  /**
   * @param {number} id
   * @param {Maps} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/pemetaan/${id}`, { body: Maps.toApiData(data), token, file: { file: file } });
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
    return await api.delete(`/pemetaan/${id}`, { token });
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
  /**
   * @param {number} id
   * @returns {Promise<any>}
   */
  static async getGeoJson(id) {
    const response = await fetch(`${BASE_URL}/landing/pemetaan/${id}/geojson`);
    if (!response.ok) {
      throw new Error('Gagal memuat GeoJSON');
    }
    return await response.json();
  }

  /**
   * @param {number} id
   * @param {any} geojson
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   * }>}
   */
  static async customize(id, geojson, token) {
    return await api.post(`/pemetaan/${id}/customize`, { body: { geojson }, token });
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
  static async reset(id, token) {
    return await api.post(`/pemetaan/${id}/reset`, { token });
  }
}

