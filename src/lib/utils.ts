import { socialLinkStarterMap } from '@/constants/User';
import { LocalStorageKey, SocialLinkType } from '@/enums/index.enum';
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

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const base64ToFile = async (base64: string) => {
  const response = await fetch(base64);
  return await response.blob().then((_blob) => {
    return new File([_blob], 'file', { type: _blob.type });
  });
};

// DEPRECATED: use line-clamp instead
export const getPreviewText = (text: string, length: number = 20) => {
  return text.slice(0, length) + (text.length > length ? '...' : '');
};

export const isValidInstagramUsername = (username: string) => {
  // Instagram 使用者名稱規則：
  // 1. 長度限制：30 個字元
  // 2. 可用字符：字母、數字、底線
  // 3. 首字元必須是字母

  const regex = /^[a-zA-Z][a-zA-Z0-9_]{0,29}$/;
  return regex.test(username);
};

export const copyHref = (appendedPath: string = '') => {
  const url = window.location.href;
  navigator.clipboard.writeText(url + appendedPath);
};

export const extractUsernameFromUrl = (
  linkType: SocialLinkType,
  url: string
) => {
  const prefix = socialLinkStarterMap[linkType];
  const index = url.indexOf(prefix);

  if (index !== -1) {
    // If found, then cut out the part starting from the found position
    return url.substring(index + prefix.length);
  } else {
    // If not found, then return the original URL
    return url;
  }
};

export const formatInput = (targetValue: string): string => {
  return targetValue.replace(/ {2,}/g, ' ').replace(/\n/g, '');
};
