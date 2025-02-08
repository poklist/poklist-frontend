import { GoogleLogin } from '@react-oauth/google';
import { Trans } from '@lingui/macro';
import { LoginDrawerProps } from '@/types/Home';
import { X } from 'lucide-react';

export const LoginDrawer = ({ isOpen, onClose, onLogin }: LoginDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="fixed bottom-0 left-0 right-0 rounded-t-lg bg-white md:bottom-auto md:left-auto md:right-4 md:top-4 md:w-[400px] md:rounded-lg"
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
        <div className="p-3">
          <GoogleLogin
            onSuccess={onLogin}
            onError={() => {
              console.log('Login Failed');
              onClose();
            }}
            useOneTap={false}
            type="standard"
            theme="outline"
            size="large"
            text="signin_with"
            shape="rectangular"
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};
