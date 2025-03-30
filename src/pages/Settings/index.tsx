import Footer from '@/components/Footer';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/core/macro';
import { useNavigate } from 'react-router-dom';
import BlocksSection from './BlocksSection';
import IntroSection from './IntroSection';

interface SettingsPageProps {
  // Add any props you need for the page
}

const SettingsPage: React.FC<SettingsPageProps> = () => {
  const { user: me } = useUserStore();
  const navigate = useNavigate();

  const handleOnClose = () => {
    // FUTURE: if history is not empty, navigate to the previous page; otherwise, navigate to the user page
    navigate(`/${me.userCode}`);
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
