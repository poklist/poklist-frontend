import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import Header from '@/components/Header';
import HeroSection from './HeroSection';
import ListSection from './ListSection';
import { TileBackground } from './TileBackground';

const UserPage: React.FC = () => {
  return (
    <>
      <TileBackground />
      <div className="sm:min-h-desktop-container relative flex min-h-screen flex-col">
        <Header />
        <HeroSection />
        <ListSection />
        <FloatingButtonFooter />
      </div>
    </>
  );
};

export default UserPage;
