import { SVGProps } from 'react';

export default function IconDrag(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="25"
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M3.75 7.25H20.25M3.75 12.5H20.25M3.75 17.75H20.25"
        stroke="#828282"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
