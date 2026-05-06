import { isAbortWhitelist } from '@/api/whitelist';

const keyMap = new Map<string, Set<AbortController>>();
const controllers = new Set<AbortController>();

export const track = (abortController: AbortController, key?: string) => {
  if (key) {
    const [method, path] = key.split(' ');
    if (isAbortWhitelist(method, path)) return;
  }
  controllers.add(abortController);
  if (!key) return;
  if (!keyMap.has(key)) keyMap.set(key, new Set());
  keyMap.get(key)!.add(abortController);
};

export const untrack = (abortController: AbortController) => {
  controllers.delete(abortController);
  keyMap.forEach((set) => set.delete(abortController));
};

export const abortAll = () => {
  controllers.forEach((controller) => controller.abort());
  controllers.clear();
};

export const abortKey = (key: string) => {
  const set = keyMap.get(key);
  if (!set) return;
  set.forEach((controller) => controller.abort());
  set.clear();
};
