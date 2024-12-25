import React from 'react';

interface IListInfoSectionProps {
  // Add any props you need for the page
}
export const ListInfoSection: React.FC<IListInfoSectionProps> = () => {
  const listTitle = '超快！自動化的 Tango';
  const listDescription =
    'Los Angeles at night is a food lover’s paradise. Whether you’re wrapping up a late shift or craving a post-party snack, this list of 8 spots has you covered. From classic American hot dogs to mouthwatering Mexican tacos and Korean BBQ food trucks, these picks are perfect for night owls. Discover the best places to satisfy your midnight cravings and enjoy LA’s vibrant late-night food scene.';
  return (
    <div className="flex flex-col justify-center gap-6 my-6">
      <div className="font-extrabold text-h1 text-center line-clamp-3">{listTitle}</div>
      <div className="text-t1 line-clamp-1 text-center font-normal">{listDescription}</div>
    </div>
  );
};
