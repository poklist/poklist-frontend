import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import MobileContainer from '@/components/ui/containers/MobileContainer';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();

  const clientId =
    '399453774973-062qr2akh95l3lq55ea91rr0evkq2qgn.apps.googleusercontent.com';

  const onSuccess = (res: any) => {
    console.log('cred:', res.credential);
    axios
      .post('/auth/google', { idToken: res.credential })
      .then(async (res: any) => {
        login(res.data.accessToken);
        navigate('/users');
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
