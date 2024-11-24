export interface UserResponse {
  id: string;
  displayName: string;
  profileImage: string;
  userCode: string;
  bio: string;
}

export interface ListResponse {
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: string;
}

export interface IdeaResponse {
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
}
