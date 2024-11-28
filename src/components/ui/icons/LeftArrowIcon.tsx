import type { SVGProps } from 'react';

export default function IconLeftArrow(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="7"
      height="11"
      viewBox="0 0 7 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.76328 0.730169C7.05038 1.02875 7.04107 1.50353 6.74249 1.79063L2.80474 5.5L6.74249 9.20938C7.04107 9.49647 7.05037 9.97125 6.76328 10.2698C6.47618 10.5684 6.0014 10.5777 5.70282 10.2906L1.20282 6.04063C1.05576 5.89922 0.972655 5.70401 0.972655 5.5C0.972655 5.29599 1.05576 5.10078 1.20282 4.95938L5.70282 0.709376C6.0014 0.422281 6.47619 0.431591 6.76328 0.730169Z"
        fill="#1F1F1F"
      />
    </svg>
  );
}
