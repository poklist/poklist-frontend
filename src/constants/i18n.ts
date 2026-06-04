import { msg } from '@lingui/macro';

export const EntityNameI18n: Record<string, { id: string }> = {
  LIST: msg`List`,
  IDEA: msg`Idea`,
};

export const StatusErrorMessageI18n: Record<number, { id: string }> = {
  401: msg`You’re logged out. Please log in again. `,
  403: msg`You don’t have access to this. `,
  400: msg`Oops, something’s missing. Check your info and try again. `,
  404: msg`We couldn’t find this page. `,
  408: msg`Connection took too long. Try again. `,
  429: msg`Slow down a little. Try again in a moment. `,
  500: msg`Our bad. Something went wrong. `,
  502: msg`Our bad. Something went wrong. `,
  503: msg`We’re doing a quick tune-up. Try again soon. `,
  504: msg`The server took too long. Try again later. `,
};
