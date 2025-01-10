import { LIST_SECTION } from '@/constants/home';

export const Tutorial = () => (
  <section className="flex flex-col gap-8 bg-yellow-bright-01 p-8">
    <div className="w-full text-start">
      <h1 className="mb-4 text-2xl font-bold">{LIST_SECTION.tutorial.title}</h1>
      <h2 className="text-[17px] font-bold">
        {LIST_SECTION.tutorial.description}
      </h2>
      <button className="mt-4 w-full rounded-lg bg-black px-4 py-2 text-white">
        {LIST_SECTION.tutorial.buttonText}
      </button>
    </div>
  </section>
);
