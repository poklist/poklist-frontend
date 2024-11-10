import DropdownComponent from '@/components/ui/Dropdown';
import { Language, LocalStorageKey } from '@/enums/index.enum';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { i18n } from '@lingui/core';
import { I18nProvider, useLingui } from '@lingui/react';
import { Fragment, useEffect, useState } from 'react';

export async function activateI18n(locale: Language) {
  const { messages } = await import(`../locales/${locale}/messages.ts`);
  i18n.load(locale, messages);
  i18n.activate(locale);
}

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

export const LanguageProvider = ({ children }: { children?: React.ReactNode }) => {
  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(LocalStorageKey.SELECTED_LANGUAGE);
    if (userSelectedLanguage && Object.values(Language).includes(userSelectedLanguage)) {
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

const i18nOptions = [
  { label: 'English', value: Language.EN },
  { label: '繁體中文', value: Language.ZH_TW },
];
const atSelectedLanguage = (value: Language) => {
  activateI18n(value);
  setLocalStorage(LocalStorageKey.SELECTED_LANGUAGE, value);
};
export const LanguageSelector: React.FC = () => {
  const [language, setLanguage] = useState(Language.EN);
  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(LocalStorageKey.SELECTED_LANGUAGE);
    console.log(userSelectedLanguage);
    if (userSelectedLanguage && Object.values(Language).includes(userSelectedLanguage)) {
      setLanguage(userSelectedLanguage);
    }
    // Activate the default locale on page load
  }, []);
  return (
    <DropdownComponent
      options={i18nOptions}
      defaultValue={language}
      onSelect={value => atSelectedLanguage(value as Language)}
      trigger={<>...</>}
    />
  );
};
