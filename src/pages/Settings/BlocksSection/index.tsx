import { ILinksBlock } from '@/types/Settings';
import LinksBlock from './LinksBlock';

const BlocksSection: React.FC = () => {
  const openLanguageDrawer = () => {}; // TODO:
  const openLocactionDrawer = () => {}; // TODO:
  const blocks: ILinksBlock[] = [
    {
      title: 'Preference',
      actionItems: [
        {
          decription: 'Select your preferred language',
          action: openLanguageDrawer,
        },
        {
          decription: 'Select your location',
          action: openLocactionDrawer,
        },
      ],
    },
    {
      title: 'About Poklist',
      actionItems: [
        {
          decription: 'Quick start guide',
          // TODO:
        },
        {
          decription: 'Check out Poklist',
          // TODO:
        },
        {
          decription: 'Follow Poklist Threads',
          // TODO:
        },
        {
          decription: 'Join Poklist Discord',
          link: 'https://discord.gg/Jq2hSYUFJC',
        },
        {
          decription: 'Submit feedback or report content',
          // TODO:
        },
      ],
    },
    {
      title: 'Others',
      actionItems: [
        {
          decription: 'About Privacy Policy and Terms of Use',
          // TODO:
        },
        {
          decription: 'Contact us',
          // TODO:
        },
      ],
    },
  ];

  return (
    <div id="blocks" className="flex flex-col gap-10 px-4 py-10 text-[15px]">
      {blocks.map((block) => {
        return (
          <LinksBlock
            key={block.title}
            title={block.title}
            actionItems={block.actionItems}
          />
        );
      })}
    </div>
  );
};

export default BlocksSection;
