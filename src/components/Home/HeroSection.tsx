import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';

export const HeroSection = () => {
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
      <div className="absolute inset-0 bg-user-page-grid bg-0.3% bg-[-0.1px] opacity-25" />
      <div className="z-10 flex justify-center px-8 pb-8 pt-20">
        <div className="flex w-full flex-col gap-8 md:max-w-2xl">
          <div className="flex flex-col gap-4">
            <h1 className="text-[26px] font-bold text-black-text-01">
              Interested in joining Poklist? Snatch a spot now.
            </h1>
            <button
              onClick={() => {}}
              className="w-full rounded-lg border border-black bg-yellow-bright-01 px-8 py-2 text-[17px] font-bold text-black-text-01 md:w-auto"
            >
              Apply now
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[17px] font-extrabold text-black-text-01">
              Already a Poklist Creator?
            </p>
            <button
              onClick={handleSignIn}
              className="w-full rounded-lg border border-white bg-black px-8 py-2 text-[17px] font-bold text-white md:w-auto"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
