import { LIST_SECTION } from '@/constants/home';
import mascotSmall from '@/assets/images/mascot/mascot-small.svg';

export const InfoSection = () => (
  <section className="flex flex-col gap-8 bg-yellow-bright-01 px-8 py-12">
    <div className="w-full text-start">
      <h1 className="pb-2 text-2xl font-bold">{LIST_SECTION.title}</h1>
      <h2 className="text-[17px] font-bold">{LIST_SECTION.description}</h2>
    </div>

    <div className="flex w-full flex-col justify-between gap-6 md:flex-row">
      {LIST_SECTION.series.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-2 rounded-lg py-4 text-start"
        >
          <h1 className="text-[26px] font-bold">{item.title}</h1>
          <div className="flex h-[160px] items-center justify-center rounded-lg bg-smart-purple px-2 py-1">
            <img src={mascotSmall} alt={item.title} className="h-12 w-12" />
          </div>
          <p className="text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);
