import useCommonStore from '@/stores/useCommonStore';
import React, { useEffect } from 'react';
import { DrawerComponent, useDrawer } from '../Drawer';

export interface IErrorDrawerMessage {
  title: string;
  content: string;
}

// 錯誤抽屜的唯一ID
export const ERROR_DRAWER_ID = 'error-drawer';

export const ErrorDrawer: React.FC = () => {
  const { errorDrawerMessage, setErrorDrawerMessage } = useCommonStore();
  const { openDrawer, closeDrawer } = useDrawer(ERROR_DRAWER_ID);

  // 當errorDrawerMessage有內容時，打開抽屜
  useEffect(() => {
    if (errorDrawerMessage.title || errorDrawerMessage.content) {
      openDrawer();
    }
  }, [errorDrawerMessage, openDrawer]);

  // 當抽屜關閉時，清除錯誤訊息
  const handleClose = () => {
    closeDrawer();
    // 清除錯誤訊息
    setErrorDrawerMessage({ title: '', content: '' });
  };

  // 如果沒有錯誤訊息內容，則不渲染抽屜
  if (!errorDrawerMessage.title && !errorDrawerMessage.content) {
    return null;
  }

  return (
    <DrawerComponent
      drawerId={ERROR_DRAWER_ID}
      isShowClose={true}
      header={errorDrawerMessage.title}
      subHeader={errorDrawerMessage.content}
      // 提供自定義的關閉處理函數
      onClose={handleClose}
    />
  );
};
