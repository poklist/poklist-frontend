import { ChevronRight } from 'lucide-react';
import { TutorialLink } from '@/types/Home';

interface TutorialProps {
  content: TutorialLink[];
}

export const Tutorial = ({ content }: TutorialProps) => (
  <section className="flex flex-col gap-4 bg-yellow-bright-01 px-8 py-10">
    {content.map((item) => (
      <div
        key={item.title}
        className="flex cursor-pointer items-center"
        onClick={() => (window.location.href = item.url || '#')}
      >
        <h1 className="text-h1 font-bold">{item.title}</h1>
        <ChevronRight className="ml-3 h-5 w-5" />
      </div>
    ))}
  </section>
);
