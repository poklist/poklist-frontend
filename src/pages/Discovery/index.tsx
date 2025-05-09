import Header from '@/components/Header';
import { HeaderSection } from './Components/HeaderSection';
import { GoogleOAuthProvider } from '@react-oauth/google';
import TileSection from './Components/TileSection';
import ListSection from './Components/ListSection';

const DiscoveryContent = () => {
  return (
    <>
      <Header />
      <HeaderSection />
      <TileSection />
      <ListSection />
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
