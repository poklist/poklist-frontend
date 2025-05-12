import Header from '@/components/Header';
import { HeaderSection } from './Components/HeaderSection';
import { GoogleOAuthProvider } from '@react-oauth/google';
import TileSection from './Components/TileSection';
import ListSection from './Components/ListSection';
import FooterSection from './Components/FooterSection';

const DiscoveryContent = () => {
  return (
    <>
      <Header />
      <HeaderSection />
      <TileSection />
      <ListSection />
      <FooterSection />
    </>
  );
};
export default function Discovery() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <DiscoveryContent />
    </GoogleOAuthProvider>
  );
}
