import axios from 'axios';

import { env } from '../../config/env';
import { setupApiInterceptors } from './interceptors';

const REQUEST_TIMEOUT_MS = 15000;

export { getAuthToken } from './interceptors';
export type { ApiErrorPayload } from './interceptors';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: REQUEST_TIMEOUT_MS,
});

setupApiInterceptors(apiClient);

export default apiClient;
