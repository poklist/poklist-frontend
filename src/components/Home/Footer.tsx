import { Button } from '@/components/ui/button';
import logo from '@/assets/images/logo-big.svg';
import mascotBig from '@/assets/images/mascot/mascot-big.svg';
import instagramLogo from '@/assets/images/socialMedia/instgram-logo.svg';
import threadsLogo from '@/assets/images/socialMedia/threads-logo.svg';

export const Footer = () => (
  <section className="flex w-full flex-col bg-yellow-bright-01 p-8">
    <div className="w-full">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-col">
          <div className="mb-8 flex items-start">
            <img src={logo} alt="Poklist Logo" className="h-[45px]" />
          </div>
          <div className="mb-8 flex flex-col items-start gap-4">
            <a href="#" className="text-[17px] hover:underline">
              Press Contact
            </a>
            <a href="#" className="text-[17px] hover:underline">
              Contact Us
            </a>
            <a href="#" className="text-[17px] hover:underline">
              Privacy & Policy
            </a>
            <a href="#" className="text-[17px] hover:underline">
              Do Not Sell My Personal Information
            </a>
          </div>
          <div className="flex gap-4">
            <Button variant="white" size="icon" className="rounded-lg" asChild>
              <a href="#">
                <img src={instagramLogo} alt="Instagram" className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="white" size="icon" className="rounded-lg" asChild>
              <a href="#">
                <img src={threadsLogo} alt="Threads" className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
        <div className="flex justify-end md:items-end">
          <img src={mascotBig} alt="Poklist Mascot" className="h-60" />
        </div>
      </div>
    </div>
  </section>
);
