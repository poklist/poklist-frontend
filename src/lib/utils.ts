import { LocalStorageKey } from '@/enums/index.enum';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// get the value of a specific key from localStorage
export const getLocalStorage = (key: LocalStorageKey): any | undefined => {
  return JSON.parse(localStorage.getItem(key) || 'null');
};

// set the value of a specific key to localStorage
export const setLocalStorage = (key: LocalStorageKey, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// remove the value of a specific key from localStorage
export const removeLocalStorage = (key: LocalStorageKey) => {
  localStorage.removeItem(key);
};

export const urlPreview = (url: string | undefined) => {
  if (url === undefined) {
    return '';
  }
  return url.replace(/^https?:\/\//, '');
};
