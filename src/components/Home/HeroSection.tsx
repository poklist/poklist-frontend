import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative flex flex-1 items-center justify-center">
      <div className="absolute inset-0 bg-user-page-grid bg-0.3% bg-[-0.1px] opacity-25" />
      <div className="z-10 flex justify-center px-6 pb-14 pt-20">
        <div className="container mx-auto flex flex-col gap-6 md:max-w-2xl">
          <h1 className="text-4xl font-extrabold text-black-text-01">
            Interested in joining Poklist? Snatch a spot now.
          </h1>
          <button
            onClick={() => {}}
            className="w-full rounded-lg border border-black bg-yellow-bright-01 px-8 py-2 text-lg font-semibold text-black-text-01 md:w-auto"
          >
            Apply now
          </button>
          <p className="text-lg font-extrabold text-black-text-01">
            Already a Poklist Creator?
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-lg border border-white bg-black px-8 py-2 text-lg font-semibold text-white md:w-auto"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </section>
  );
};
