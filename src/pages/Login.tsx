import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

import MobileContainer from '@/components/ui/containers/MobileContainer';
import axios from '@/lib/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const clientId =
    '399453774973-062qr2akh95l3lq55ea91rr0evkq2qgn.apps.googleusercontent.com';

  const onSuccess = (res: any) => {
    axios
      .post('/auth/google', { idToken: res.credential })
      .then(async (res: any) => {
        const body = await res.json();
        console.log(body.accessToken);
        localStorage.setItem('accessToken', body.accessToken);
        navigate('/home');
      });
    // fetch(`${baseUrl}/auth/google`, {
    //   method: 'POST',
    //   body: JSON.stringify({ idToken: res.credential }),
    // }).then(async (res: any) => {
    //   const body = await res.json();
    //   console.log(body.accessToken);
    //   localStorage.setItem('accessToken', body.accessToken);
    //   navigate('/home');
    // });
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
