import mascotPhone from '@/assets/images/mascot/mascot-phone.svg';
import Header from '@/components/Header';
import { LanguageProvider } from '@/components/Language';
import { Trans } from '@lingui/react/macro';

export default function GoToMobilePage() {
  return (
    <LanguageProvider>
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header bgColor="transparent" />

        {/* 內容 */}
        <div className="flex flex-1 flex-col items-center justify-start pt-28">
          <img src={mascotPhone.src} alt="Mascot Phone" className="h-[125px]" />
          <div className="mt-6 flex flex-col items-start">
            <Trans>
              <p className="text-start text-[17px] font-bold text-black-text-01">
                Relist works best on mobile.
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
