import type { ReactNode } from 'react';

interface MobileContainerProps {
  children?: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex h-screen justify-center">
      <div
        id="mobile-container"
        className="flex h-screen w-mobile-max flex-col bg-white"
      >
        {children}
      </div>
    </div>
  );
}
