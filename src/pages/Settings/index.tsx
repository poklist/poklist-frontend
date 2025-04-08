import Footer from '@/components/Footer';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/core/macro';
import BlocksSection from './BlocksSection';
import IntroSection from './IntroSection';

interface SettingsPageProps {
  // Add any props you need for the page
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { user: me } = useUserStore();
  const navigateTo = useStrictNavigate();

  const handleOnClose = () => {
    // FUTURE: if history is not empty, navigate to the previous page; otherwise, navigate to the user page
    navigateTo.user(me.userCode);
  };

  return (
    // Your component code here
    <>
      <BackToUserHeader owner={me} />
      <IntroSection />
      <BlocksSection />
      <Footer onClose={handleOnClose} title={t`Setting Center`} />
    </>
  );
};

export default SettingsPage;
