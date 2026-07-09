import JsonLd from '@/components/JsonLd';
import {
  createBaseMetadata,
  createOpenGraphMetadata,
  createTwitterMetadata,
} from '@/lib/metadata';
import { Metadata } from 'next';

const TITLE = 'Discover curated lists';
const DESCRIPTION =
  'Your lists say more than posts ever could. Explore curated lists and ideas on Relist.';
const OG_IMAGES = ['/images/og/relist-default.png'];

export const metadata: Metadata = {
  ...createBaseMetadata(),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/discovery' },
  openGraph: createOpenGraphMetadata(
    TITLE,
    DESCRIPTION,
    OG_IMAGES,
    '/discovery'
  ),
  twitter: createTwitterMetadata(TITLE, DESCRIPTION, OG_IMAGES),
};

export default function DiscoveryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Relist',
          url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://relist.cc',
        }}
      />
      {children}
    </>
  );
}
