import axios from "axios";

import { LocalStorageKey } from "@/enums/index.enum";
import { getLocalStorage, removeLocalStorage } from "@/lib/utils";
import commonStore from "@/stores/useCommonStore";

const instance = axios.create({
  baseURL: ""
});

instance.interceptors.request.use(
  async function (config) {
    // 從 localStorage 取得 token
    const storage = getLocalStorage(LocalStorageKey.USER_INFO);

    if (storage?.state?.user?.token) {
      config.headers["x-user-token"] = storage.state.user.token;
    }
    return config;
  },
  error => {
    const { setShowingAlert } = commonStore.getState();
    console.error(error);
    setShowingAlert(true, {
      message: error
    });
    removeLocalStorage(LocalStorageKey.USER_INFO);
    window.location.href = "/";
    return Promise.reject(error);
  }
);

export default instance;
