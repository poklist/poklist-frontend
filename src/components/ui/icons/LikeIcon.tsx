import type { SVGProps } from 'react';

export default function IconLike(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="14"
      height="12"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Like</title>
      <path
        d="M15 4.27273C15 2.46525 13.3677 1 11.3542 1C9.84868 1 8.55633 1.81911 8 2.98794C7.44367 1.81911 6.15131 1 4.64583 1C2.6323 1 1 2.46525 1 4.27273C1 9.52405 8 13 8 13C8 13 15 9.52405 15 4.27273Z"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
