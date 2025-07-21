import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ViewListPageClient from './client';
import { List } from '@/types/List';
import { User } from '@/types/User';
import { IResponse } from '@/types/response';

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

// 工具函數：標題長度限制處理
function truncateTitle(title: string, maxLength: number = 60): string {
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength - 3) + '...';
}

// 工具函數：獲取用戶顯示名稱
function getUserDisplayText(user: User): string {
  const displayName = user.displayName?.trim();
  return displayName ? `${displayName} on Relist` : 'Newbie on Relist';
}

// 工具函數：獲取預覽圖片
function getPreviewImage(list: List): string[] {
  // 優先使用名單的封面圖片
  // if (list.coverImage) {
  //   return [list.coverImage];
  // }

  // 若無封面圖，使用指定的 Google Drive 預設圖片
  const defaultImages = [
    'https://lh3.googleusercontent.com/d/1V2iUbUbUo7CYrUYS3eYuIDzvrda-NPNa',
  ];

  return defaultImages;
}

// generateMetadata 使用 server-side 資料
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
      metadataBase: new URL('https://relist.cc'),
    };
  }

  // 1. 預覽標題格式：[名單標題]，超出長度用...處理
  const truncatedTitle = truncateTitle(list.title);
  const fullTitle = `${truncatedTitle} | Relist`;

  // 2. Relist 用戶姓名顯示：[用戶名稱] on Relist 或 Newbie on Relist
  const description = getUserDisplayText(user);

  // 3. 預覽圖片顯示：使用名單封面圖或指定的預設圖片（1200x630px格式）
  const images = getPreviewImage(list);

  return {
    title: fullTitle,
    description,
    // 4. 來源網址顯示：relist.cc
    metadataBase: new URL('https://relist.cc'),
    openGraph: {
      title: truncatedTitle, // OG 標題不包含 " | Relist"
      description,
      images: images.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: truncatedTitle,
      })),
      siteName: 'Relist',
      url: `/${userCode}/list/${id}`, // 相對路徑，配合 metadataBase
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: truncatedTitle,
      description,
      images: images.map((image) => ({
        url: image,
        width: 1200,
        height: 630,
        alt: truncatedTitle,
      })),
      site: '@relist', // Twitter 帳號
    },
    // 其他有用的 SEO 標籤
    robots: {
      index: true,
      follow: true,
    },
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
