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
