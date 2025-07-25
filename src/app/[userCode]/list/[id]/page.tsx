import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ViewListPageClient from './client';
import { List } from '@/types/List';
import { User } from '@/types/User';
import { IResponse } from '@/types/response';
import {
  truncateTitle,
  getUserDisplayText,
  createBaseMetadata,
  createOpenGraphMetadata,
  createTwitterMetadata,
  getPreviewImage,
} from './utils/metadata';

interface PageProps {
  params: Promise<{
    userCode: string;
    id: string;
  }>;
}

// Server-side 資料獲取 - 主要用於 SEO 和 generateMetadata
async function fetchListForSEO(listID: string): Promise<List | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/lists/${listID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5 分鐘快取
    });

    if (!response.ok) return null;
    const data = (await response.json()) as IResponse<List>;
    return data.content || null;
  } catch (error) {
    console.error('Failed to fetch list for SEO:', error);
    return null;
  }
}

async function fetchUserForSEO(userCode: string): Promise<User | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/${userCode}/info`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5 分鐘快取
    });

    if (!response.ok) return null;
    const data = (await response.json()) as IResponse<User>;
    return data.content || null;
  } catch (error) {
    console.error('Failed to fetch user for SEO:', error);
    return null;
  }
}

// generateMetadata 使用共用邏輯
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userCode, id } = await params;

  const [list, user] = await Promise.all([
    fetchListForSEO(id),
    fetchUserForSEO(userCode),
  ]);

  if (!list || !user) {
    return {
      title: 'List not found | Relist',
      description: 'This list could not be found.',
      ...createBaseMetadata(),
    };
  }

  // 1. 預覽標題格式：[名單標題]
  const truncatedTitle = truncateTitle(list.title);
  const fullTitle = `${truncatedTitle} | Relist`;

  // 2. Relist 用戶姓名顯示
  const description = getUserDisplayText(user);

  // 3. 預覽圖片顯示（使用原有的複雜邏輯）
  const images = getPreviewImage(list.coverImage);

  // 4. 建立 metadata 使用共用函數
  const baseMetadata = createBaseMetadata();
  const openGraphMetadata = createOpenGraphMetadata(
    truncatedTitle,
    description,
    images,
    `/${userCode}/list/${id}`
  );
  const twitterMetadata = createTwitterMetadata(
    truncatedTitle,
    description,
    images
  );

  return {
    title: fullTitle,
    description: description,
    ...baseMetadata,
    openGraph: openGraphMetadata,
    twitter: twitterMetadata,
    alternates: {
      canonical: `/${userCode}/list/${id}`,
    },
  };
}

export default async function ViewListPage({ params }: PageProps) {
  const { userCode, id } = await params;

  // 基本驗證 - 確保路由有效（用於 SEO 和基本錯誤處理）
  const [list, user] = await Promise.all([
    fetchListForSEO(id),
    fetchUserForSEO(userCode),
  ]);

  // 如果資料完全不存在，返回 404
  if (!list || !user) {
    notFound();
  }

  // 檢查 list 的 owner 是否與 URL 中的 userCode 一致
  if (list.owner.userCode !== userCode) {
    notFound();
  }

  // 只傳遞 listID，讓 Client Component 自己使用 TanStack Query 獲取資料
  return <ViewListPageClient listID={id} />;
}
