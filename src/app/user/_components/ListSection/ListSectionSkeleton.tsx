import { Skeleton, Text } from '@radix-ui/themes';

export const ListSectionSkeleton: React.FC = () => {
  const placeholderStringList = [
    'One of those Unforgettable Tour Moments ...',
    'Some Essentials',
    'Songs that Inspired Me',
    'One of those Unforgettable Tour Moments ...',
    'Some Essentials',
    'Songs that Inspired Me',
  ];

  return (
    <div role="list-preview">
      {placeholderStringList.map((placeholder, index) => (
        <div
          key={index}
          className="flex min-h-[72px] items-center justify-between p-4 -tracking-1.1%"
        >
          <Text as="p" className="text-t1 font-semibold text-black-text-01">
            <Skeleton>{placeholder}</Skeleton>
          </Text>
          <Skeleton width="40px" height="40px" />
        </div>
      ))}
    </div>
  );
};
