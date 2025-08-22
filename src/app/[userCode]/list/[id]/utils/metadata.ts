import { Metadata } from 'next';
import { User } from '@/types/User';
import { z } from 'zod';

// 截斷標題的共用函數
export const truncateTitle = (
  title: string,
  maxLength: number = 50
): string => {
  return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
};

export function getPreviewImage(image: string | null | undefined): string[] {
  // 優先使用名單的封面圖片
  if (image) {
    // 建立 URL schema 驗證
    const urlSchema = z.string().url();

    // 檢查是否為 base64 格式（以 data: 開頭）
    const isBase64 = image.startsWith('data:');

    // 如果是 base64，直接返回預設圖片
    if (isBase64) {
      const defaultImages = [
        'https://lh3.googleusercontent.com/d/1V2iUbUbUo7CYrUYS3eYuIDzvrda-NPNa',
      ];
      return defaultImages;
    }

    // 檢查是否為有效的 URL
    const urlValidation = urlSchema.safeParse(image);

    // 如果是有效的 URL，返回該圖片
    if (urlValidation.success) {
      return [image];
    }
  }

  // 若無封面圖或不是有效 URL，使用指定的 Google Drive 預設圖片
  const defaultImages = [
    'https://lh3.googleusercontent.com/d/1V2iUbUbUo7CYrUYS3eYuIDzvrda-NPNa',
  ];

  return defaultImages;
}

// 取得用戶顯示文字的共用函數
export const getUserDisplayText = (user: User): string => {
  if (user.displayName) {
    return `${user.displayName} on Relist`;
  }
  return 'Newbie on Relist';
};

// 建立基礎 metadata 的共用函數
export const createBaseMetadata = (): Partial<Metadata> => ({
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : new URL('https://relist.cc'),
  robots: {
    index: true,
    follow: true,
  },
});

// 建立 Open Graph metadata 的共用函數
export const createOpenGraphMetadata = (
  title: string,
  description: string,
  images: string[],
  url: string
): Metadata['openGraph'] => ({
  title,
  description,
  images: images.map((image) => ({
    url: image,
    width: 1200,
    height: 630,
    alt: title,
  })),
  siteName: 'Relist',
  url,
  type: 'website',
});

// 建立 Twitter metadata 的共用函數
export const createTwitterMetadata = (
  title: string,
  description: string,
  images: string[]
): Metadata['twitter'] => ({
  card: 'summary_large_image',
  title,
  description,
  images: images.map((image) => ({
    url: image,
    width: 1200,
    height: 630,
    alt: title,
  })),
  site: '@relist',
});
