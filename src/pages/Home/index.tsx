import MainContainer from '@/components/ui/containers/MainContainer';
import HeroSection from './HeroSection';

export default function Home() {
  return (
    <MainContainer isLoginPage={false}>
      <HeroSection />
    </MainContainer>
  );
}
