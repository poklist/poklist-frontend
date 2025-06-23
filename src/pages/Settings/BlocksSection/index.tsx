import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { activateI18n } from '@/components/Language/useLanguage';
import { DrawerIds } from '@/constants/Drawer';
import { ExternalLinks } from '@/constants/externalLink';
import { Language, LocalStorageKey, Location } from '@/enums/index.enum';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import { ILinksBlock, UrlString } from '@/types/Settings';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ButtonRadioGroup } from '../ButtonRadioGroup';
import LinksBlock from './LinksBlock';

const BlocksSection: React.FC = () => {
  const navigateTo = useStrictNavigationAdapter();
  const { openDrawer } = useDrawer();
  const { isLoggedIn, logout } = useAuthStore();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  const [language, setLanguage] = useState(Language.EN);
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
      {
        label: 'English',
        value: Language.EN,
      },
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
        <h3 className="text-[17px] font-bold">
          <Trans>Select your language!</Trans>
        </h3>
        <p className="mt-1 text-[15px]">
          <Trans>Your preferred language for a better experience.</Trans>
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
        label: t`Taiwan`,
        value: Location.TW,
      },
      {
        label: t`United States`,
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
        <h3 className="text-[17px] font-bold">
          <Trans>Select your location!</Trans>
        </h3>
        <p className="mt-1 text-[15px]">
          <Trans>Your location for a personalized experience.</Trans>
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
      title: t`Preference`,
      actionItems: [
        {
          decription: t`Select your preferred language`,
          action: openLanguageDrawer,
        },
        {
          decription: t`Select your location`,
          action: openLocactionDrawer,
        },
      ],
    },
    {
      title: t`About Relist`,
      actionItems: [
        {
          decription: t`Quick start guide`,
          link: ExternalLinks.TUTORIALS as UrlString,
        },
        {
          decription: t`Check out Relist`,
          link: ExternalLinks.INSTAGRAM as UrlString,
        },
        {
          decription: t`Follow Relist Threads`,
          link: ExternalLinks.THREADS as UrlString,
        },
        {
          decription: t`Join Relist Discord`,
          link: ExternalLinks.DISCORD as UrlString,
        },
        {
          decription: t`Submit feedback or report content`,
          link: ExternalLinks.FEEDBACK as UrlString,
        },
      ],
    },
    {
      title: t`Others`,
      actionItems: [
        {
          decription: t`About Privacy Policy and Terms of Use`,
          link: ExternalLinks.PRIVACY as UrlString,
        },
        {
          decription: t`Contact us`,
          link: ExternalLinks.CONTACT_US as UrlString,
        },
      ],
    },
  ];

  const signInBlock: ILinksBlock = {
    title: t`Sign In`,
    actionItems: [],
  };

  if (isLoggedIn) {
    signInBlock.actionItems = [
      {
        decription: t`Delete Account`,
        action: () => {
          // TODO: open external link
        },
      },
      {
        decription: t`Sign Out`,
        action: () => {
          logout();
          navigateTo.home();
        },
      },
    ];
  } else {
    signInBlock.actionItems = [
      {
        decription: t`Sign In`,
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
        className="mb-16 flex flex-col gap-10 px-4 py-4 text-[15px] sm:mb-0"
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
