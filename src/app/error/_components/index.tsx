import mascotError from '@/assets/images/mascot/mascot-error.svg';
import Header from '@/components/Header';
import { LanguageProvider } from '@/components/Language';
import { Trans } from '@lingui/react/macro';
import { TileBackground } from '../User/TileBackground';

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
            <img
              src={mascotError.src}
              alt="Error Mascot"
              className="h-[125px]"
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
