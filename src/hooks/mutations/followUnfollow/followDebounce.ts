import { FollowTarget } from '@/hooks/mutations/followUnfollow/schema';

const debounceMap = new Map<
  FollowTarget['userCode'],
  ReturnType<typeof setTimeout>
>();

const debounceKey = (userCode: FollowTarget['userCode']) =>
  `follow-${userCode}`;

export const scheduleFollowAction = (
  userCode: FollowTarget['userCode'],
  delayMs: number,
  action: () => void
): void => {
  const key = debounceKey(userCode);
  clearTimeout(debounceMap.get(key));
  const timer = setTimeout(() => {
    debounceMap.delete(key);
    action();
  }, delayMs);
  debounceMap.set(key, timer);
};

export const cancelFollowAction = (
  userCode: FollowTarget['userCode']
): void => {
  const key = debounceKey(userCode);
  const timer = debounceMap.get(key);
  if (timer) {
    clearTimeout(timer);
    debounceMap.delete(key);
  }
};
