'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CatchAllIdeaPage() {
  const params = useParams();
  const router = useRouter();

  const userCode = params?.userCode as string;
  const listId = params?.id as string;
  const slug = params?.slug as string[];

  useEffect(() => {
    // 只處理 idea 路徑格式：[idea, ideaId]
    if (slug && slug.length === 2 && slug[0] === 'idea') {
      const ideaId = slug[1];
      // 使用 replace 避免在瀏覽器歷史中留下記錄
      router.replace(`/${userCode}/list/${listId}?ideaID=${ideaId}`);
    } else {
      // 其他格式跳轉到清單頁面
      router.replace(`/${userCode}/list/${listId}`);
    }
  }, [userCode, listId, slug, router]);

  // 顯示最小化的載入畫面
  return null;
}
