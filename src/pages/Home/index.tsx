import { Button } from '@/components/ui/button';
import MainContainer from '@/components/ui/containers/MainContainer';
import { Link } from 'react-router-dom';
import FooterComponent from '../User/Footer';
import OldHeroSection from './OldHeroSection';

export default function Home() {
  return (
    <MainContainer>
      <Link to="/" className="contents">
        <Button variant="white" className="mt-5 self-start hover:bg-gray-100">
          Logout
        </Button>
      </Link>
      <OldHeroSection />
      {/* <SiteFooter floatingBtnTxts={['喜歡', '轉單', '分享']} /> */}
      <FooterComponent />
    </MainContainer>
  );
}
