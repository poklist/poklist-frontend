import { useEffect, useState } from 'react';
import { Header } from '../../components/Home/Header';
import { HeroSection } from '../../components/Home/HeroSection';
import { InfoSection } from '../../components/Home/InfoSection';
import { Footer } from '../../components/Home/Footer';
import { Divider } from '../../components/Home/Divider';
import logo from '@/assets/images/logo-big.svg';
import { LIST_SECTION } from '@/constants/home';

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

        <section className="flex flex-col gap-8 bg-yellow-bright-01 p-8">
          <div className="w-full text-start">
            <h1 className="mb-4 text-2xl font-bold">
              {LIST_SECTION.tutorial.title}
            </h1>
            <h2 className="text-[17px] font-bold">
              {LIST_SECTION.tutorial.description}
            </h2>
            <button className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-white">
              {LIST_SECTION.tutorial.buttonText}
            </button>
          </div>
        </section>
        <Divider />

        <Footer />
      </main>
    </div>
  );
}
