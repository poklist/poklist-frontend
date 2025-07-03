'use client';

import Header from '@/components/Header';
import useAuthStore from '@/stores/useAuthStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FooterSection from './_components/FooterSection';
import { HeaderSection } from './_components/HeaderSection';
import ListSection from './_components/ListSection';
import TileSection from './_components/TileSection';
import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';

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
