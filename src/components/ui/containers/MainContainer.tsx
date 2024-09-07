import type { ReactNode } from 'react';

interface MainContainerProps {
  children?: ReactNode;
}

export default function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="flex h-screen flex-col justify-center px-10">
      {children}
    </div>
  );
}
