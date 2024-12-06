import type { ReactNode } from 'react';

interface MobileContainerProps {
  children?: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex justify-center bg-[#F0F0F0]">
      <div className="w-mobile-max flex h-screen flex-col bg-white">
        {children}
      </div>
    </div>
  );
}
