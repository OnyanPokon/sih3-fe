/* eslint-disable no-unused-vars */
import { Profiles, Unors } from '@/models';
import api from '@/utils/api';

export default class UnorsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Unors[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/unor', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const unor = apiData?.unor ?? apiData?.data ?? apiData ?? [];
        return Unors.fromApiData(unor);
      }
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Unors[];
   * }>}
   * */
  static getAllInLanding({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/landing/unor', {
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const unor = apiData?.unor ?? apiData?.data ?? apiData ?? [];
        return Unors.fromApiData(unor);
      }
    };
  }

  /**
   * @param {Unors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/unor', { body: Unors.toApiData(data), token, file: { logo: file } });
  }

  /**
   * @param {number} id
   * @param {Unors} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/unor/${id}`, { body: Unors.toApiData(data), token, file: { logo: file } });
  }

  static async updateUnorProfile(id, data, token) {
    return await api.put(`/unor/update-profil/${id}`, { body: Profiles.toApiDataUnorUpdate(data), token });
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
    return await api.delete(`/unor/${id}`, { token });
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
    return await api.delete(`/unor/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
