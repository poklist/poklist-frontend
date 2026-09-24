import ViewListPageClient from '@/app/[userCode]/list/[id]/client';
import JsonLd from '@/components/JsonLd';
import listsKeys from '@/hooks/api/lists/keys';
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
      title: 'Not found | Relist',
      ...createBaseMetadata(),
      robots: { index: false, follow: false },
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

  // 匿名 Server fetch 抓不到 !== 不存在：可能是 Private list
  // Private list 本就不該有 OG preview / JsonLd / hydration
  if (list && list.owner.userCode !== userCode) {
    notFound();
  }

  const queryClient = new QueryClient();
  if (listResponse) {
    const sanitized = {
      ...listResponse,
      content: listResponse.content
        ? { ...listResponse.content, isLiked: undefined }
        : listResponse.content,
    };
    queryClient.setQueryData(listsKeys.infiniteIdeas(id), {
      pages: [toTsRestEntry(sanitized)],
      pageParams: [0],
    });
  }

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://relist.cc';
  const listJsonLd: Record<string, unknown> | null =
    list && user
      ? {
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
        }
      : null;

  // 只傳遞 listID，讓 Client Component 自己使用 TanStack Query 獲取資料
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {listJsonLd && <JsonLd data={listJsonLd} />}
      <ViewListPageClient listID={id} />
    </HydrationBoundary>
  );
}
