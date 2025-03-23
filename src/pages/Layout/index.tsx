import { DrawerProvider } from '@/components/Drawer';
import { FakePageProvider } from '@/components/FakePage';
import { LanguageProvider } from '@/lib/languageProvider';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Background from './Components/Background';
import BottomNav from './Components/BottomNav';
import MainContent from './Components/MainContent';
import PromptText from './Components/PromptText';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectWhiteList = ['/home', '/error', '/goToMobile'];

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    if (!isMobile && !redirectWhiteList.includes(location.pathname)) {
      navigate('/goToMobile');
    }
  }, [location.pathname]);

  return (
    <LanguageProvider>
      <DrawerProvider>
        <FakePageProvider>
          <Background />
          <div className="flex flex-col items-center justify-center">
            <div className="flex max-h-screen w-full flex-col sm:w-mobile-max">
              <PromptText />
              <MainContent />
              <BottomNav />
            </div>
          </div>
        </FakePageProvider>
      </DrawerProvider>
    </LanguageProvider>
  );
}
