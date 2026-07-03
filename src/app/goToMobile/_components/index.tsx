import Header from '@/components/Header';
import { Trans } from '@lingui/macro';
import Image from 'next/image';

export default function GoToMobilePage() {
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Header */}
      <Header bgColor="transparent" />

      {/* 內容 */}
      <div className="flex flex-1 flex-col items-center justify-start pt-28">
        <Image
          src="/images/mascot/mascot-phone.svg"
          alt="Mascot Phone"
          height={121}
          width={134}
          priority
        />
        <div className="mt-6 flex flex-col items-start">
          <p className="text-start text-h2 font-bold text-black-text-01">
            <Trans>Relist works best on mobile.</Trans>
          </p>
          <p className="text-start text-h2 font-bold text-black-text-01">
            <Trans>Use a mobile device for the best experience.</Trans>
          </p>
        </div>
      </div>
    </div>
  );
}
