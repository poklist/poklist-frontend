import { Header } from '@/components/Header';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import FooterComponent from './Footer';
import HeroSection from './HeroSection';
import ListSection from './ListSection';

const UserPage: React.FC = () => {
  return (
    // Your component code here
    <MobileContainer>
      <Header />
      <HeroSection />
      <ListSection />
      <FooterComponent />
    </MobileContainer>
  );
};

export default UserPage;
