import { ChevronRight } from 'lucide-react';
import { TutorialLink } from '@/types/Home';
import { Trans } from '@lingui/react';

interface TutorialProps {
  content: TutorialLink[];
}

export const TutorialSection = ({ content }: TutorialProps) => (
  <section className="flex flex-col gap-4 bg-yellow-bright-01 px-8 py-10">
    {content.map((item) => (
      <div
        key={item.title.id}
        className="flex cursor-pointer items-center"
        onClick={() => (window.location.href = item.url || '#')}
      >
        <h1 className="text-h1 font-bold">
          <Trans id={item.title.id} message={item.title.message} />
        </h1>
        <ChevronRight className="ml-3 h-5 w-5" />
      </div>
    ))}
  </section>
);
