import type { Metadata } from 'next';
import { Inter, Noto_Sans } from 'next/font/google';
import '@radix-ui/themes/styles.css';
import '../index.css';
import { AppProviders } from '@/providers';
import ConditionalLayout from '@/components/ConditionalLayout';

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

export const metadata: Metadata = {
  title: 'Relist',
  icons: {
    icon: [
      {
        url: '/favicon/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon/favicon-16x16.png',
        type: 'image/png',
        sizes: '16x16',
      },
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
    apple: [
      {
        url: '/favicon/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
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
