import { SocialLinkType } from '@/types/enum';

export const socialLinkStarterMap: Record<SocialLinkType, string> = {
  [SocialLinkType.Customized]: 'www.',
  [SocialLinkType.Instagram]: 'www.instagram.com/',
  [SocialLinkType.YouTube]: 'www.youtube.com/',
  [SocialLinkType.TikTok]: 'www.tiktok.com/',
  [SocialLinkType.Threads]: 'www.threads.net/',
  [SocialLinkType.LinkedIn]: 'www.linkedin.com/',
};
