import type { SVGProps } from 'react';

export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      {...props}
    >
      <title>X</title>
      <path
        fill="currentColor"
        d="M9.333 6.929L14.546 1H13.31L8.783 6.147L5.169 1H1l5.466 7.783L1 15h1.235l4.779-5.436L10.83 15H15zM7.641 8.852l-.554-.776L2.68 1.911h1.898l3.557 4.977l.552.776l4.623 6.47h-1.897z"
      />
    </svg>
  );
}