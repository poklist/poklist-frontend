import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import MainContainer from '@/components/ui/containers/MainContainer';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
const Login = () => {
  const form = useForm();

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('login!');
    navigate('/home');
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, [navigate]);

  // const baseURL = 'http://localhost:7777';
  // const loginURL = `${baseURL}/login`;
  // const helloURL = `${baseURL}/hello`;
  /** Fetch */
  // const callHello = async () => {
  // const response = await fetch(helloURL, {
  // method: 'GET',
  // credentials: 'include',
  // });
  // console.log(response);
  // };

  // TODO:
  /** XHR */
  // const callHello = async () => {
  //   const xhr = new XMLHttpRequest();
  //   xhr.withCredentials = true;
  //   xhr.open("GET", helloURL, true);
  //   xhr.onload = () => {
  //     if (xhr.readyState === 4) {
  //       if (xhr.status === 200) {
  //         console.log(xhr.responseText);
  //       } else {
  //         console.error(xhr.statusText);
  //       }
  //     }
  //   };
  //   xhr.onerror = () => {
  //     console.error(xhr.statusText);
  //   };
  //   xhr.send(null);
  // };

  return (
    <MainContainer>
      <MainContainer>
        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 rounded-md border border-gray-300 p-12"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Login</Button>
          </form>
        </Form>
      </MainContainer>
    </MainContainer>
  );
};

export default Login;
