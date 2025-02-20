import BackToUserHeader from '@/components/Header/BackToUserHeader';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import useUserStore from '@/stores/useUserStore';
import BlocksSection from './BlocksSection';
import IntroSection from './IntroSection';

interface SettingsPageProps {
  // Add any props you need for the page
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { user: me } = useUserStore();

  return (
    // Your component code here
    <MobileContainer>
      <BackToUserHeader owner={me} />
      <IntroSection />
      <BlocksSection />
      {/* TEMP: prevent the content from being hidden by the footer */}
      <div className="h-8" />
    </MobileContainer>
  );
};

export default SettingsPage;
