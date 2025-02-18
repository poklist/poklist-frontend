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

export interface UserPreview {
  id: number;
  userCode: string;
  displayName: string;
  profileImage: string;
}

export interface IUpdateUserResponse extends User {
  accessToken: string;
}

export type SocialLinks = PartialRecord<SocialLinkType, string>;
