import { DrawerProvider } from '@/components/Drawer';
import { FakePageProvider } from '@/components/FakePage';
import { LanguageProvider } from '@/lib/languageProvider';
import Background from './Components/Background';
import BottomNav from './Components/BottomNav';
import MainContent from './Components/MainContent';
import PromptText from './Components/PromptText';

export default function Layout() {
  return (
    <LanguageProvider>
      <DrawerProvider>
        <FakePageProvider>
          <Background />
          <div className="flex min-h-screen w-full items-center justify-center">
            <div className="relative flex w-full flex-col sm:w-mobile-max">
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
