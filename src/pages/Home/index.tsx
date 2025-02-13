import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { FeatureSection } from './FeatureSection';
import { Footer } from './Footer';
import { Divider } from './Divider';
import { TutorialSection } from './TutorialSection';
import logo from '@/assets/images/logo-big.png';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
  HERO_SECTION,
  FEATURE_SECTION,
  LIST_SECTION,
  TUTORIAL_SECTION,
  FOOTER_SECTION,
  SOCIAL_MEDIA,
} from '@/constants/Home/index.en';

function HomeContent() {
  const content = {
    HERO_SECTION,
    FEATURE_SECTION,
    LIST_SECTION,
    TUTORIAL_SECTION,
    FOOTER_SECTION,
    SOCIAL_MEDIA,
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MobileContainer>
      <Header onSignInClick={scrollToTop} />
      <main className="flex min-h-screen flex-col">
        <HeroSection content={content.HERO_SECTION} />
        {/* Divider */}
        <div className="w-full bg-yellow-bright-01">
          <div className="h-px bg-black" />
        </div>
        <FeatureSection
          content={content.FEATURE_SECTION}
          listContent={content.LIST_SECTION}
        />
        <Divider />
        <TutorialSection content={content.TUTORIAL_SECTION} />
        <Divider />
        {/* Logo */}
        <div className="flex justify-center bg-yellow-bright-01 pb-4">
          <img src={logo} alt="Poklist Logo" className="h-[150.84px]" />
        </div>
        <Footer
          content={content.FOOTER_SECTION}
          socialMedia={content.SOCIAL_MEDIA}
        />
      </main>
    </MobileContainer>
  );
}

export default function Home() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <HomeContent />
    </GoogleOAuthProvider>
  );
}
