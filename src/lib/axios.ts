import axios from 'axios';

import { LocalStorageKey } from '@/enums/index.enum';
import { removeLocalStorage } from '@/lib/utils';
import authStore from '@/stores/useAuthStore';
import commonStore from '@/stores/useCommonStore';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use(
  async function (config) {
    // 從 localStorage 取得 token
    const { accessToken } = authStore.getState();
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    const { setShowingAlert } = commonStore.getState();
    console.error(error);
    setShowingAlert(true, {
      message: error,
    });
    removeLocalStorage(LocalStorageKey.USER_INFO);
    window.location.href = '/';
    return Promise.reject(error);
  }
);

export default instance;

export interface AxiosPayload {
  params?: Record<string, any>;
  data?: any;
}
