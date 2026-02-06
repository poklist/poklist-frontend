'use client';

import { TileBackground } from '@/app/user/_components/TileBackground';
import Header from '@/components/Header';
import { LanguageProvider } from '@/components/Language';
import { Trans } from '@lingui/macro';
import Image from 'next/image';

export default function ErrorPage() {
  return (
    <LanguageProvider>
      <TileBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header bgColor="transparent" />

        {/* 內容 */}
        <div className="flex flex-1 flex-col items-center justify-start pt-28">
          <div className="flex flex-col items-center gap-6">
            <Image
              src="/images/mascot/mascot-error.svg"
              alt="Error Mascot"
              width={101}
              height={125}
            />
            <h2 className="text-center text-[17px] font-bold text-black-text-01">
              <Trans>Oops something is wrong!</Trans>
            </h2>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
