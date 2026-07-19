import { PAGINATION_ALL } from '@/constants';

const baseUrl = import.meta.env.VITE_BASE_URL;
export const BASE_URL = `${baseUrl}/api`;

const controllers = {};

/**
 * @param {string} endpoint
 * @param {'GET' | 'POST' | 'PATCH' | 'DELETE'} method
 * @param {object} body
 * @param {string} token
 * @param {object} file
 * @param {AbortController} abortController
 * @returns {Promise<{
 *  code: number;
 *  status: boolean;
 *  message: string;
 *  data: any;
 * }>}
 */
async function customFetch(endpoint, method, body = {}, token, file = {}, abortController) {
  const hasFile = file && Object.keys(file).length > 0;
  const formData = new FormData();

  // 1️⃣ Tambahkan semua field body
  for (const key in body) {
    if (hasFile && key in file) continue;
    const value = body[key];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value);
      }
    }
  }

  // 2️⃣ Tangani semua kemungkinan file
  if (hasFile) {
    for (const key in file) {
      const value = file[key];
      if (!value) continue;

      // 🟢 AntD Upload: { fileList: [...] }
      if (value.fileList && Array.isArray(value.fileList)) {
        value.fileList.forEach((item) => {
          const f = item.originFileObj || item;
          if (f instanceof File) formData.append(`${key}[]`, f, f.name);
        });
      }

      // 🟢 Array of File
      else if (Array.isArray(value)) {
        value.forEach((f) => {
          const realFile = f.originFileObj || f;
          if (realFile instanceof File) formData.append(`${key}[]`, realFile, realFile.name);
        });
      }

      // 🟢 Object AntD Upload single
      else if (value.file instanceof File) {
        formData.append(key, value.file, value.file.name);
      }

      // 🟢 Single File langsung
      else if (value instanceof File) {
        formData.append(key, value, value.name);
      }
    }
  }

  // 3️⃣ Opsi fetch
  const options = {
    method,
    headers: { Authorization: token ? `Bearer ${token}` : '' }
  };

  if (hasFile) {
    options.body = formData;
  } else if (body && Object.keys(body).length > 0) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  // 4️⃣ Abort controller
  if (abortController) options.signal = abortController.signal;
  else if (controllers[endpoint]) options.signal = controllers[endpoint].signal;

  const response = await fetch(BASE_URL + endpoint, options);
  return await response.json();
}

/**
 * @param {'GET' | 'POST' | 'PATCH' | 'DELETE'} method
 * @returns {(endpoint: string, options?: {
 *  body?: object;
 *  token?: string;
 *  file?: object;
 *  page?: number;
 *  perPage?: number;
 *  params?: Record<string, string | number>;
 *  abortController?: AbortController;
 * }) => ReturnType<typeof customFetch>}
 */
function createCustomFetch(method) {
  return (endpoint, { body, token, file, page, perPage = 10, params, abortController } = {}) => {
    const cleanEndpoint = endpoint.split('?')[0];
    if (!abortController) {
      if (controllers[cleanEndpoint]) controllers[cleanEndpoint].abort();
      controllers[cleanEndpoint] = new AbortController();
    }

    // 🔍 Tambahkan query params jika ada
    const searchParams = {};
    if (params) for (const key in params) searchParams[key] = params[key];
    if (page) {
      searchParams.page = page;
      if (perPage === PAGINATION_ALL) searchParams.per_page = 'all';
      else searchParams.per_page = perPage;
    }

    const query = Object.entries(searchParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    let concatenatedEndpoint = endpoint;
    if (query) concatenatedEndpoint += endpoint.includes('?') ? '&' + query : '?' + query;

    return customFetch(concatenatedEndpoint, method, body, token, file, abortController);
  };
}

export default {
  get: createCustomFetch('GET'),
  post: createCustomFetch('POST'),
  patch: createCustomFetch('PATCH'),
  put: createCustomFetch('PUT'),
  delete: createCustomFetch('DELETE')
};
