import MainContainer from '@/components/ui/containers/MainContainer';
import HeroSection from './HeroSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <MainContainer>
      <Link to="/" className="contents">
        <Button variant="outline" className="mt-5 self-start hover:bg-gray-100">
          Logout
        </Button>
      </Link>
      <HeroSection />
    </MainContainer>
  );
}
