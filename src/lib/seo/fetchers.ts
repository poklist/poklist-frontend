import { IdeaResponse } from '@/types/Idea';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';

// Server-side 資料獲取 - 主要用於 SEO 和 generateMetadata
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchJSONForSEO<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 300 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch (error) {
    console.error(`Failed to fetch ${path} for SEO:`, error);
    return null;
  }
}

export const fetchListForSEO = (listID: string, query: string = '') =>
  fetchJSONForSEO<IResponse<List>>(`/lists/${listID}${query}`);

export const fetchUserForSEO = (userCode: string) =>
  fetchJSONForSEO<IResponse<User>>(`/${userCode}/info`);

export const fetchIdeaForSEO = (ideaID: string) =>
  fetchJSONForSEO<IResponse<IdeaResponse>>(`/ideas/${ideaID}`);
