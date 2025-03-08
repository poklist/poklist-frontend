import logo from '@/assets/images/logo-big.png';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import {
  FEATURE_SECTION,
  FOOTER_SECTION,
  HERO_SECTION,
  LIST_SECTION,
  SOCIAL_MEDIA,
  TUTORIAL_SECTION,
} from '@/constants/Home/index.en';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Divider } from './Components/Divider';
import { FeatureSection } from './Components/FeatureSection';
import { Footer } from './Components/Footer';
import Header from './Components/Header';
import { HeroSection } from './Components/HeroSection';
import { TutorialSection } from './Components/TutorialSection';

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
