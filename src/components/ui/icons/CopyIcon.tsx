import { SVGProps } from 'react';

const IconCopy = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.5 5.25V3C13.5 1.75736 12.4926 0.75 11.25 0.75H3C1.75736 0.75 0.75 1.75736 0.75 3V11.25C0.75 12.4926 1.75736 13.5 3 13.5H5.25M13.5 5.25H15C16.2426 5.25 17.25 6.25736 17.25 7.5V15C17.25 16.2426 16.2426 17.25 15 17.25H7.5C6.25736 17.25 5.25 16.2426 5.25 15V13.5M13.5 5.25H7.5C6.25736 5.25 5.25 6.25736 5.25 7.5V13.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
      />
    </svg>
  );
};

export default IconCopy;
