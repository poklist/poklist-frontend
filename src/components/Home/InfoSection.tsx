import { LIST_SECTION } from '@/constants/home';
import mascotSmall from '@/assets/images/mascot/mascot-small.svg';

export const InfoSection = () => (
  <section className="flex flex-col gap-8 bg-yellow-bright-01 px-4 py-12">
    <div className="container mx-auto text-start">
      <h1 className="text-4xl font-extrabold">{LIST_SECTION.title}</h1>
      <p className="text-lg font-extrabold">{LIST_SECTION.description}</p>
    </div>

    <div className="container mx-auto flex flex-col gap-6 md:flex-row">
      {LIST_SECTION.series.map((item) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 rounded-lg py-6 text-start"
        >
          <h1 className="text-4xl font-extrabold">{item.title}</h1>
          <div className="flex h-[160px] items-center justify-center rounded-lg bg-smart-purple p-2">
            <img src={mascotSmall} alt={item.title} className="h-12 w-12" />
          </div>
          <p className="text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  </section>
);
