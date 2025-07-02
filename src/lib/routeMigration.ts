// 路由移轉工具函數
export const migrateUserRoute = (userCode: string): string => {
  // 移除@前綴，如果存在的話
  return userCode.startsWith('@') ? userCode.slice(1) : userCode;
};

export const isUserRoute = (pathname: string): boolean => {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return false;

  // 檢查是否為系統路由
  const systemRoutes = [
    'discovery',
    'official',
    'settings',
    'user',
    'list',
    'idea',
    'error',
    'goToMobile',
  ];
  return !systemRoutes.includes(segments[0]);
};

// 用於向後兼容的函數，保持@邏輯運作
export const addUserPrefix = (userCode: string): string => {
  return userCode.startsWith('@') ? userCode : `@${userCode}`;
};

// 檢查路由是否需要@前綴（向後兼容）
export const shouldHaveAtPrefix = (userCode: string): boolean => {
  return !userCode.startsWith('@');
};
