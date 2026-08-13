import { IdeaResponse } from '@/types/Idea';
import { List } from '@/types/List';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';

// Server-side 資料獲取 - 主要用於 SEO 和 generateMetadata
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// E2E 需要關閉 SSR fetch 快取才能隔離測試（否則第二個測試吃到第一個的快取回應）。
// 未設定時維持 300 秒，prod 行為不變。
const SEO_FETCH_REVALIDATE = Number(process.env.SEO_FETCH_REVALIDATE ?? 300);

export async function fetchJSONForSEO<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${baseURL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: SEO_FETCH_REVALIDATE },
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
