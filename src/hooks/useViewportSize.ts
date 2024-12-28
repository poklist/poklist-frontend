import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

const useBrowserLayoutEffect =
  typeof window === 'undefined'
    ? // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {}
    : useLayoutEffect;

type Size = { width: number; height: number };

/**
 * Get the current size of the Viewport. Do not call this excessively, as it may
 * cause performance issues in WebKit. Querying innerWidth/height triggers a
 * re-layout of the page.
 */
export const getViewportSize = (): Size => {
  if (window.visualViewport) {
    // https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
    return { width: window.visualViewport.width, height: window.visualViewport.height } as const;
  }

  // window.innerHeight gets updated when a user opens the soft keyboard, so it should be preferred over documentElement.clientHeight
  return { width: window.innerWidth, height: window.innerHeight } as const;
};

/**
 * Returns the viewport size. This can also be used as a dependency in a
 * useEffect to trigger an update when the browser resizes.
 */
const useViewportSize = () => {
  const [viewportSize, setViewportSize] = useState<Size | undefined>();
  const updateViewportSize = useCallback(() => {
    const viewportSize = getViewportSize();

    setViewportSize(oldViewportSize => {
      if (
        oldViewportSize &&
        oldViewportSize.width === viewportSize.width &&
        oldViewportSize.height === viewportSize.height
      ) {
        // Maintain old instance to prevent unnecessary updates
        return oldViewportSize;
      }

      return viewportSize;
    });
  }, []);
  useBrowserLayoutEffect(updateViewportSize, [updateViewportSize]);

  useEffect(() => {
    const effectTwice = () => {
      updateViewportSize();
      // Closing the OSK in iOS does not immediately update the visual viewport size
      setTimeout(updateViewportSize, 1000);
    };

    window.addEventListener('resize', effectTwice);
    // From the top of my head this used to be required for older browsers since this didn't trigger a resize event. Keeping it in to be safe.
    window.addEventListener('orientationchange', effectTwice);
    // This is needed on iOS to resize the viewport when the Virtual/OnScreen Keyboard opens. This does not trigger any other event, or the standard resize event.
    window.visualViewport?.addEventListener('resize', effectTwice);

    return () => {
      window.removeEventListener('resize', effectTwice);
      window.removeEventListener('orientationchange', effectTwice);
      window.visualViewport?.removeEventListener('resize', effectTwice);
    };
  }, [updateViewportSize]);

  return viewportSize;
};

export default useViewportSize;
