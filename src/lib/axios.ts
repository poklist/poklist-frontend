import axios, { AxiosError } from 'axios';

import authStore from '@/stores/useAuthStore';
import commonStore from '@/stores/useCommonStore';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
});

instance.interceptors.request.use(
  (config) => {
    // 從 localStorage 取得 token
    const { accessToken } = authStore.getState();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: AxiosError) => {
    const { setShowingAlert } = commonStore.getState();
    console.error(error);
    setShowingAlert(true, {
      message: error.message,
    });
    window.location.href = '/';
    return Promise.reject(error);
  }
);

export default instance;

export interface AxiosPayload {
  params?: Record<string, unknown>;
  data?: unknown;
}
