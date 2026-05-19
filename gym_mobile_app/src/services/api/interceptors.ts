import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import { logger } from '../../config/logger';

const AUTH_TOKEN_STORAGE_KEY = 'userToken';

export type ApiErrorPayload = {
  error?: string;
  message?: string;
};

export type ApiInterceptorIds = {
  request: number;
  response: number;
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch (error) {
    logger.warn('Unable to read auth token from storage', error);
    return null;
  }
};

export const attachAuthTokenInterceptor = (client: AxiosInstance) =>
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const token = await getAuthToken();

      if (token) {
        const headers = AxiosHeaders.from(config.headers);
        headers.set('Authorization', `Bearer ${token}`);
        config.headers = headers;
      }

      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

export const attachErrorLoggingInterceptor = (client: AxiosInstance) =>
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorPayload>) => {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || error.response?.data?.error || error.message;

      logger.error('API request failed', {
        message,
        method: error.config?.method?.toUpperCase(),
        status,
        url: error.config?.url,
      });

      return Promise.reject(error);
    },
  );

export const setupApiInterceptors = (client: AxiosInstance): ApiInterceptorIds => ({
  request: attachAuthTokenInterceptor(client),
  response: attachErrorLoggingInterceptor(client),
});
