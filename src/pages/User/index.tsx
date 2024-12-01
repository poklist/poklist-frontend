import MobileContainer from '@/components/ui/containers/MobileContainer';
import { Header } from './Header';
import HeroSection from './HeroSection';
import ListSection from './ListSection';

const UserPage: React.FC = () => {
  return (
    // Your component code here
    <MobileContainer>
      <Header />
      <HeroSection />
      <ListSection />
    </MobileContainer>
  );
};

export default UserPage;
