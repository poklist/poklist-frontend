import { FooterLink, SocialMediaLink } from '@/types/Home';
import { Trans } from '@lingui/react';

interface FooterProps {
  content: FooterLink[];
  socialMedia: SocialMediaLink[];
}

export const Footer = ({ content, socialMedia }: FooterProps) => (
  <section className="flex w-full flex-col bg-yellow-bright-01 px-8 pb-20 pt-2">
    <div className="w-full">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-col">
          <div className="mb-8 flex flex-col items-start gap-3">
            {content.map((item) => (
              <a
                key={item.title.id}
                href={item.url || '#'}
                className="text-h2 hover:underline"
              >
                <Trans id={item.title.id} message={item.title.message} />
              </a>
            ))}
          </div>
          <div className="flex gap-8">
            {socialMedia.map((item) => (
              <a
                key={item.name}
                href={item.url}
                className="flex size-8 justify-center rounded-full bg-black"
              >
                <img src={item.icon} alt={item.name} className="size-fit" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
