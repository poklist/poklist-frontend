import mascotPhone from '@/assets/images/mascot/mascot-phone.svg';
import Header from '@/pages/Home/Components/Header';
import { LanguageProvider } from '@/lib/languageProvider';
import { Trans } from '@lingui/react/macro';
import { TileBackground } from '../User/TileBackground';
import { useRef } from 'react';

export default function GoToMobilePage() {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const scrollToTop = () => {
    frameRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <LanguageProvider>
      <TileBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header onSignInClick={scrollToTop} />

        {/* 內容 */}
        <div
          ref={frameRef}
          className="flex flex-1 flex-col items-center justify-start pt-28"
        >
          <img src={mascotPhone} alt="Mascot Phone" className="h-[125px]" />
          <div className="mt-6 flex flex-col items-start">
            <Trans>
              <p className="text-start text-[17px] font-bold text-black-text-01">
                Poklist works best on mobile.
              </p>
              <p className="text-start text-[17px] font-bold text-black-text-01">
                Use a mobile device for the best experience.
              </p>
            </Trans>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
