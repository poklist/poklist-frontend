import { IMAGES } from '@/constants/Home/images';
import { Language } from '@/enums/index.enum';
import { FeatureListSection, FeatureSectionContent } from '@/types/Home';
import { MessageDescriptor } from '@lingui/core';
import { msg, t } from '@lingui/core/macro';
import { Trans, useLingui } from '@lingui/react';
import { StaticImageData } from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface FeatureSectionProps {
  content: FeatureSectionContent;
  listContent: FeatureListSection;
}

interface Category {
  key: string;
  label: MessageDescriptor;
}

const truncateText = (text: string, containerWidth: number, locale: string) => {
  // 根據語言設置不同的字符寬度
  const charWidth = locale === Language.ZH_TW.toString() ? 18 : 10; // 中文字符寬度較大
  // 根據容器寬度計算可顯示的字符數
  const maxChars = Math.floor((containerWidth - 40) / charWidth); // 減去一些 padding 和 margin

  // 設置最小和最大字符數限制
  const minChars = locale === Language.ZH_TW.toString() ? 18 : 35;
  const maxAllowedChars = locale === Language.ZH_TW.toString() ? 20 : 40;

  // 根據計算結果和限制來決定最終的字符數
  const finalMaxChars = Math.min(Math.max(maxChars, minChars), maxAllowedChars);

  return text.length > finalMaxChars
    ? text.slice(0, finalMaxChars) + '...'
    : text;
};

const getImageSrc = (imageData: StaticImageData | string): string => {
  return typeof imageData === 'string' ? imageData : imageData.src;
};

export const FeatureSection = ({
  content,
  listContent,
}: FeatureSectionProps) => {
  const { i18n } = useLingui();
  const [selectedCategory, setSelectedCategory] = useState('lifeStyle');
  const descriptionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const categories: Category[] = [
    { key: 'lifeStyle', label: msg`Life Style` },
    { key: 'foodAndDrink', label: msg`Food & Drink` },
    { key: 'culture', label: msg`Culture` },
    { key: 'travel', label: msg`Travel` },
    { key: 'entertainment', label: msg`Entertainment` },
    { key: 'techAndDigital', label: msg`Tech & Digital` },
    { key: 'personalGrowth', label: msg`Personal Growth` },
    { key: 'healthAndFitness', label: msg`Health & Fitness` },
    { key: 'other', label: msg`Other` },
  ];

  // preload all images
  useEffect(() => {
    const preloadImages = () => {
      // preload avatar images
      Object.values(IMAGES.avatar).forEach((imageData) => {
        const img = new Image();
        img.src = getImageSrc(imageData);
      });

      // preload list images
      Object.keys(IMAGES.list).forEach((category) => {
        Object.values(
          IMAGES.list[category as keyof typeof IMAGES.list]
        ).forEach((imageData) => {
          const img = new Image();
          img.src = getImageSrc(imageData);
        });
      });

      // preload feature images
      Object.values(IMAGES.feature).forEach((imageData) => {
        const img = new Image();
        img.src = getImageSrc(imageData);
      });
    };

    preloadImages();
  }, []);

  const selectedList =
    listContent[selectedCategory as keyof typeof listContent];

  const getTranslatedAndTruncated = useCallback(
    (descriptor: MessageDescriptor, index: number) => {
      const translated = i18n._(descriptor.id);
      const containerWidth = descriptionRefs.current[index]?.offsetWidth || 0;
      return truncateText(String(translated), containerWidth, i18n.locale);
    },
    [i18n, descriptionRefs]
  );

  // precalculate all description texts
  const truncatedDescriptions = useMemo(() => {
    return selectedList.lists.map((item, index) =>
      getTranslatedAndTruncated(item.description, index)
    );
  }, [selectedList.lists, getTranslatedAndTruncated]);

  return (
    <section className="relative flex flex-col bg-yellow-bright-01 px-4 pb-6 pt-6">
      {/* Feature Section Title */}
      <h1 className="text-center text-h1 font-extrabold">
        <Trans id={content.title.id} />
      </h1>
      <p className="mt-2 px-4 text-center text-h2 font-bold">
        <Trans id={content.description.id} />
      </p>

      {/* List Content */}
      <div className="mx-6 mb-4 mt-4 rounded-3xl border-[1px] border-black bg-white px-4 py-8">
        <div className="mb-4 flex items-center gap-1">
          <img
            src={getImageSrc(selectedList.userAvatar)}
            alt={selectedList.user.id}
            className="size-10 rounded-full"
          />
          <div>
            <p className="text-t2 font-bold">
              <Trans id={selectedList.user.id} />
            </p>
            <div className="flex items-center gap-1">
              <p className="text-t2">{selectedList.account}</p>
              <p className="text-t2">
                <strong>{selectedList.listCount}</strong> {t`Lists`}
              </p>
            </div>
          </div>
        </div>
        <h2 className="pb-2 text-[22px] font-bold">
          <Trans id={selectedList.listTitle.id} />
        </h2>
        <div className="my-4 h-px w-full bg-[#F1F1F1]" />
        <div className="flex flex-col gap-4">
          {selectedList.lists.map((item, index) => (
            <div key={item.id}>
              <div className="flex flex-row gap-1">
                <div className="flex flex-1 flex-col gap-1">
                  <p className="text-t1 font-bold">
                    <Trans id={item.title.id} />
                  </p>
                  <p
                    className="text-t2 text-gray-600"
                    ref={(el) => (descriptionRefs.current[index] = el)}
                  >
                    {truncatedDescriptions[index]}
                  </p>
                </div>
                <img
                  src={getImageSrc(item.image)}
                  alt={item.title.id}
                  className="size-10 self-end rounded-lg border border-black"
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
              selectedCategory === key ? 'bg-green-bright-01' : 'bg-white'
            }`}
          >
            <Trans id={label.id} />
          </button>
        ))}
      </div>
    </section>
  );
};
