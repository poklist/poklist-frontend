import { useEffect, useState } from 'react';
import { Header } from '../../components/Home/Header';
import { HeroSection } from '../../components/Home/HeroSection';
import { InfoSection } from '../../components/Home/InfoSection';
import { Footer } from '../../components/Home/Footer';
import { Divider } from '../../components/Home/Divider';
import { Tutorial } from '../../components/Home/Tutorial';
import logo from '@/assets/images/logo-big.svg';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <Header isScrolled={isScrolled} onSignInClick={scrollToTop} />

      <main className="flex min-h-screen flex-col">
        <HeroSection />

        <div className="w-full bg-yellow-bright-01">
          <div className="h-px bg-black" />
        </div>

        <section className="flex w-full flex-col items-center justify-center bg-yellow-bright-01 pt-[72px]">
          <img src={logo} alt="Poklist Logo" className="h-24" />
        </section>

        <InfoSection />
        <Divider />
        <Tutorial />
        <Divider />
        <Footer />
      </main>
    </div>
  );
}
