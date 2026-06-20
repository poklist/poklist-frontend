import z from 'zod';

const followKeys = {
  all: ['follow'],
  mutations: () => [...followKeys.all, 'mutations'],
  post: (targetUserCode: z.input<z.ZodString>) => [
    ...followKeys.mutations(),
    'post',
    targetUserCode,
  ],
};

export default followKeys;
