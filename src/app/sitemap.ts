import { MetadataRoute } from 'next';

const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://relist.cc';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteURL}/discovery`,
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}
