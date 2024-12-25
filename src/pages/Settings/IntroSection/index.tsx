import { Button } from '@/components/ui/button';

const IntroSection: React.FC = () => {
  return (
    <div
      id="intro-to-poklist"
      className="flex flex-col gap-6 px-4 pt-6 text-[15px]"
    >
      <p>List Your World.</p>
      <p>
        From secret coffee spots and must-have skincare, to binge-worthy shows
        and game-changing life hacks—create, explore, and share your top picks
        with the world.
      </p>
      <p>
        🚀 <strong>We’re in Beta</strong> and want you to be part of the
        journey! Join us, shape the platform, and help us reach the next level.
      </p>
      <Button variant="black" size="md" className="w-fit self-end">
        ✨ Sign up now and start listing!
      </Button>
    </div>
  );
};

export default IntroSection;
