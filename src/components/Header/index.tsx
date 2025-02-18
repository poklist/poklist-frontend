import headerPoklist from '@/assets/images/header-poklist.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import IconSetting from '@/components/ui/icons/SettingIcon';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Header: React.FC = () => {
  const { userCode } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user: me } = useUserStore();
  const isMyPage = userCode === me.userCode;

  return (
    <header className="flex h-14 items-center justify-between px-4 text-t1 font-semibold">
      <div id="header-left" className="flex items-center justify-center gap-4">
        <img
          src={headerPoklist}
          alt="Poklist"
          onClick={() => navigate('/home')}
        />
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

export default Header;
