import type { ReactNode } from 'react';

interface MobileContainerProps {
  children?: ReactNode;
}

export default function MobileContainer({ children }: MobileContainerProps) {
  return (
    <div className="flex justify-center bg-[#888888]">
      <div className="flex h-screen w-[430px] flex-col bg-white">
        {children}
      </div>
    </div>
  );
}
