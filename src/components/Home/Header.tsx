import { Button } from '@/components/ui/button';
import { SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import headerLogo from '@/assets/images/header-poklist.svg';

interface HeaderProps {
  isScrolled: boolean;
  onSignInClick: () => void;
}

export const Header = ({ isScrolled, onSignInClick }: HeaderProps) => (
  <header
    className={`fixed top-0 z-50 w-full transition-all duration-300 ${
      isScrolled ? 'bg-transparent backdrop-blur-sm' : 'bg-transparent'
    }`}
  >
    <div className="mx-auto flex items-center justify-between px-4 py-2">
      <Link to="/home">
        <img src={headerLogo} alt="Poklist" className="h-8" />
      </Link>
      <div className="flex items-center gap-4">
        <Button
          variant="white"
          onClick={onSignInClick}
          className="text-black hover:text-gray-700"
        >
          Sign in
        </Button>
        <Button variant="gray" size="icon" className="rounded-full">
          <SettingsIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  </header>
);
