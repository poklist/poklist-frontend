import type { ReactNode } from 'react';

interface MobileContainerProps {
  children?: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    // TODO: h-screen will make header only 48.5px high in user page
    <div className="flex h-full justify-center">
      <div
        id="mobile-container"
        className="flex h-full w-mobile-max flex-col bg-white"
      >
        {children}
      </div>
    </div>
  );
}
