import React from 'react';

export const TileBackground: React.FC = () => {
  return (
    // TODO: height issue
    <div className="absolute z-0 h-full bg-user-page-grid bg-1% bg-[-0.1px] opacity-25" />
  );
};
// TODO: dynamic opacity not working

export const Tile20Background: React.FC = () => {
  return (
    // TODO: height issue
    <div className="absolute z-0 h-full bg-user-page-grid bg-1% bg-[-0.1px] opacity-20" />
  );
};
