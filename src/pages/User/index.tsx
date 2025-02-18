import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';
import Header from '@/components/Header';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import HeroSection from './HeroSection';
import ListSection from './ListSection';

const UserPage: React.FC = () => {
  return (
    // Your component code here
    <MobileContainer>
      <Header />
      <HeroSection />
      <ListSection />
      <FloatingButtonFooter />
    </MobileContainer>
  );
};

export default UserPage;
