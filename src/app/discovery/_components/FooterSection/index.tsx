import { FOOTER_SECTION, SOCIAL_MEDIA } from '@/constants/Home/index.en';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateAdapter';
import { Footer } from '@/app/official/_components/Footer';
import { Trans } from '@lingui/react/macro';
import { ChevronRight } from 'lucide-react';

const FooterSection = () => {
  const content = {
    FOOTER_SECTION,
    SOCIAL_MEDIA,
  };

  const navigateTo = useStrictNavigationAdapter();

  return (
    <>
      <section className="flex flex-col bg-yellow-bright-01">
        <div className="flex flex-col gap-6 border-y border-black-text-01 px-6 py-10">
          <Trans>
            <h1 className="text-h1 font-bold text-black-text-01">
              Your lists say more than posts ever could.
            </h1>

            <div
              className="flex flex-row items-center gap-2"
              onClick={() => navigateTo.official()}
            >
              <p className="text-h1 font-bold text-black-text-01">
                Next wave of content
              </p>
              <ChevronRight className="h-5 w-5" />
            </div>
          </Trans>
        </div>
        <Footer
          content={content.FOOTER_SECTION}
          socialMedia={content.SOCIAL_MEDIA}
        />
      </section>
    </>
  );
};
export default FooterSection;
