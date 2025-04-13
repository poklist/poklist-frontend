import { SocialLinkType } from '@/enums/index.enum';
import { PartialRecord } from '../common';

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
  displayName: string;
  userCode: string;
  profileImage: string; // BASE64
}

export interface IUpdateUserResponse extends User {
  accessToken: string;
}

export type SocialLinks = PartialRecord<SocialLinkType, string>;
