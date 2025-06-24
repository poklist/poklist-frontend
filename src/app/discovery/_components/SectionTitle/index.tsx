import { TileBackground } from '@/pages/User/TileBackground';

interface SectionTitleProps {
  title: string;
  subtitle: string;
}

const SectionTitle = ({ title, subtitle }: SectionTitleProps) => {
  return (
    <header className="relative w-full border-y border-black">
      <TileBackground />
      <div className="relative flex flex-col items-start justify-center px-4 py-3">
        <h1 className="text-[20px] font-bold text-black-text-01">{title}</h1>
        <h2 className="text-t1 text-black-text-01">{subtitle}</h2>
      </div>
    </header>
  );
};

export default SectionTitle;
