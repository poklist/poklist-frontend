import headerP from '@/assets/images/header-p.svg';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import IconLeftArrow from '@/components/ui/icons/LeftArrowIcon';
import useUserStore from '@/stores/useUserStore';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const BackToUserNav: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser: lastVisitedUser } = useUserStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-black-text-01 p-3">
      <div id="header-left" className="flex items-center justify-center gap-1">
        <img src={headerP} alt="P" />
        <div
          className="flex items-center justify-center"
          onClick={() => navigate(`/${lastVisitedUser.id}`)}
        >
          <span className="flex h-5 w-5 items-center justify-center">
            <IconLeftArrow />
          </span>
          <Avatar className="ml-1 h-6 w-6">
            <AvatarImage src={lastVisitedUser.profileImage} />
            <AvatarFallback>{lastVisitedUser.displayName?.[0]}</AvatarFallback>
          </Avatar>
          <p className="font-regular ml-2 text-[15px]">
            {lastVisitedUser.displayName}
          </p>
        </div>
      </div>
    </header>
  );
};
