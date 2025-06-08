import { DrawerIds } from '@/constants/Drawer';
import useCommonStore from '@/stores/useCommonStore';
import React, { useEffect } from 'react';
import { DrawerComponent } from '../Drawer';
import { useDrawer } from '../Drawer/useDrawer';

export interface IErrorDrawerMessage {
  title: string;
  content: string;
}

export const ErrorDrawer: React.FC = () => {
  const { errorDrawerMessage, setErrorDrawerMessage } = useCommonStore();
  const { openDrawer, closeDrawer } = useDrawer(DrawerIds.ERROR_DRAWER_ID);

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
      drawerId={DrawerIds.ERROR_DRAWER_ID}
      isShowClose={true}
      header={errorDrawerMessage.title}
      subHeader={errorDrawerMessage.content}
      // 提供自定義的關閉處理函數
      onClose={handleClose}
    />
  );
};
