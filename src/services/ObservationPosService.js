/* eslint-disable no-unused-vars */
import { ObservationPos } from '@/models';
import api from '@/utils/api';

export default class ObservationPosService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: ObservationPos[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/pos-pengamatan', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const pos_pengamatan = apiData?.pos_pengamatan ?? apiData?.data ?? apiData ?? [];
        return ObservationPos.fromApiData(pos_pengamatan);
      }
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PosTypes[];
   * }>}
   * */
  static getAllInLanding({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/landing/pos-pengamatan', {
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const observationPos = apiData?.observationPos ?? apiData?.data ?? apiData ?? [];
        return ObservationPos.fromApiData(observationPos);
      }
    };
  }

  /**
   * @param {ObservationPos} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/pos-pengamatan', { body: ObservationPos.toApiData(data), token });
  }

  /**
   * @param {ObservationPos} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async import(data, token, file) {
    return await api.post('/pos-pengamatan/import', { body: ObservationPos.toApiData(data), token, file: { file: file } });
  }

  /**
   * @param {number} id
   * @param {ObservationPos} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.patch(`/pos-pengamatan/${id}`, { body: ObservationPos.toApiData(data), token });
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
    return await api.delete(`/pos-pengamatan/${id}`, { token });
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
    return await api.delete(`/pos-pengamatan/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
