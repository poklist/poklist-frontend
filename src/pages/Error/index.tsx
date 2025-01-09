import mascotBig from '@/assets/images/mascot/mascot-big.svg';
import { Header } from '@/components/Header';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import { TileBackground } from '../User/TileBackground';

export default function ErrorPage() {
  return (
    <MobileContainer>
      <TileBackground />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Header */}
        <Header />

        {/* 內容 */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <img src={mascotBig} alt="Error Mascot" className="h-40 md:h-60" />
            <h1 className="text-center text-2xl font-bold text-black-text-01 md:text-4xl">
              Oops something is wrong!
            </h1>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
