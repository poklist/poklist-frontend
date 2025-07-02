'use client';

import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import Header from '@/components/Header';
import HeroSection from './_components/HeroSection';
import ListSection from './_components/ListSection';
import { TileBackground } from './_components/TileBackground';

const UserPage: React.FC = () => {
  return (
    <>
      <TileBackground />
      <div className="relative flex min-h-screen flex-col sm:min-h-desktop-container">
        <Header />
        <HeroSection />
        <ListSection />
        <FloatingButtonFooter />
      </div>
    </>
  );
};

export default UserPage;
