import z from 'zod';

const unfollowKeys = {
  all: ['unfollow'],
  mutations: () => [...unfollowKeys.all, 'mutations'],
  post: (targetUserCode: z.input<z.ZodString>) => [
    ...unfollowKeys.mutations(),
    'post',
    {
      targetUserCode,
    },
  ],
};

export default unfollowKeys;
