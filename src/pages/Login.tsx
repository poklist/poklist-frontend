import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import MobileContainer from '@/components/ui/containers/MobileContainer';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';
import { useNavigate } from 'react-router-dom';

export interface ILoginRequest {
  idToken: string;
}

export interface LoginInfo {
  accessToken: string;
  user: User;
}

const Login = () => {
  const navigate = useNavigate();
  const { login, setUser } = useUserStore(); // FUTURE: refactor

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const onSuccess = async (result: any /* TODO: */) => {
    const res = await axios.post<IResponse<LoginInfo>>('/auth/google', {
      idToken: result.credential,
    });
    // TODO: error handling
    if (!res.data.content?.accessToken) {
      throw new Error('No access token');
    }
    login(res.data.content?.accessToken);

    const userData = res.data.content?.user;
    setUser(userData);
    navigate(`/${userData.userCode}`);
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <MobileContainer>
        <div className="flex justify-center">
          <GoogleLogin onSuccess={onSuccess} />
        </div>
      </MobileContainer>
    </GoogleOAuthProvider>
  );
};

export default Login;
