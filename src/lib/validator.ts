import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
import { EntityNameI18n } from '@/constants/i18n';
import { MessageType } from '@/enums/Style/index.enum';
import { ErrorMessage, FormErrorDetail } from '@/types/common';
import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';

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
            title: t`Hey, the title can't be left empty!`,
            content: t`Every ${entityName} needs a title, so fill it in!`,
          },
        };
      }
      if (value.type === 'too_big') {
        return {
          drawer: {
            title: t`${entityName} title is too long!`,
            content: t`Please keep it under ${titleMaxLength} characters.`,
          },
        };
      }
      break;
    }

    case 'description': {
      if (value.type === 'too_big') {
        return {
          drawer: {
            title: t`Description is too long!`,
            content: t`Please keep it under ${descMaxLength} characters.`,
          },
        };
      }
      break;
    }

    case 'externalLink': {
      return {
        toast: {
          title: t`Error - Link must start with https:// `,
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
