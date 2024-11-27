import headerP from '@/assets/images/header-p.svg';
import headerPoklist from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface IHeaderProps {
  isLoggedIn: boolean;
  isMyPage: boolean;
  isListPage?: boolean;
  listOwnerAvatar?: string;
  listOwnerName?: string;
}

export const Header: React.FC<IHeaderProps> = ({
  isLoggedIn,
  isMyPage,
  isListPage = false,
  listOwnerAvatar,
  listOwnerName,
}) => {
  // TODO: get isLoggedIn from store?
  const navigate = useNavigate();
  const { user } = useUserStore();

  return (
    <header className="flex h-14 items-center justify-between px-4 text-t1 font-semibold">
      <div id="header-left" className="flex items-center justify-center gap-4">
        {isListPage ? (
          <>
            <img src={headerP} alt="P" />
            <IconLeftArrow />
            <Avatar className="h-6 w-6">
              <AvatarImage src={listOwnerAvatar} />
            </Avatar>
            <span className="font-regular text-[15px]">{listOwnerName}</span>
          </>
        ) : (
          <img src={headerPoklist} alt="Poklist" />
        )}
      </div>
      <div id="header-right" className="flex items-center justify-center gap-4">
        {!isLoggedIn && (
          <Button variant={'white'} onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
        {isLoggedIn && !isMyPage ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profileImage} />
            <AvatarFallback>{user.displayName}</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant={'white'}
            size={'icon'}
            onClick={() => navigate('/settings')}
          >
            <IconSetting />
          </Button>
        )}
      </div>
    </header>
  );
};
