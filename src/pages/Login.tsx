import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';

const Login = () => {
  const form = useForm();
  return (
    <Form {...form}>
      <form className="flex flex-col gap-4 rounded-md border border-gray-300 p-12">
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
  );
};

export default Login;
