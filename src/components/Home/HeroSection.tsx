import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import { ChevronRight } from 'lucide-react';
import { HeroSectionContent } from '@/types/Home';

interface HeroSectionProps {
  content: HeroSectionContent;
}

export const HeroSection = ({ content }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useUserStore();

  const handleSignIn = () => {
    if (isLoggedIn && user.id) {
      navigate(`/${user.id}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative flex flex-1 items-center justify-center">
      <div className="z-10 flex w-full justify-center px-8 pb-10 pt-24">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h2 className="text-h2 font-bold text-black-text-01">
                {content.joinInformation.title}
              </h2>
              <p className="text-t1 text-black-text-01">
                {content.joinInformation.descriprion}
              </p>
            </div>
            <button
              onClick={() => {}}
              className="w-full rounded-lg border border-black bg-yellow-bright-01 px-8 py-2 text-h2 font-bold text-black-text-01 md:w-auto"
            >
              {content.joinInformation.buttonText}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-h2 font-bold text-black-text-01">
              {content.accountOwner.title}
            </p>
            <button
              onClick={handleSignIn}
              className="w-full rounded-lg border border-white bg-black px-8 py-2 text-[17px] font-bold text-white md:w-auto"
            >
              {content.accountOwner.buttonText}
            </button>
          </div>
          <div
            className="flex cursor-pointer items-center"
            onClick={() =>
              (window.location.href = content.nonCreatorQuestion.url || '#')
            }
          >
            <h2 className="text-h2 font-bold">
              {content.nonCreatorQuestion.title}
            </h2>
            <ChevronRight className="ml-3 h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
};
