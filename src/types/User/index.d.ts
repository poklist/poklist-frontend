export interface User {
  id: number;
  displayName: string;
  userCode: string;
  email?: string;
  bio?: string;
  profileImage?: string;
  socialLinks?: SocialLinks;
  listCount?: number;
  followerCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
}

export type SocialLinks = PartialRecord<SocialLinkType, string>;
