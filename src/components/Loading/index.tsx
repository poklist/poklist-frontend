import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface IMaskProps {
  isLoading: boolean;
}

const MaskComponent: React.FC<IMaskProps> = ({ isLoading }) => {
  return (
    <div
      className={cn(
        `fixed left-0 top-0 z-10 h-screen w-screen bg-black bg-opacity-20 duration-300`,
        isLoading ? 'animate-show-mask' : 'animate-hide-mask'
      )}
    />
  );
};

interface ISVGProps extends React.SVGProps<SVGSVGElement> {
  isLoading: boolean;
  size?: number;
  className?: string;
}

const LoadingSpinner = ({
  isLoading,
  size = 24,
  className,
  ...props
}: ISVGProps) => {
  const [removeDOM, setRemoveDOM] = useState(!isLoading);

  useEffect(() => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    if (isLoading) {
      setRemoveDOM(false);
      document.body.classList.add('overflow-hidden');
    } else {
      timeoutId = setTimeout(() => {
        setRemoveDOM(true);
      }, 100);
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
      clearTimeout(timeoutId);
    };
  }, [isLoading]);

  return (
    !removeDOM &&
    createPortal(
      <>
        <MaskComponent isLoading={isLoading} />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size}
          height={size}
          {...props}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn('fixed left-1/2 top-1/2 z-20 animate-spin', className)}
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </>,
      document.body
    )
  );
};

export default LoadingSpinner;
