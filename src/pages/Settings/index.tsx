import { Header } from '@/components/Header';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import BlocksSection from './BlocksSection';
import IntroSection from './IntroSection';

interface SettingsPageProps {
  // Add any props you need for the page
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  return (
    // Your component code here
    <MobileContainer>
      <Header type="back-to-user" />
      <IntroSection />
      <BlocksSection />
    </MobileContainer>
  );
};

export default SettingsPage;
