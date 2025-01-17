import headerPoklist from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BackToUserNav } from './BackToUserNav';

interface IHeaderProps {
  type?: 'default' | 'back-to-user' | 'only-title';
}

export const Header: React.FC<IHeaderProps> = ({
  type: headerType = 'default',
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user: me } = useUserStore();
  const isMyPage = id?.toString() === me.id.toString();

  if (headerType === 'back-to-user') {
    return <BackToUserNav />;
  }

  return (
    <header className="flex h-14 items-center justify-between px-4 text-t1 font-semibold">
      <div id="header-left" className="flex items-center justify-center gap-4">
        <img
          src={headerPoklist}
          alt="Poklist"
          onClick={() => navigate('/login') /* TEMP: */}
        />
        {/* )} */}
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
            onClick={() => navigate(`/${me.userCode}`)}
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
