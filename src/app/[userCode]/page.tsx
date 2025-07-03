'use client';

import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import Header from '@/components/Header';
import HeroSection from '@/app/user/_components/HeroSection';
import ListSection from '@/app/user/_components/ListSection';
import { TileBackground } from '@/app/user/_components/TileBackground';

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
