import { TileBackground } from '@/pages/User/TileBackground';
import { Trans } from '@lingui/react/macro';

interface SectionTitleProps {
  title: string;
  subtitle: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <header className="relative w-full border-y border-black">
      <TileBackground />
      <div className="relative z-10 flex flex-col items-start justify-center px-4 py-3">
        <Trans>
          <h1 className="text-[20px] font-bold text-black-text-01">{title}</h1>
          <h2 className="text-t1 text-black-text-01">{subtitle}</h2>
        </Trans>
      </div>
    </header>
  );
};

export default SectionTitle;
