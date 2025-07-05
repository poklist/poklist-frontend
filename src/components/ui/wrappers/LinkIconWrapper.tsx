import { SocialLinkType } from '@/enums/index.enum';
import type { ReactNode } from 'react';
import { CustomizedLinkIcon } from '../icons/CustomizedLinkIcon';
import { InstagramIcon } from '../icons/InstagramIcon';
import { LinkedInIcon } from '../icons/LinkedInIcon';
import { ThreadsIcon } from '../icons/ThreadsIcon';
import { TikTokIcon } from '../icons/TikTokIcon';
import { YouTubeIcon } from '../icons/YouTubeIcon';

interface LinkIconWrapperProps {
  children?: ReactNode;
  variant?: SocialLinkType;
}

export default function LinkIconWrapper({
  children,
  variant,
}: LinkIconWrapperProps) {
  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-main-03">
      {children ? (
        children
      ) : variant === SocialLinkType.CUSTOMIZED ? (
        <CustomizedLinkIcon />
      ) : variant === SocialLinkType.INSTAGRAM ? (
        <InstagramIcon />
      ) : variant === SocialLinkType.YOUTUBE ? (
        <YouTubeIcon />
      ) : variant === SocialLinkType.TIKTOK ? (
        <TikTokIcon />
      ) : variant === SocialLinkType.THREADS ? (
        <ThreadsIcon />
      ) : variant === SocialLinkType.LINKEDIN ? (
        <LinkedInIcon />
      ) : (
        <></>
      )}
    </div>
  );
}
