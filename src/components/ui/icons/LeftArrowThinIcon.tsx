import { SVGProps } from 'react';

const IconLeftArrowThin = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      viewBox="0 0 10 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.17578 16.5L1.67578 9L9.17578 1.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconLeftArrowThin;
