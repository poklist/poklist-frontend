import axios, { AxiosError } from 'axios';

import { MessageType } from '@/enums/Style/index.enum';
import { toast } from '@/hooks/useToast';
import authStore from '@/stores/useAuthStore';

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
    console.error(error);
    toast({
      title: error.message,
      variant: MessageType.ERROR,
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
