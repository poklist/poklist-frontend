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

export interface SocialLinks {
  customized?: string;
  instagram?: string;
  threads?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
}
