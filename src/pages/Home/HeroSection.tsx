import type { CSSProperties } from 'react';
import { Button } from '@/components/ui/button';
import { InstagramIcon } from '@/components/ui/icons/InstagramIcon';
import { TikTokIcon } from '@/components/ui/icons/TikTokIcon';
import { XIcon } from '@/components/ui/icons/XIcon';

export default function HeroSection() {
  return (
    <div className="flex h-screen flex-col items-center pt-5">
      <div
        id="user-id"
        style={{ '--secondary-tint': '0, 0%, 95%' } as CSSProperties}
        className="mb-5 rounded-md bg-secondary-tint px-2 py-0.5"
      >
        <span className="text-sm">@tview</span>
      </div>
      <div id="profile-picture">
        <img
          src="https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/44/4418a705c2c414dadb30c25de8bb2f7805007093_full.jpg"
          alt="profile-picture"
          className="h-40 w-40 rounded-full"
        />
      </div>
      <div
        id="user-brief"
        className="flex flex-col items-center gap-[18px] pt-5"
      >
        <span className="text-2xl font-bold">生活可以很無聊</span>
        <span className="text-pretty text-center text-[15px]">
          生活可以很無聊，但生命可以很精彩。乾啦！
        </span>
      </div>
      <div id="user-stats" className="flex gap-2 pt-5">
        <div className="leading-2 flex items-center gap-[6px] text-[15px]">
          <span className="font-bold">18</span>
          <span className="">名單</span>
        </div>
        <div className="leading-2 flex items-center gap-[6px] text-[15px]">
          <span className="font-bold">24</span>
          <span className="">粉絲</span>
        </div>
        <div className="leading-2 flex items-center gap-[6px] text-[15px]">
          <span className="font-bold">416</span>
          <span className="">正追蹤</span>
        </div>
      </div>
      <Button className="mt-5 rounded-full px-8 py-4">
        <span className="fw-400 text-[15px]">追蹤</span>
      </Button>
      <div id="social-links" className="flex gap-2 pt-5">
        <Button variant="ghost">
          <a href="https://www.instagram.com">
            <InstagramIcon className="h-8 w-8 rounded-full" />
          </a>
        </Button>
        <Button variant="ghost">
          <a href="https://www.tiktok.com">
            <TikTokIcon className="h-8 w-8 rounded-full" />
          </a>
        </Button>
        <Button variant="ghost">
          <a href="https://www.x.com">
            <XIcon className="h-8 w-8 rounded-full" />
          </a>
        </Button>
      </div>
    </div>
  );
}
