import { msg } from '@lingui/macro';

export const EntityNameI18n: Record<string, { id: string }> = {
  LIST: msg`名單`,
  IDEA: msg`靈感`,
};

export const StatusErrorMessageI18n: Record<number, { id: string }> = {
  401: msg`登入已失效了，請重新登入`,
  403: msg`你目前沒有權限查看`,
  400: msg`資料可能有缺誤，請再確認`,
  404: msg`哇～找不到這個內容了！`,
  408: msg`連線逾時了，請再試一次`,
  429: msg`操作太快了，請稍後再試`,
  500: msg`系統出了狀況，請稍後再試`,
  502: msg`系統出了狀況，請稍後再試`,
  503: msg`系統維護中，請稍後再試`,
  504: msg`伺服器等太久了，請稍後再試`,
};
