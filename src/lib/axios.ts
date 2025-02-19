import axios from 'axios';

import { LocalStorageKey } from '@/enums/index.enum';
import { removeLocalStorage } from '@/lib/utils';
import commonStore from '@/stores/useCommonStore';
import userStore from '@/stores/useUserStore';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

instance.interceptors.request.use(
  async function (config) {
    // 從 localStorage 取得 token
    const { accessToken } = userStore.getState();
    config.headers.Authorization = `Bearer ${accessToken}`;
    // const storage = getLocalStorage(LocalStorageKey.USER_INFO);
    // if (storage?.state?.user?.token) {
    //   config.headers['x-user-token'] = storage.state.user.token;
    // }
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
