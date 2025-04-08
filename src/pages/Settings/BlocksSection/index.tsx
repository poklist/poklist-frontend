import { DrawerComponent, useDrawer } from '@/components/Drawer';
import { Language, LocalStorageKey, Location } from '@/enums/index.enum';
import { activateI18n } from '@/lib/languageProvider';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import useUserStore from '@/stores/useUserStore';
import { ILinksBlock } from '@/types/Settings';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonRadioGroup } from '../ButtonRadioGroup';
import LinksBlock from './LinksBlock';
import { DrawerIds } from '@/constants/Drawer';

const BlocksSection: React.FC = () => {
  const navigate = useNavigate();
  const { openDrawer } = useDrawer(DrawerIds.SETTINGS_DRAWER_ID);
  const { isLoggedIn, logout } = useUserStore();
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>(null);

  const [language, setLanguage] = useState(Language.EN);
  const [location, setLocation] = useState(Location.TW);

  useEffect(() => {
    const userSelectedLanguage = getLocalStorage(
      LocalStorageKey.SELECTED_LANGUAGE
    );
    const userSelectedLocation = getLocalStorage(
      LocalStorageKey.SELECTED_LOCATION
    );
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
      setLocalStorage(LocalStorageKey.SELECTED_LANGUAGE, newLanguage);
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
    openDrawer();
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
      setLocalStorage(LocalStorageKey.SELECTED_LOCATION, newLocation);
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
    openDrawer();
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
      title: t`About Poklist`,
      actionItems: [
        {
          decription: t`Quick start guide`,
          // TODO:
        },
        {
          decription: t`Check out Poklist`,
          // TODO:
        },
        {
          decription: t`Follow Poklist Threads`,
          // TODO:
        },
        {
          decription: t`Join Poklist Discord`,
          link: 'https://discord.gg/Jq2hSYUFJC',
        },
        {
          decription: t`Submit feedback or report content`,
          // TODO:
        },
      ],
    },
    {
      title: t`Others`,
      actionItems: [
        {
          decription: t`About Privacy Policy and Terms of Use`,
          // TODO:
        },
        {
          decription: t`Contact us`,
          // TODO:
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
          navigate('/');
        },
      },
    ];
  } else {
    signInBlock.actionItems = [
      {
        decription: t`Sign In`,
        action: () => {
          navigate('/home');
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
