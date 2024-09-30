import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

import MainContainer from '@/components/ui/containers/MainContainer';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import { GoogleIcon } from '@/components/ui/icons/GoogleIcon';
// import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  // const form = useForm();
  const baseUrl = 'http://localhost:7777';
  const loginUrl = `${baseUrl}/google/login`;
  const helloUrl = `${baseUrl}/hello`;

  // const onSubmit = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   fetch(loginUrl, { method: 'POST' });
  // };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  const authTest = () => {
    fetch(helloUrl, { method: 'GET', credentials: 'include' }).then((res) => {
      if (res.status === 200) {
        alert('Auth OK!');
      } else {
        alert('Auth Error!');
      }
    });
  };

  return (
    <MainContainer>
      <MobileContainer>
        <form
          action={loginUrl}
          method="post"
          className="flex flex-col gap-4 rounded-md border border-gray-300 p-12"
        >
          <Button variant={'outline'}>
            <GoogleIcon className="mr-2 h-6 w-6 rounded-full" />
            Google Login
          </Button>
        </form>
        <Button className="mt-6 bg-slate-400" onClick={authTest}>
          🧪 Auth Test
        </Button>
      </MobileContainer>
    </MainContainer>
  );
};

export default Login;
