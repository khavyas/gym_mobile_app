import AsyncStorage from '@react-native-async-storage/async-storage';

import { logger } from '../../config/logger';
import { apiClient } from '../api/client';

const authLogger = logger.child('auth');

const AUTH_STORAGE_KEYS = {
  token: 'userToken',
  role: 'userRole',
  name: 'userName',
  email: 'userEmail',
  userId: 'userId',
  phone: 'userPhone',
  age: 'userAge',
  weight: 'userWeight',
  gender: 'userGender',
  gymId: 'gymId',
} as const;

const AUTH_STORAGE_KEY_LIST = Object.values(AUTH_STORAGE_KEYS);

export type AuthRole = 'admin' | 'consultant' | 'super-admin' | 'superadmin' | 'user';

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type RegisterPayload = {
  age?: number;
  consent?: boolean;
  email: string;
  gender?: string;
  name: string;
  password: string;
  phone?: string;
  privacyNoticeAccepted?: boolean;
  role: string;
  weight?: number;
};

export type AuthResponse = {
  age?: number | string;
  email?: string;
  gender?: string;
  gymId?: number | string;
  name?: string;
  phone?: string;
  role?: string;
  token: string;
  userId?: number | string;
  weight?: number | string;
};

export type CurrentUser = {
  age: string | null;
  email: string | null;
  gender: string | null;
  gymId: string | null;
  name: string | null;
  phone: string | null;
  role: string | null;
  token: string | null;
  userId: string | null;
  weight: string | null;
};

const toStorageEntry = (key: string, value: unknown): [string, string] | null => {
  if (value === undefined || value === null || value === '') {
    return null;
  }

  return [key, String(value)];
};

export const persistAuthSession = async (authData: AuthResponse, fallbackRole?: string) => {
  if (!authData.token) {
    throw new Error('Cannot persist auth session without a token');
  }

  const entries = [
    toStorageEntry(AUTH_STORAGE_KEYS.token, authData.token),
    toStorageEntry(AUTH_STORAGE_KEYS.role, authData.role || fallbackRole),
    toStorageEntry(AUTH_STORAGE_KEYS.name, authData.name),
    toStorageEntry(AUTH_STORAGE_KEYS.email, authData.email),
    toStorageEntry(AUTH_STORAGE_KEYS.userId, authData.userId),
    toStorageEntry(AUTH_STORAGE_KEYS.phone, authData.phone),
    toStorageEntry(AUTH_STORAGE_KEYS.age, authData.age),
    toStorageEntry(AUTH_STORAGE_KEYS.weight, authData.weight),
    toStorageEntry(AUTH_STORAGE_KEYS.gender, authData.gender),
    toStorageEntry(AUTH_STORAGE_KEYS.gymId, authData.gymId),
  ].filter((entry): entry is [string, string] => Boolean(entry));

  await AsyncStorage.multiSet(entries);
};

export const clearAuthSession = async () => {
  await AsyncStorage.multiRemove(AUTH_STORAGE_KEY_LIST);
};

export const getCurrentUser = async (): Promise<CurrentUser> => {
  const storedValues = await AsyncStorage.multiGet(AUTH_STORAGE_KEY_LIST);
  const storage = Object.fromEntries(storedValues);

  return {
    age: storage[AUTH_STORAGE_KEYS.age] ?? null,
    email: storage[AUTH_STORAGE_KEYS.email] ?? null,
    gender: storage[AUTH_STORAGE_KEYS.gender] ?? null,
    gymId: storage[AUTH_STORAGE_KEYS.gymId] ?? null,
    name: storage[AUTH_STORAGE_KEYS.name] ?? null,
    phone: storage[AUTH_STORAGE_KEYS.phone] ?? null,
    role: storage[AUTH_STORAGE_KEYS.role] ?? null,
    token: storage[AUTH_STORAGE_KEYS.token] ?? null,
    userId: storage[AUTH_STORAGE_KEYS.userId] ?? null,
    weight: storage[AUTH_STORAGE_KEYS.weight] ?? null,
  };
};

export const validateToken = async () => {
  const token = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.token);

  return Boolean(token);
};

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);

  await persistAuthSession(response.data);
  authLogger.info('User logged in', { role: response.data.role, userId: response.data.userId });

  return response.data;
};

export const register = async (payload: RegisterPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);

  await persistAuthSession(response.data, payload.role);
  authLogger.info('User registered', { role: response.data.role || payload.role });

  return response.data;
};

export const logout = async () => {
  await clearAuthSession();
  authLogger.info('User logged out');
};

export const authService = {
  clearAuthSession,
  getCurrentUser,
  login,
  logout,
  persistAuthSession,
  register,
  validateToken,
};
