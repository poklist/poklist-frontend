import Header from '@/components/Header';
import useAuthStore from '@/stores/useAuthStore';
import { GoogleOAuthProvider } from '@react-oauth/google';
import FooterSection from './Components/FooterSection';
import { HeaderSection } from './Components/HeaderSection';
import ListSection from './Components/ListSection';
import TileSection from './Components/TileSection';

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
