import Header from '@/components/Header';
import {
  FEATURE_SECTION,
  FOOTER_SECTION,
  LIST_SECTION,
  SOCIAL_MEDIA,
  TUTORIAL_SECTION,
} from '@/constants/Home/index.en';
import { Divider } from './Components/Divider';
import { FeatureSection } from './Components/FeatureSection';
import { Footer } from './Components/Footer';
import { TutorialSection } from './Components/TutorialSection';
import FloatingButtonFooter from '@/components/Footer/FloatingButtonFooter';

export default function Official() {
  const content = {
    FEATURE_SECTION,
    LIST_SECTION,
    TUTORIAL_SECTION,
    FOOTER_SECTION,
    SOCIAL_MEDIA,
  };

  return (
    <>
      <Header className="bg-transparent" />
      <main className="flex min-h-screen flex-col">
        <FeatureSection
          content={content.FEATURE_SECTION}
          listContent={content.LIST_SECTION}
        />
        <Divider />
        <TutorialSection content={content.TUTORIAL_SECTION} />
        <Divider />
        <Footer
          content={content.FOOTER_SECTION}
          socialMedia={content.SOCIAL_MEDIA}
        />
        <FloatingButtonFooter hasCreateListButton={false} />
      </main>
    </>
  );
}
