import axios from '@/api/axios';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { resetIdentityCaches } from '@/lib/identity';
import useAuthStore from '@/stores/useAuthStore';
import useCommonStore from '@/stores/useCommonStore';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { t } from '@lingui/macro';
import { CredentialResponse } from '@react-oauth/google';

export interface LoginInfo {
  accessToken: string;
  user: User;
}
export const useLogin = () => {
  const { login } = useAuthStore();
  const { setMe } = useUserStore();
  const { setIsLoginDrawerOpen, setErrorDrawerMessage } = useCommonStore();
  const navigateTo = useStrictNavigateNext();

  const handleLogin = async (response: CredentialResponse) => {
    try {
      const res = await axios.post<IResponse<LoginInfo>>('/auth/google', {
        idToken: response.credential,
      });
      if (!res.data.content?.accessToken) {
        throw new Error('No access token');
      }
      localStorage.clear();
      login(res.data.content?.accessToken);
      resetIdentityCaches();
      const userData = {
        ...res.data.content?.user,
        profileImage: res.data.content.user.profileImage?.startsWith('data:')
          ? res.data.content.user.profileImage
          : '',
        listCount: res.data.content.user.listCount || 0,
      };
      setMe(userData);
      setIsLoginDrawerOpen(false);
      navigateTo.discovery();
    } catch (error) {
      console.error('Google login failed:', error);
      handleLoginError();
    }
  };

  const handleLoginError = () => {
    setIsLoginDrawerOpen(false);
    setErrorDrawerMessage({
      title: t`Right now, only invited users can log in`,
      content: t`Already got your invite? Jump in and apply now!`,
    });
  };

  return { handleLogin, handleLoginError };
};
