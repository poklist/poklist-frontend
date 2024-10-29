import { Button } from '@/components/ui/button';
import MainContainer from '@/components/ui/containers/MainContainer';
import SiteFooter from '@/components/ui/SiteFooter';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';

export default function Home() {
  return (
    <MainContainer>
      <Link to="/" className="contents">
        <Button variant="outline" className="mt-5 self-start hover:bg-gray-100">
          Logout
        </Button>
      </Link>
      <HeroSection />
      <SiteFooter floatingBtnTxts={['喜歡', '轉單', '分享']} />
    </MainContainer>
  );
}
