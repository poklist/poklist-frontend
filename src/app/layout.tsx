import ConditionalLayout from '@/components/ConditionalLayout';
import '@/index.css';
import {
  createBaseMetadata,
  createOpenGraphMetadata,
  createTwitterMetadata,
} from '@/lib/metadata';
import { AppProviders } from '@/providers';
import '@radix-ui/themes/styles.css';
import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const noto_sans = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const SITE_NAME = 'Relist';
const SITE_DESCRIPTION = 'Your lists say more than posts ever could. ';
const DEFAULT_IMAGES = [
  'https://lh3.googleusercontent.com/pw/AP1GczOiii1tEQ8aUY_fKvDHmgyYO5ZfMh7ioO6bnk7hLi8Fs0H_a7iEwp9KWbSG9Nb6HSZFxPTSjj80mp_GGtD2MYTrgd01w8qPR1_GFBFM0bDaEdpjg6ZWtQVjIjRYEmOfP-yHjtWyAxg09oEdzKOoQh7GxDl979tV67K4o5nmxA10AwcX1-crbkhndpOOQn205k0yljH3RIIXQ9M62hMlluYW-jdfFW3gDOE07rxCaZc4injmWV0aKekr4XKz3_Wz-mudnVV3h1neM-VuiUzeir0C6aQXnfmgc-3yDDZjUV2EFKSx0Devxj2o6IBBk0R6KIKQ32bHoHy6pL9NSO4Y7zQY8-7nOQzfx-WstboZEldib3r9HiHfsXYkr-mILMN8wwTI08DLNPsDN0zMpl0hYu0vaZ0zMyaWo_aMlrh0L6rQnBcFOlSF6pM4CwnGaO7ztJt8Oj4LPd-3Q3OFVtlB5P_-Wb8yFPAJ7n2iBszshgfsQx_OKfjOLYMgRkB8Fps03XQRfwwAAFJbcLKMJVf05-pBWKc2ETQs_N591RwqHJKsg5P9qaTZP8BNpEn_E9X7PWOfVfcZJ6ZPWh5eA6qH9KDisZoTMCUeRQxq9Mtbxjpk_AJ2hPhGJ3zsGtrbOLs03Z3pzTpaZh_KuypX-wXOWDrDwrrulYoovb5GhC_Q_yiWnUMxvASkclfURUtA_8qQyvgWnSxQPNs8gQ8IwXXSZsGEJuHwn5ruxkh_Iq_A-m6vYQXmfwAH1X_zfnagOLmRxdtEIkFMaF2xJOa4lHGKBWnOhq4lZaK2-jK3eEb001aaStOM3IA2TnNY_HLg6KiGPp1avEcagmDvqhWE5KL7pWzJQD4L9yXxnsXmdQFb7FYzEFmvkaoIWlp_pvDF5TnY5ggPNV0xRCXrUNvjbkA3iy9B8_H0XbOMk8b9QH0m5cD83Lo6UjLXKFSxDxnY2XHkv3umim3W4CrKsnTh73t0MYpSia7tnbEueraJxTWLoEW7CYfYmL-Wdk9F8xfV-keSfjZV7O03Fy4I2pA=w1200-h630-no?authuser=0',
];

export const metadata: Metadata = {
  ...createBaseMetadata(),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: SITE_NAME,
  },
  description: SITE_DESCRIPTION,
  openGraph: createOpenGraphMetadata(
    SITE_NAME,
    SITE_DESCRIPTION,
    DEFAULT_IMAGES,
    '/'
  ),
  twitter: createTwitterMetadata(SITE_NAME, SITE_DESCRIPTION, DEFAULT_IMAGES),
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      // Android/Chrome Icons
      {
        url: '/favicon/favicon-192x192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        url: '/favicon/favicon-512x512.png',
        type: 'image/png',
        sizes: '512x512',
      },
    ],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${noto_sans.variable} antialiased`}>
        <AppProviders>
          <div id="root">
            <ConditionalLayout>{children}</ConditionalLayout>
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
