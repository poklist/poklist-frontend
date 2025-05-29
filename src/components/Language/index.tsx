import DropdownComponent from '@/components/Dropdown';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { Language, LocalStorageKey } from '@/enums/index.enum';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { i18n } from '@lingui/core';
import { I18nProvider, useLingui } from '@lingui/react';
import { Fragment, useEffect, useState } from 'react';

/**
 * Activates a specific language in the application
 *
 * This asynchronously loads the messages for the specified locale
 * and then activates the language in the i18n system.
 *
 * @param locale - The language code to activate
 */
export async function activateI18n(locale: Language) {
  const { messages } = await import(`../../locales/${locale}/messages.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

/**
 * A component that forces re-rendering when the locale changes
 *
 * This is necessary to ensure that string translations are updated
 * when the language changes.
 *
 * @internal This is an internal component not meant for direct usage
 */
const WatchLocale = ({ children }: { children: React.ReactNode }) => {
  const { i18n: lingui } = useLingui();
  // Skip render when locale isn't loaded
  if (!lingui.locale) {
    return null;
  }
  // Force re-render when locale changes.
  // Otherwise string translations (ie: t`Macro`) won't be updated.
  return <Fragment key={lingui.locale}>{children}</Fragment>;
};

/**
 * Main Language Provider component
 *
 * This component should wrap any part of your application that requires
 * internationalization. It loads the user's preferred language from localStorage
 * or defaults to English if none is found.
 *
 * @example
 * ```tsx
 * <LanguageProvider>
 *   <App />
 * </LanguageProvider>
 * ```
 */
export const LanguageProvider = ({
  children,
}: {
  children?: React.ReactNode;
}) => {
  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(
      LocalStorageKey.SELECTED_LANGUAGE
    );
    if (
      userSelectedLanguage &&
      Object.values(Language).includes(userSelectedLanguage)
    ) {
      activateI18n(userSelectedLanguage);
    } else {
      activateI18n(Language.EN);
    }
    // Activate the default locale on page load
  }, []);
  return (
    <I18nProvider key={'languageProvider'} i18n={i18n}>
      <WatchLocale>{children}</WatchLocale>
    </I18nProvider>
  );
};

// Available language options for the selectors
const i18nOptions = [
  { label: 'English', value: Language.EN },
  { label: '繁體中文', value: Language.ZH_TW },
];

/**
 * Changes the active language and stores the selection in localStorage
 *
 * @param value - The language code to activate
 */
const atSelectedLanguage = (value: Language) => {
  activateI18n(value);
  setLocalStorage(LocalStorageKey.SELECTED_LANGUAGE, value);
};

/**
 * A dropdown selector for choosing the application language
 *
 * @example
 * ```tsx
 * <LanguageSelector />
 * ```
 */
export const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState(Language.EN);

  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(
      LocalStorageKey.SELECTED_LANGUAGE
    );
    if (
      userSelectedLanguage &&
      Object.values(Language).includes(userSelectedLanguage)
    ) {
      setLanguage(userSelectedLanguage);
    }
  }, []);

  return (
    <DropdownComponent
      options={i18nOptions}
      defaultValue={language}
      onSelect={(value) => atSelectedLanguage(value as Language)}
      trigger={<>...</>}
    />
  );
};

/**
 * A simple button that toggles between available languages
 *
 * This component provides a more compact alternative to the full LanguageSelector.
 * It cycles through available languages when clicked.
 *
 * @example
 * ```tsx
 * <LanguageToggleButton />
 * ```
 */
export const LanguageToggleButton: React.FC = () => {
  const [language, setLanguage] = useState(Language.EN);

  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(
      LocalStorageKey.SELECTED_LANGUAGE
    );
    if (
      userSelectedLanguage &&
      Object.values(Language).includes(userSelectedLanguage)
    ) {
      setLanguage(userSelectedLanguage);
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === Language.EN ? Language.ZH_TW : Language.EN;
    activateI18n(newLanguage);
    setLanguage(newLanguage);
    setLocalStorage(LocalStorageKey.SELECTED_LANGUAGE, newLanguage);
  };

  return (
    <Button
      variant={ButtonVariant.GRAY}
      size={ButtonSize.SM}
      className="font-normal text-black hover:text-gray-700"
      onClick={toggleLanguage}
    >
      {language === Language.EN ? '中文' : 'Eng'}
    </Button>
  );
};
