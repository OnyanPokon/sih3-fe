/* eslint-disable no-unused-vars */
import { PosTypes } from '@/models';
import api from '@/utils/api';

export default class PosTypesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: PosTypes[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/jenis-pos', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const posTypesService = apiData?.posTypesService ?? apiData?.data ?? apiData ?? [];
        return PosTypes.fromApiData(posTypesService);
      }
    };
  }

  /**
   * @param {PosTypes} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/jenis-pos', { body: PosTypes.toApiData(data), token, file: { thumbnail: file } });
  }

  /**
   * @param {number} id
   * @param {PosTypes} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.patch(`/jenis-pos/${id}`, { body: PosTypes.toApiData(data), token, file: { thumbnail: file } });
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
    return await api.delete(`/jenis-pos/${id}`, { token });
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
    return await api.delete(`/jenis-pos/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
