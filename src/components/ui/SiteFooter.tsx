import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

import logo from '@/assets/images/logo.png';
import NotificationIcon from '@/components/ui/icons/NotificationIcon';
import IonAdd from './icons/AddIcon';

interface SiteFooterProps {
  floatingBtnTxts: string[];
}

export default function SiteFooter({ floatingBtnTxts }: SiteFooterProps) {
  return (
    <>
      <div
        id="floating-btns"
        className="fixed bottom-16 right-0 flex w-full justify-center gap-2"
      >
        <Button type="button" className="rounded-full">
          {'<'}
        </Button>
        {floatingBtnTxts.map((txt) => (
          <Button key={txt} type="button" className="rounded-full">
            {txt}
          </Button>
        ))}
      </div>
      <footer className="fixed bottom-0 right-0 flex h-14 w-full items-center justify-between border-t border-gray-600 px-6">
        <Link className="flex items-center gap-2" to="/home">
          <img src={logo} alt="logo" className="w-20" />
        </Link>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span>
              <IonAdd className="h-5 w-5" />
            </span>
            <Link to="/create">
              <span className="font-inter text-xs font-semibold">新增名單</span>
            </Link>
          </div>
          <NotificationIcon className="h-5 w-5" />
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              width="24px"
              height="24px"
            />
            <AvatarFallback>Profile</AvatarFallback>
          </Avatar>
        </div>
      </footer>
    </>
  );
}
