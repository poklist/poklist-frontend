import ViewListPageClient from '@/app/[userCode]/list/[id]/client';
import JsonLd from '@/components/JsonLd';
import listsKeys from '@/hooks/api/lists/keys';
import usersKeys from '@/hooks/api/users/keys';
import {
  createBaseMetadata,
  createOpenGraphMetadata,
  createTwitterMetadata,
  getPreviewImage,
  getUserDisplayText,
  truncateTitle,
} from '@/lib/metadata';
import { fetchListForSEO, fetchUserForSEO } from '@/lib/seo/fetchers';
import { toTsRestEntry } from '@/lib/seo/prefetch';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    userCode: string;
    id: string;
  }>;
}

// // Server-side 資料獲取 - 主要用於 SEO 和 generateMetadata
// async function fetchListForSEO(listID: string): Promise<List | null> {
//   try {
//     const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const response = await fetch(`${baseURL}/lists/${listID}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       next: { revalidate: 300 }, // 5 分鐘快取
//     });

//     if (!response.ok) return null;
//     const data = (await response.json()) as IResponse<List>;
//     return data.content || null;
//   } catch (error) {
//     console.error('Failed to fetch list for SEO:', error);
//     return null;
//   }
// }

// async function fetchUserForSEO(userCode: string): Promise<User | null> {
//   try {
//     const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const response = await fetch(`${baseURL}/${userCode}/info`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       next: { revalidate: 300 }, // 5 分鐘快取
//     });

//     if (!response.ok) return null;
//     const data = (await response.json()) as IResponse<User>;
//     return data.content || null;
//   } catch (error) {
//     console.error('Failed to fetch user for SEO:', error);
//     return null;
//   }
// }

// generateMetadata 使用共用邏輯
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userCode, id } = await params;

  const [listResponse, userResponse] = await Promise.all([
    fetchListForSEO(id),
    fetchUserForSEO(userCode),
  ]);

  const list = listResponse?.content ?? null;
  const user = userResponse?.content ?? null;

  if (!list || !user) {
    return {
      title: 'List not found | Relist',
      description: 'This list could not be found.',
      ...createBaseMetadata(),
    };
  }

  // 1. 預覽標題格式：[名單標題]
  const truncatedTitle = truncateTitle(list.title);
  const fullTitle = `${truncatedTitle} | ${user.displayName} (@${user.userCode})`;

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
  const [listResponse, userResponse] = await Promise.all([
    fetchListForSEO(id),
    fetchUserForSEO(userCode),
  ]);

  const list = listResponse?.content ?? null;
  const user = userResponse?.content ?? null;

  // 如果資料完全不存在，返回 404
  if (!list || !user) {
    notFound();
  }

  // 檢查 list 的 owner 是否與 URL 中的 userCode 一致
  if (list.owner.userCode !== userCode) {
    notFound();
  }

  const queryClient = new QueryClient();
  queryClient.setQueryData(listsKeys.infiniteIdeas(id), {
    pages: [toTsRestEntry(listResponse)],
    pageParams: [0],
  });
  queryClient.setQueryData(
    usersKeys.userInfo(userCode),
    toTsRestEntry(userResponse)
  );

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://relist.cc';
  const listJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: list.title,
    url: `${siteURL}/${userCode}/list/${id}`,
    author: {
      '@type': 'Person',
      name: user.displayName || user.userCode,
      url: `${siteURL}/${userCode}`,
    },
    ...(list.description ? { description: list.description } : {}),
    ...(Array.isArray(list.ideas) && list.ideas.length > 0
      ? {
          itemListElement: list.ideas.map((idea, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: idea.title,
          })),
        }
      : {}),
  };

  // 只傳遞 listID，讓 Client Component 自己使用 TanStack Query 獲取資料
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <JsonLd data={listJsonLd} />
      <ViewListPageClient listID={id} />
    </HydrationBoundary>
  );
}
