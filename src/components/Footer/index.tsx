import IconClose from '@/components/ui/icons/CloseIcon';

import { Button } from '@/components/ui/button';

interface IFooterProps {
  onClose: () => void;
  title: string;
}

const Footer: React.FC<IFooterProps> = ({ onClose, title }) => {
  return (
    <div className="fixed bottom-0 z-10 flex h-14 w-full items-center justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky md:max-w-mobile-max">
      <div className="flex items-center gap-2">
        <Button
          onClick={onClose}
          aria-label="Previous"
          className="h-auto rounded-full bg-inherit p-0"
        >
          <IconClose />
        </Button>
        <p className="text-[17px] font-bold">{title}</p>
      </div>
    </div>
  );
};

export default Footer;
