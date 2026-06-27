export const API_CONFIG = {
  BASE_URL: '/api',
  TIMEOUT_MS: 10000,
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
  },
} as const;

export interface ApiClientConfig {
  baseUrl: string;
  headers: HeadersInit;
  timeout: number;
}
