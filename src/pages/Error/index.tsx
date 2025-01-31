import mascotError from '@/assets/images/mascot/mascot-error.svg';
import { Header } from '@/components/Header';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import { TileBackground } from '../User/TileBackground';
import { Trans } from '@lingui/macro';
import { LanguageProvider } from '@/lib/languageProvider';

export default function ErrorPage() {
  return (
    <LanguageProvider>
      <MobileContainer>
        <TileBackground />

        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Header */}
          <Header />

          {/* 內容 */}
          <div className="flex flex-1 flex-col items-center justify-start pt-28">
            <div className="flex flex-col items-center gap-6">
              <img src={mascotError} alt="Error Mascot" className="h-[125px]" />
              <h2 className="text-center text-[17px] font-bold text-black-text-01">
                <Trans>哎呀！網頁又在耍脾氣啦！</Trans>
              </h2>
            </div>
          </div>
        </div>
      </MobileContainer>
    </LanguageProvider>
  );
}
