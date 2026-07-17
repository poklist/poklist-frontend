import DiscoveryPageClient from '@/app/discovery/client';
import categoriesKeys from '@/hooks/api/categories/keys';
import discoveryKeys from '@/hooks/api/discovery/keys';
import { fetchJSONForSEO } from '@/lib/seo/fetchers';
import { toTsRestEntry } from '@/lib/seo/prefetch';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function DiscoveryPage() {
  const [
    categories,
    //  latestListGroups,
    officialCollections,
  ] = await Promise.all([
    fetchJSONForSEO('/categories'),
    // fetchJSONForSEO('/discovery/latest-list-groups'),
    fetchJSONForSEO('/discovery/official-collections'),
  ]);

  const queryClient = new QueryClient();
  if (categories)
    queryClient.setQueryData(categoriesKeys.list(), toTsRestEntry(categories));
  // if (latestListGroups)
  //   queryClient.setQueryData(
  //     discoveryKeys.latestListGroups(),
  //     toTsRestEntry(latestListGroups)
  //   );
  if (officialCollections)
    queryClient.setQueryData(
      discoveryKeys.officialCollections(),
      toTsRestEntry(officialCollections)
    );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DiscoveryPageClient />
    </HydrationBoundary>
  );
}
