import Footer from '@/components/Footer';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { t } from '@lingui/core/macro';
import BlocksSection from './BlocksSection';
import IntroSection from './IntroSection';

const SettingsPage: React.FC = () => {
  const { isLoggedIn } = useAuthStore();
  const { me } = useUserStore();
  const navigateTo = useStrictNavigationAdapter();

  const handleOnClose = () => {
    // FUTURE: if history is not empty, navigate to the previous page; otherwise, navigate to the user page
    if (isLoggedIn) {
      navigateTo.user(me.userCode);
    } else {
      navigateTo.discovery();
    }
  };

  return (
    // Your component code here
    <>
      <BackToUserHeader owner={me.id !== 0 ? me : undefined} />
      <IntroSection />
      <BlocksSection />
      <Footer onClose={handleOnClose} title={t`Setting Center`} />
    </>
  );
};

export default SettingsPage;
