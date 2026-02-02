import { CustomizedLinkIcon } from '@/components/ui/icons/CustomizedLinkIcon';
import { InstagramIcon } from '@/components/ui/icons/InstagramIcon';
import { LinkedInIcon } from '@/components/ui/icons/LinkedInIcon';
import { ThreadsIcon } from '@/components/ui/icons/ThreadsIcon';
import { TikTokIcon } from '@/components/ui/icons/TikTokIcon';
import { YouTubeIcon } from '@/components/ui/icons/YouTubeIcon';
import { SocialLinkType } from '@/enums/index.enum';
import type { ReactNode } from 'react';

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
