export interface ICreateListRequest {
  title: string;
  description: string;
  externalLink: string;
  coverImage: File | null;
  categoryID: string;
}
