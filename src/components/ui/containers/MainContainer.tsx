import type { ReactNode } from 'react';

interface MainContainerProps {
  children?: ReactNode;
}

export default function MainContainer({ children }: MainContainerProps) {
  return (
    <div className="mx-auto flex h-screen max-w-7xl flex-col justify-center px-10">
      {children}
    </div>
  );
}
