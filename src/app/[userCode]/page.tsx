import UserPageClient from '@/app/[userCode]/client';
import JsonLd from '@/components/JsonLd';
import {
  createBaseMetadata,
  createOpenGraphMetadata,
  createTwitterMetadata,
  getPreviewImage,
  truncateDescription,
} from '@/lib/metadata';
import { fetchUserForSEO } from '@/lib/seo/fetchers';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ userCode: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { userCode } = await params;
  const userResponse = await fetchUserForSEO(userCode);
  const user = userResponse?.content;

  if (!user) {
    return {
      title: 'User not found',
      ...createBaseMetadata(),
    };
  }

  const title = `${user.displayName || user.userCode} (@${user.userCode})`;
  const description = user.bio
    ? truncateDescription(user.bio)
    : `Lists and ideas by ${user.displayName || user.userCode} on Relist`;
  const images = getPreviewImage(user.profileImage);

  return {
    title,
    description,
    ...createBaseMetadata(),
    openGraph: createOpenGraphMetadata(
      title,
      description,
      images,
      `/${userCode}`
    ),
    twitter: createTwitterMetadata(title, description, images),
    alternates: { canonical: `/${userCode}` },
  };
}

export default async function UserPage({ params }: PageProps) {
  const { userCode } = await params;
  const userResponse = await fetchUserForSEO(userCode);
  const user = userResponse?.content;

  if (!user) notFound();

  const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://relist.cc';

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: user.displayName || user.userCode,
          alternateName: user.userCode,
          url: `${siteURL}/${userCode}`,
          ...(user.profileImage && !user.profileImage.startsWith('data:')
            ? { image: user.profileImage }
            : {}),
        }}
      />
      <UserPageClient />
    </>
  );
}
