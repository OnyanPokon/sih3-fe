/* eslint-disable no-unused-vars */
import { Personils, Profiles } from '@/models';
import api from '@/utils/api';

export default class PersonilsService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: Personils[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/personil', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const personilsService = apiData?.personilsService ?? apiData?.data ?? apiData ?? [];
        return Personils.fromApiData(personilsService);
      }
    };
  }

  static async getById(id, token) {
    const response = await api.get(`/personil/${id}`, token ? { token } : {});
    if (!response.data) return response;
    return { ...response, data: Personils.fromApiData(response.data) };
  }

  /**
   * @param {Personils} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/personil', { body: Personils.toApiData(data), token });
  }

  /**
   * @param {number} id
   * @param {Personils} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.put(`/personil/${id}`, { body: Personils.toApiData(data), token });
  }

  static async updateProfile(id, data, token) {
    return await api.put(`/personil/update-profil/${id}`, { body: Profiles.toApiDataProfileUpdate(data), token });
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
    return await api.delete(`/personil/${id}`, { token });
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
    return await api.delete(`/personil/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
