import { IMAGES } from '@/constants/Home/images';
import { useState } from 'react';
import logo from '@/assets/images/logo-big.png';
import { FeatureSectionContent, FeatureListSection } from '@/types/Home';

interface FeatureSectionProps {
  content: FeatureSectionContent;
  listContent: FeatureListSection;
}

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

export const FeatureSection = ({
  content,
  listContent,
}: FeatureSectionProps) => {
  const [selectedCategory, setSelectedCategory] = useState('lifeStyle');

  const categories = [
    { key: 'lifeStyle', label: '生活風格' },
    { key: 'foodAndDrink', label: '美食' },
    { key: 'culture', label: '文化' },
    { key: 'travel', label: '旅遊' },
    { key: 'entertainment', label: '娛樂' },
    { key: 'techAndDigital', label: '數位科技' },
    { key: 'personalGrowth', label: '個人成長' },
    { key: 'healthAndFitness', label: '健康與健身' },
    { key: 'other', label: '其他' },
  ];

  const selectedList =
    listContent[selectedCategory as keyof typeof listContent];

  return (
    <section className="relative flex flex-col gap-2 bg-yellow-bright-01 px-4 pb-6 pt-14">
      {/* Decorative Images */}
      <div id="decorative-images">
        <img
          src={IMAGES.feature.rightTop}
          alt=""
          className="absolute right-7 top-9 h-[42px] w-[54px]"
        />
        <img
          src={IMAGES.feature.rightMid}
          alt=""
          className="absolute right-12 top-[114px] h-[34px] w-[35px]"
        />
        <img
          src={IMAGES.feature.rightBottom}
          alt=""
          className="absolute right-6 top-64 h-11 w-11"
        />
        <img
          src={IMAGES.feature.midTop}
          alt=""
          className="absolute left-[166px] top-6 h-8 w-8"
        />
        <img
          src={IMAGES.feature.leftTop}
          alt=""
          className="absolute left-9 top-12 h-8 w-[37px]"
        />
        <img
          src={IMAGES.feature.leftMid}
          alt=""
          className="absolute left-4 top-[114px] h-20 w-20"
        />
        <img
          src={IMAGES.feature.leftBottom}
          alt=""
          className="absolute left-16 top-[17rem] h-14 w-14"
        />
      </div>

      {/* Logo */}
      <img
        src={logo}
        alt="Poklist Logo"
        className="z-10 h-24 w-60 self-center"
      />

      {/* Feature Section Title */}
      <h1 className="mt-4 text-center text-h1 font-bold">{content.title}</h1>
      <p className="mb-8 px-4 text-center text-h2 font-bold">
        {content.description}
      </p>

      {/* List Content */}
      <div className="mx-6 mb-4 mt-6 rounded-3xl border-[1px] border-black bg-white px-4 py-8">
        <div className="mb-4 flex items-center gap-1">
          <img
            src={selectedList.userAvatar}
            alt={selectedList.user}
            className="size-10 rounded-full"
          />
          <div>
            <p className="text-t2 font-bold">{selectedList.user}</p>
            <div className="flex items-center gap-1">
              <p className="text-t2">{selectedList.account}</p>
              <p className="text-t2">
                <strong>{selectedList.listCount}</strong> 名單
              </p>
            </div>
          </div>
        </div>
        <h2 className="pb-2 text-[22px] font-bold">{selectedList.listTitle}</h2>
        <div className="my-4 h-px w-full bg-[#F1F1F1]" />
        <div className="flex flex-col gap-4">
          {selectedList.lists.map((item) => (
            <div key={item.id} className="">
              <div className="flex flex-row gap-1">
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-t1 font-bold">{item.title}</p>
                  <p className="text-t2 text-gray-600">
                    {truncateText(item.description, 18)}
                  </p>
                </div>
                <img
                  src={item.image}
                  alt={item.title}
                  className="size-10 self-end"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Tags */}
      <div className="mx-6 flex flex-wrap items-center justify-center gap-2">
        {categories.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`rounded-lg border border-black p-1 text-t2 font-semibold text-black-text-01 ${
              selectedCategory === key ? 'bg-bright-green' : 'bg-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
