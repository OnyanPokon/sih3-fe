/* eslint-disable no-unused-vars */
import { TelemetryCoordinates } from '@/models';
import api from '@/utils/api';

export default class TelemetryCoordinatesService {
  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: TelemetryCoordinates[];
   * }>}
   * */
  static getAll({ token, ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/koordinat-telemetri', {
      token,
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const telemetryCoordinatesService = apiData?.telemetryCoordinatesService ?? apiData?.data ?? apiData ?? [];
        return TelemetryCoordinates.fromApiData(telemetryCoordinatesService);
      }
    };
  }

  /**
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  data?: TelemetryCoordinates[];
   * }>}
   * */
  static getAllInLanding({ ...filters }) {
    const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined && v !== ''));
    const abortController = new AbortController();
    const response = api.get('/landing/koordinat-telemetri', {
      signal: abortController.signal,
      params
    });

    return {
      abortController,
      response,
      parser: (apiData) => {
        const telemetryCoordinatesService = apiData?.telemetryCoordinatesService ?? apiData?.data ?? apiData ?? [];
        return TelemetryCoordinates.fromApiData(telemetryCoordinatesService);
      }
    };
  }

  /**
   * @param {TelemetryCoordinates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }}
   */
  static async store(data, token) {
    return await api.post('/koordinat-telemetri', { body: TelemetryCoordinates.toApiData(data), token });
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
    return await api.post('/koordinat-telemetri/import', { body: data, token, file: { file: file } });
  }

  /**
   * @param {number} id
   * @param {TelemetryCoordinates} data
   * @param {string} token
   * @returns {Promise<{
   *  code: HTTPStatusCode;
   *  status: boolean;
   *  message: string;
   *  errors?: { [key: string]: string[] };
   * }>}
   */
  static async update(id, data, token) {
    return await api.post(`/koordinat-telemetri/${id}`, { body: TelemetryCoordinates.toApiData(data), token });
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
    return await api.delete(`/koordinat-telemetri/${id}`, { token });
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
    return await api.delete(`/koordinat-telemetri/multi-delete/?id=${ids.join(',')}`, { token });
  }
}
