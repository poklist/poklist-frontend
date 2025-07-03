// 以後Like, Block, Blacklist都可以用?
export const createOptimisticUpdateHandler = (
  delta: number,
  targetUserID: number,
  updateCache: (
    targetUserID: number,
    optimisticValue: boolean,
    countDelta: number
  ) => void
) => {
  const optimisticValue = delta > 0;
  const rollbackValue = !optimisticValue;

  return {
    optimisticUpdate: () => {
      updateCache(targetUserID, optimisticValue, delta);
    },
    rollback: () => {
      updateCache(targetUserID, rollbackValue, -delta);
    },
  };
};
