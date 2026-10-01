import LinksBlock from '@/app/settings/_components/BlocksSection/LinksBlock';
import { ButtonRadioGroup } from '@/app/settings/_components/ButtonRadioGroup';
import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { activateI18n } from '@/components/Language/useLanguage';
import { DrawerIds } from '@/constants/Drawer';
import { ExternalLinks } from '@/constants/externalLink';
import { Language, LocalStorageKey, Location } from '@/enums/index.enum';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { ILinksBlock, UrlString } from '@/types/Settings';
import { t, Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';
import { z } from 'zod';

const BlocksSection: React.FC = () => {
  const navigateTo = useStrictNavigationAdapter();
  const { openDrawer } = useDrawer();
  const { isLoggedIn, logout } = useAuthStore();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  const [language, setLanguage] = useState(Language.ZH_TW);
  const [location, setLocation] = useState(Location.TW);

  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(
      LocalStorageKey.SELECTED_LANGUAGE,
      z.nativeEnum(Language)
    );
    const userSelectedLocation = getLocalStorage(
      LocalStorageKey.SELECTED_LOCATION,
      z.nativeEnum(Location)
    ) as Location;
    if (
      userSelectedLanguage &&
      Object.values(Language).includes(userSelectedLanguage)
    ) {
      setLanguage(userSelectedLanguage);
    }
    if (
      userSelectedLocation &&
      Object.values(Location).includes(userSelectedLocation)
    ) {
      setLocation(userSelectedLocation);
    }
  }, []);

  const openLanguageDrawer = () => {
    // FUTURE: extract to a 'constants' file
    const languageOptions = [
      // {
      //   label: 'English',
      //   value: Language.EN,
      // },
      {
        label: '中文',
        value: Language.ZH_TW,
      },
    ];
    const onLanguageChange = (value: string[]) => {
      const newLanguage = value[0] as Language;
      // TODO: error handling
      void activateI18n(newLanguage);
      setLanguage(newLanguage);
      setLocalStorage(
        LocalStorageKey.SELECTED_LANGUAGE,
        newLanguage,
        z.nativeEnum(Language)
      );
    };
    setDrawerContent(
      <>
        <h3 className="text-h2 font-bold">
          <Trans>選擇您的語言</Trans>
        </h3>
        <p className="mt-1 text-t1">
          <Trans>選擇您喜愛的語言，讓使用體驗更順暢。</Trans>
        </p>
        <div className="mb-10 mt-6">
          <ButtonRadioGroup
            initialValue={[language]}
            options={languageOptions}
            onChange={onLanguageChange}
          />
        </div>
      </>
    );
    openDrawer(DrawerIds.SETTINGS_DRAWER_ID);
  };

  const openLocactionDrawer = () => {
    const locationOptions = [
      {
        label: t`台灣`,
        value: Location.TW,
      },
      {
        label: t`美國`,
        value: Location.US,
      },
    ];
    const onLocationChange = (value: string[]) => {
      const newLocation = value[0] as Location;
      // TODO: error handling
      setLocation(newLocation);
      setLocalStorage(
        LocalStorageKey.SELECTED_LOCATION,
        newLocation,
        z.nativeEnum(Location)
      );
    };
    setDrawerContent(
      <>
        <h3 className="text-h2 font-bold">
          <Trans>選擇您的所在地</Trans>
        </h3>
        <p className="mt-1 text-t1">
          <Trans>選擇您的所在地，讓使用體驗更個人化。</Trans>
        </p>
        <div className="mb-10 mt-6">
          <ButtonRadioGroup
            initialValue={[location]}
            options={locationOptions}
            onChange={onLocationChange}
          />
        </div>
      </>
    );
    openDrawer(DrawerIds.SETTINGS_DRAWER_ID);
  };

  const blocks: ILinksBlock[] = [
    {
      title: t`偏好設定`,
      actionItems: [
        {
          decription: t`選擇您的語言`,
          action: openLanguageDrawer,
        },
        {
          decription: t`選擇您的所在地`,
          action: openLocactionDrawer,
        },
      ],
    },
    {
      title: t`關於 Relist`,
      actionItems: [
        {
          decription: t`三分鐘上手教學`,
          link: ExternalLinks.TUTORIALS as UrlString,
        },
        {
          decription: t`Relist 官網`,
          link: ExternalLinks.INSTAGRAM as UrlString,
        },
        {
          decription: t`追蹤 Relist Threads`,
          link: ExternalLinks.THREADS as UrlString,
        },
        {
          decription: t`加入 Discord 與我們一起優化 Relist`,
          link: ExternalLinks.DISCORD as UrlString,
        },
        {
          decription: t`給予意見或內容檢舉`,
          link: ExternalLinks.FEEDBACK as UrlString,
        },
      ],
    },
    {
      title: t`其他`,
      actionItems: [
        {
          decription: t`關於隱私政策與使用條款`,
          link: ExternalLinks.PRIVACY as UrlString,
        },
        {
          decription: t`聯繫我們`,
          link: ExternalLinks.CONTACT_US as UrlString,
        },
      ],
    },
  ];

  const signInBlock: ILinksBlock = {
    title: t`登入`,
    actionItems: [],
  };

  if (isLoggedIn) {
    signInBlock.actionItems = [
      {
        decription: t`刪除帳號`,
        action: () => {
          // TODO: open external link
        },
      },
      {
        decription: t`登出`,
        action: () => {
          logout();
          navigateTo.home();
        },
      },
    ];
  } else {
    signInBlock.actionItems = [
      {
        decription: t`登入`,
        action: () => {
          navigateTo.home();
        },
      },
    ];
  }
  blocks.push(signInBlock);

  return (
    <>
      <div
        id="blocks"
        className="mb-16 flex flex-col gap-10 px-4 py-4 text-t1 sm:mb-0"
      >
        {blocks.map((block) => {
          return (
            <LinksBlock
              key={block.title}
              title={block.title}
              actionItems={block.actionItems}
            />
          );
        })}
      </div>
      <DrawerComponent
        drawerId={DrawerIds.SETTINGS_DRAWER_ID}
        isShowClose={false}
        content={drawerContent}
      />
    </>
  );
};

export default BlocksSection;
