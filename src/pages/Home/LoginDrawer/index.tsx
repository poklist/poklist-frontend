import { GoogleLogin } from '@react-oauth/google';
import { Trans } from '@lingui/macro';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoginDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (response: any) => void;
  onError: () => void;
}

export const LoginDrawer = ({
  isOpen,
  onClose,
  onLogin,
  onError,
}: LoginDrawerProps) => {
  const [buttonWidth, setButtonWidth] = useState(376);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth <= 768) {
        // md breakpoint
        // 移動端: 螢幕寬度 - (2 * 12px padding)
        setButtonWidth(window.innerWidth - 24);
      } else {
        // 桌面端: 400px - (2 * 12px padding)
        setButtonWidth(376);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={onClose}
        >
          <div
            className="fixed bottom-0 left-1/2 w-mobile-max -translate-x-1/2 rounded-t-lg bg-white md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-[400px] md:max-w-mobile-max md:translate-x-0 md:rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-200 p-3">
              <p className="text-t2 text-gray-storm-01">
                <Trans>Sign in to Poklist with Google</Trans>
              </p>
              <button
                onClick={onClose}
                className="text-gray-storm-01 hover:text-gray-600"
                aria-label="關閉"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex justify-center p-3">
              <GoogleLogin
                onSuccess={onLogin}
                onError={() => {
                  console.log('Login Failed');
                  onError();
                }}
                useOneTap={false}
                type="standard"
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width={buttonWidth}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
