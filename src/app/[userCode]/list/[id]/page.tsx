import ViewListPageClient from './client';

interface PageProps {
  params: Promise<{
    userCode: string;
    id: string;
  }>;
}

export default async function ViewListPage({ params }: PageProps) {
  const { id } = await params;

  // Client Component 透過 useUserRouteContext 獲取已經清理過的 userCode
  return <ViewListPageClient listID={id} />;
}
