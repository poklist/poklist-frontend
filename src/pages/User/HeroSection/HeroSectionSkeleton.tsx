import { Avatar } from '@/components/ui/avatar';
import { Button, ButtonSize, ButtonVariant } from '@/components/ui/button';
import { Skeleton, Text } from '@radix-ui/themes';

export const HeroSectionSkeleton: React.FC = () => {
  return (
    <div role="hero" className="flex flex-col items-center gap-4 pb-4 pt-6">
      <div id="hero-basic-info" className="flex flex-col items-center gap-2">
        <Skeleton>
          <Avatar className="h-16 w-16"></Avatar>
        </Skeleton>
        <Text className="text-[17px] font-bold" as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>Baddie’s Struggles</Skeleton>
        </Text>
        <Text className="text-[13px] font-semibold" as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>@tview</Skeleton>
        </Text>
        <Text className="text-[13px] font-normal" as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>
            Baddie's Struggle” dives into life's highs and lows-fro...
          </Skeleton>
        </Text>
      </div>
      <div id="action-button">
        <Skeleton>
          <Button
            id="follow-button"
            variant={ButtonVariant.HIGHLIGHTED}
            size={ButtonSize.LG}
          >
            Follow
          </Button>
        </Skeleton>
      </div>
      <div id="hero-stats" className="flex gap-2">
        <Text as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>18 Lists</Skeleton>
        </Text>
        <Text as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>24 Follwers</Skeleton>
        </Text>
        <Text as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>416 Folowing</Skeleton>
        </Text>
        <Text as="p">
          {/* Just for skeleton, no need to translate */}
          <Skeleton>3 Links</Skeleton>
        </Text>
      </div>
    </div>
  );
};
