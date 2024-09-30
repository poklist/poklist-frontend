import type { ReactNode } from 'react';

interface MainContainerProps {
  children?: ReactNode;
}

export default function MobileContainer({ children }: MainContainerProps) {
  return (
    <div className="flex h-screen w-[430px] flex-col justify-center self-center px-10">
      {children}
    </div>
  );
}
