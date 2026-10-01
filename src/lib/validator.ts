import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
import { EntityNameI18n } from '@/constants/i18n';
import { MessageType } from '@/enums/Style/index.enum';
import { ErrorMessage, FormErrorDetail } from '@/types/common';
import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';

export const validateUserCode = (value: string): boolean => {
  const blacklist = ['admin', 'poklist', 'list', 'login']; // FUTURE: get from backend
  if (blacklist.includes(value)) {
    return false;
  }

  if (value.length < 1 || value.length > 30) {
    return false;
  }

  if (
    value.startsWith('.') ||
    value.startsWith('_') ||
    value.endsWith('.') ||
    value.endsWith('_')
  ) {
    return false;
  }

  return /^[a-z0-9._]+$/.test(value);
};

interface ResolveFormErrorOptions {
  entityName: string;
  titleMaxLength?: number;
  descMaxLength?: number;
}

export const resolveFormError = (
  errorKey: string,
  value: FormErrorDetail,
  options: ResolveFormErrorOptions
): ErrorMessage | null => {
  const {
    entityName,
    titleMaxLength = TITLE_MAX_LENGTH,
    descMaxLength = DESC_MAX_LENGTH,
  } = options;

  switch (errorKey) {
    case 'title': {
      if (value.type === 'too_small') {
        return {
          drawer: {
            title: t`欸，標題不能留空喔！`,
            content: t`${entityName}都需要有個標題，快填上去吧！`,
          },
        };
      }
      if (value.type === 'too_big') {
        return {
          drawer: {
            title: t`${entityName}標題字數太長啦！`,
            content: t`標題過長，請將字數縮短至 ${titleMaxLength} 個字元以內。`,
          },
        };
      }
      break;
    }

    case 'description': {
      if (value.type === 'too_big') {
        return {
          drawer: {
            title: t`標題描述內容超出限制了！`,
            content: t`字數有點爆表，請減到 ${descMaxLength} 個字元以內。`,
          },
        };
      }
      break;
    }

    case 'externalLink': {
      return {
        toast: {
          title: t`網址有誤 - 需以 https:// 開頭`,
          variant: MessageType.ERROR,
        },
      };
    }
  }

  return null;
};

export const resolveListFormError = (
  errorKey: string,
  value: FormErrorDetail
): ErrorMessage | null => {
  return resolveFormError(errorKey, value, {
    entityName: i18n._(EntityNameI18n.LIST.id),
  });
};

export const resolveIdeaFormError = (
  errorKey: string,
  value: FormErrorDetail
): ErrorMessage | null => {
  return resolveFormError(errorKey, value, {
    entityName: i18n._(EntityNameI18n.IDEA.id),
  });
};
