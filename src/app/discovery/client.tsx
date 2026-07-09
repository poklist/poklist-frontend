'use client';

import FooterSection from '@/app/discovery/_components/FooterSection';
import { HeaderSection } from '@/app/discovery/_components/HeaderSection';
import ListSection from '@/app/discovery/_components/ListSection';
import TileSection from '@/app/discovery/_components/TileSection';
import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import Header from '@/components/Header';
import useAuthStore from '@/stores/useAuthStore';
import { GoogleOAuthProvider } from '@react-oauth/google';

const DiscoveryContent = () => {
  const { isLoggedIn } = useAuthStore();
  return (
    <>
      <Header
        bgColor="transparent"
        fakeBlockColor={isLoggedIn ? 'white' : 'primary'}
      />
      {isLoggedIn ? <></> : <HeaderSection />}
      <TileSection />
      <ListSection />
      <FooterSection />
      <FloatingButtonFooter />
    </>
  );
};

export default function DiscoveryPage() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <DiscoveryContent />
    </GoogleOAuthProvider>
  );
}
