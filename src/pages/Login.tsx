import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import MobileContainer from '@/components/ui/containers/MobileContainer';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { User } from '@/types/User';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login, setUser } = useUserStore();

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const onSuccess = (res: any) => {
    axios
      .post('/auth/google', { idToken: res.credential })
      .then(async (res: any) => {
        login(res.data.accessToken);
        const userData = res.data.user as User;
        console.log('userData:', userData);
        setUser(userData);

        navigate(`/${userData.id}`);
      });
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
