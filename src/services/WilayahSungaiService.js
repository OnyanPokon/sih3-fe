import { WilayahSungai } from '@/models';
import api from '@/utils/api';

export default class WilayahSungaiService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: WilayahSungai[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/wilayah-sungai', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const data = apiData?.data ?? apiData ?? [];
        return WilayahSungai.fromApiData(data);
      }
    };
  }

  /**
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: WilayahSungai[];
   * }>}
   * */
  static getAllInLanding({ ...filters } = {}) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/landing/wilayah-sungai', {
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const data = apiData?.data ?? apiData ?? [];
        return WilayahSungai.fromApiData(data);
      }
    };
  }

  /**
   * @param {WilayahSungai} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token, file) {
    return await api.post('/wilayah-sungai', { body: WilayahSungai.toApiData(data), token, file: { thumbnail: file } });
  }

  /**
   * @param {number} id
   * @param {WilayahSungai} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token, file) {
    return await api.post(`/wilayah-sungai/${id}`, { body: WilayahSungai.toApiData(data), token, file: { thumbnail: file } });
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
    return await api.delete(`/wilayah-sungai/${id}`, { token });
  }
}
