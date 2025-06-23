'use client';

import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import Header from '@/components/Header';
import HeroSection from '@/pages/User/HeroSection';
import ListSection from '@/pages/User/ListSection';
import { TileBackground } from '@/pages/User/TileBackground';

export default function UserPage() {
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
}
