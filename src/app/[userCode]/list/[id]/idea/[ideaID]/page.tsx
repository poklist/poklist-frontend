import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { IdeaResponse } from '@/types/Idea';
import { IResponse } from '@/types/response';
import {
  truncateTitle,
  getPreviewImage,
  createBaseMetadata,
  createOpenGraphMetadata,
  createTwitterMetadata,
} from '../../utils/metadata';

interface PageProps {
  params: Promise<{
    userCode: string;
    id: string;
    ideaID: string;
  }>;
}

// Server-side 資料獲取 - 只為了 SEO
async function fetchIdeaForSEO(ideaID: string): Promise<IdeaResponse | null> {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseURL}/ideas/${ideaID}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 }, // 5 分鐘快取
    });

    if (!response.ok) return null;
    const data = (await response.json()) as IResponse<IdeaResponse>;
    return data.content || null;
  } catch (error) {
    console.error('Failed to fetch idea for SEO:', error);
    return null;
  }
}

// generateMetadata - 提供豐富的分享預覽
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userCode, id, ideaID } = await params;
  const idea = await fetchIdeaForSEO(ideaID);

  if (!idea) {
    return {
      title: 'Idea not found | Relist',
      description: 'This idea could not be found.',
      ...createBaseMetadata(),
    };
  }

  // 1. 預覽標題格式：[靈感標題]
  const truncatedTitle = truncateTitle(idea.title);
  const fullTitle = `${truncatedTitle} | Relist`;

  // 2. 描述：使用靈感描述或預設文字
  const description =
    idea.description || `Check out this idea: ${truncatedTitle}`;

  // 3. 預覽圖片：使用靈感封面圖或預設圖片
  const images = getPreviewImage(idea.coverImage);

  // 4. 建立 metadata 使用共用函數
  const baseMetadata = createBaseMetadata();
  const openGraphMetadata = createOpenGraphMetadata(
    truncatedTitle,
    description,
    images,
    `/${userCode}/list/${id}/idea/${ideaID}`
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
      canonical: `/${userCode}/list/${id}/idea/${ideaID}`,
    },
  };
}

// 頁面組件 - 只負責重定向，不渲染任何 UI
export default async function IdeaSEOPage({ params }: PageProps) {
  const { userCode, id, ideaID } = await params;
  const idea = await fetchIdeaForSEO(ideaID);

  if (!idea) {
    // 如果找不到 idea，重定向到 list 頁面
    redirect(`/${userCode}/list/${id}`);
  }

  // 重定向到 list 頁面並自動觸發 idea 視窗
  redirect(`/${userCode}/list/${id}?ideaID=${ideaID}`);
}
