import { FooterLink, SocialMediaLink } from '@/types/Home';
import { Trans } from '@lingui/react';
import Image from 'next/image';

interface FooterProps {
  content: FooterLink[];
  socialMedia: SocialMediaLink[];
}

export const Footer = ({ content, socialMedia }: FooterProps) => (
  <section className="flex w-full flex-col bg-yellow-bright-01 px-8 pb-20">
    <div className="w-full">
      <div className="flex flex-col justify-between md:flex-row">
        <div className="flex flex-col">
          {/* Logo */}
          <div className="flex justify-start bg-yellow-bright-01 py-10">
            <Image
              src="/images/logo/logo-relist.svg"
              alt="Relist logo"
              width={110}
              height={24}
            />
          </div>
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
                target="_blank"
                className="flex size-8 justify-center rounded-full bg-black"
                rel="noreferrer"
              >
                <Image
                  src={item.icon.src}
                  alt={item.name}
                  className="size-fit"
                  width={32}
                  height={32}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);
