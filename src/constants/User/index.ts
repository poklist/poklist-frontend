import { SocialLinkType } from '@/enums/index.enum';

export const socialLinkStarterMap: Record<SocialLinkType, string> = {
  [SocialLinkType.CUSTOMIZED]: 'www.',
  [SocialLinkType.INSTAGRAM]: 'www.instagram.com/',
  [SocialLinkType.YOUTUBE]: 'www.youtube.com/',
  [SocialLinkType.TIKTOK]: 'www.tiktok.com/',
  [SocialLinkType.THREADS]: 'www.threads.net/',
  [SocialLinkType.LINKEDIN]: 'www.linkedin.com/',
};
