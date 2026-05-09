import axios, { AxiosError } from 'axios';

import { MessageType } from '@/enums/Style/index.enum';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { track } from '@/lib/abortManager';
import useAuthStore from '@/stores/useAuthStore';
import { t } from '@lingui/macro';

declare module 'axios' {
  export interface AxiosRequestConfig {
    isDebug?: boolean;
  }
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL as string,
});

instance.interceptors.request.use(
  (config) => {
    if (!config.signal) {
      const controller = new AbortController();
      config.signal = controller.signal;
      const method = config.method;
      const path = config.url?.split('?')[0];
      track(controller, `${method} ${path}`);
    }
    // 從 localStorage 取得 token
    const { accessToken } = useAuthStore.getState();
    if (config.headers) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error: unknown) => {
    console.error(error);
    toast({
      title: error instanceof Error ? error.message : '發生未知錯誤',
      variant: MessageType.ERROR,
    });
    const navigateTo = useStrictNavigationAdapter();
    navigateTo.home();
    return Promise.reject(
      error instanceof Error ? error : new Error(String(error))
    );
  }
);

instance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response.status !== 200) {
      toast({
        title: `錯誤${response.status}，請聯繫客服。`,
        variant: MessageType.ERROR,
      });
    }

    return response;
  },
  async (error: AxiosError<{ response: unknown }>) => {
    // Do something with response error
    if (
      process.env.NODE_ENV !== 'production' &&
      error.name === 'CanceledError'
    ) {
      console.warn('Request cancelled: ', error.message);
    }
    if (axios.isCancel(error)) {
      if (error.config?.isDebug) {
        console.warn(`Debugging: ${error}`);
      }
      return Promise.reject(error);
    }

    console.error(error);
    toast({
      title: error.message || `錯誤${error.status}，請聯繫客服。`,
      variant: MessageType.ERROR,
    });

    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      toast({
        title: t`Please login again`,
        variant: MessageType.SUCCESS,
      });
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default instance;

export interface AxiosPayload {
  params?: Record<string, unknown>;
  data?: unknown;
}
