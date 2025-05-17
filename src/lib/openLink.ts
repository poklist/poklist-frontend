export const openWindow = (link: string | undefined) => {
  if (!link) {
    return;
  }
  window.open(link, '_blank', 'noopener,noreferrer');
};
