import { i18n } from '@lingui/core';

import { Language } from '@/enums/index.enum';
import { Messages } from '@lingui/core';

/**
 * Activates a specific language in the application
 *
 * This asynchronously loads the messages for the specified locale
 * and then activates the language in the i18n system.
 *
 * @param locale - The language code to activate
 */
export async function activateI18n(locale: Language) {
  const { messages } = (await import(
    `../../locales/${locale}/messages.ts`
  )) as {
    messages: Messages;
  };
  i18n.load(locale, messages);
  i18n.activate(locale);
}
