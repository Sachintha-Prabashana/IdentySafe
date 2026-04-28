import axios from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const PUBLIC_ENDPOINTS = ['/public', '/share/view'];

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://a3373fe6-1dea-407a-aca9-093e9245df44-dev.e1-us-east-azure.choreoapis.dev/default/identysafe-backend/v1.0/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

let requestInterceptor: number | null = null;
let responseInterceptor: number | null = null;

export const setupInterceptors = (getAccessToken: () => Promise<string>) => {
  if (requestInterceptor !== null) api.interceptors.request.eject(requestInterceptor);
  if (responseInterceptor !== null) api.interceptors.response.eject(responseInterceptor);

  requestInterceptor = api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url));
      const isExternal = config.url?.startsWith('http') && !config.url?.includes(window.location.hostname);

      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, { isPublic, isExternal });

      if (!isPublic && !isExternal) {
        try {
          const token = await getAccessToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("[API Request] Token retrieval failed:", error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  responseInterceptor = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized session detected.");
      }
      return Promise.reject(error);
    }
  );
};

export default api;