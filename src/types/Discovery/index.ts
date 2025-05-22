import { User } from '../User';

// API Response
interface ListOwner {
  id: number;
  profileImage: string;
  userCode: string;
  displayName: string;
}

export interface OfficialCollection {
  coverImage: string;
  id: number;
  owner: ListOwner;
  title: string;
}

export interface LatestList {
  id: number;
  title: string;
  owner: ListOwner;
}

export interface LatestListGroup {
  [key: string]: LatestList[];
}

export interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (success: boolean) => void;
  onError: () => void;
}
export interface LoginInfo {
  accessToken: string;
  user: User;
}
