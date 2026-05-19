import Constants from 'expo-constants';

const DEFAULT_API_BASE_URL = 'https://gym-backend-20dr.onrender.com/api';
const DEFAULT_CALORIE_NINJAS_BASE_URL = 'https://api.calorieninjas.com/v1';
const DEFAULT_LOGMEAL_API_BASE_URL = 'https://api.logmeal.com/v2';
const DEFAULT_BASE_PATH = '/gym_mobile_app/';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const normalizeBasePath = (value: string) => {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;

  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
};

const expoExtra = Constants.expoConfig?.extra;

export const env = {
  apiBaseUrl: trimTrailingSlash(process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL),
  apiNinjasKey:
    process.env.EXPO_PUBLIC_API_NINJAS_KEY || (expoExtra?.apiNinjasKey as string | undefined),
  basePath: normalizeBasePath(process.env.EXPO_PUBLIC_BASE_PATH || DEFAULT_BASE_PATH),
  calorieNinjasBaseUrl: trimTrailingSlash(
    process.env.EXPO_PUBLIC_CALORIE_NINJAS_BASE_URL || DEFAULT_CALORIE_NINJAS_BASE_URL,
  ),
  logmealApiBaseUrl: trimTrailingSlash(
    process.env.EXPO_PUBLIC_LOGMEAL_API_BASE_URL || DEFAULT_LOGMEAL_API_BASE_URL,
  ),
  logmealApiToken: process.env.EXPO_PUBLIC_LOGMEAL_API_TOKEN,
} as const;

export type AppEnv = typeof env;
