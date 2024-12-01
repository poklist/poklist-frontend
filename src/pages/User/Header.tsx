import headerP from '@/assets/images/header-p.svg';
import headerPoklist from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface IHeaderProps {
  isListPage?: boolean;
  listOwnerAvatar?: string;
  listOwnerName?: string;
}

export const Header: React.FC<IHeaderProps> = ({
  isListPage = false,
  listOwnerAvatar,
  listOwnerName,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user: me } = useUserStore();
  const isMyPage = id?.toString() === me.id.toString();

  return (
    <header className="flex h-14 items-center justify-between px-4 text-t1 font-semibold">
      <div id="header-left" className="flex items-center justify-center gap-4">
        {isListPage ? (
          <>
            <img src={headerP} alt="P" />
            <IconLeftArrow />
            <Avatar className="h-6 w-6">
              <AvatarImage src={listOwnerAvatar} />
              <AvatarFallback>{listOwnerName?.[0]}</AvatarFallback>
            </Avatar>
            <span className="font-regular text-[15px]">{listOwnerName}</span>
          </>
        ) : (
          <img
            src={headerPoklist}
            alt="Poklist"
            onClick={() => navigate('/login') /* TEMP: */}
          />
        )}
      </div>
      <div id="header-right" className="flex items-center justify-center gap-4">
        {!isLoggedIn && (
          <Button variant="white" onClick={() => navigate('/login')}>
            Sign In
          </Button>
        )}
        {isLoggedIn && !isMyPage ? (
          <Avatar
            className="h-8 w-8 cursor-pointer"
            onClick={() => navigate(`/${me.id}`)}
          >
            <AvatarImage src={me.profileImage} />
            <AvatarFallback>{me.displayName[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Button
            variant="white"
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
