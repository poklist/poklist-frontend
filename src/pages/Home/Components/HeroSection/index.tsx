import useStrictNavigate from '@/hooks/useStrictNavigate';
import axios from '@/lib/axios';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import '@/types/global';
import { HeroSectionProps, LoginInfo } from '@/types/Home';
import { IResponse } from '@/types/response';
import { Trans } from '@lingui/react';
import { CredentialResponse } from '@react-oauth/google';
import { ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LoginErrorDialog } from '../ErrorDialog';
import { LoginDrawer } from '../LoginDrawer';
export const HeroSection = ({ content }: HeroSectionProps) => {
  const navigateTo = useStrictNavigate();
  const { login, isLoggedIn } = useAuthStore();
  const { setMe, me } = useUserStore();
  const [showCustomLogin, setShowCustomLogin] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  const handleGoogleLogin = async (response: CredentialResponse) => {
    try {
      const res = await axios.post<IResponse<LoginInfo>>('/auth/google', {
        idToken: response.credential,
      });
      if (!res.data.content?.accessToken) {
        throw new Error('No access token');
      }
      login(res.data.content?.accessToken);
      const userData = res.data.content?.user;
      setMe(userData);
      setShowCustomLogin(false);
      navigateTo.user(userData.userCode);
    } catch (error) {
      setShowCustomLogin(false);
      setShowErrorDialog(true);
    }
  };

  // 初始化 Google One Tap
  useEffect(() => {
    const initializeGoogleOneTap = () => {
      if (!scriptRef.current) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
              client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
              callback: handleGoogleLogin,
            });
            // 自動顯示 One Tap
            window.google.accounts.id.prompt();
          }
        };
        scriptRef.current = script;
        document.body.appendChild(script);
      }
    };

    if (!isLoggedIn) {
      initializeGoogleOneTap();
    }

    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [isLoggedIn]);

  const handleSignIn = () => {
    if (isLoggedIn && me?.userCode) {
      navigateTo.user(me.userCode);
    } else {
      setShowCustomLogin(true);
    }
  };

  return (
    <>
      <LoginDrawer
        isOpen={showCustomLogin}
        onClose={() => setShowCustomLogin(false)}
        onLogin={handleGoogleLogin}
        onError={() => setShowErrorDialog(true)}
      />

      <LoginErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        onClose={() => setShowCustomLogin(false)}
      />

      <section className="relative flex flex-1 items-center justify-center">
        <div className="z-10 flex w-full justify-center px-8 py-10">
          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <h2 className="text-h2 font-bold text-black-text-01">
                  <Trans
                    id={content.joinInformation.title.id}
                    message={content.joinInformation.title.message}
                  />
                </h2>
                <p className="text-t1 text-black-text-01">
                  <Trans
                    id={content.joinInformation.descriprion.id}
                    message={content.joinInformation.descriprion.message}
                  />
                </p>
              </div>
              <button
                onClick={() =>
                  window.open(
                    'https://opaque-creek-8e5.notion.site/Sign-up-1b0a4cd4b98b80c99c48e78b69b1b0f3',
                    '_blank'
                  )
                }
                className="w-full rounded-lg border border-black bg-yellow-bright-01 px-8 py-2 text-h2 font-bold text-black-text-01 md:w-auto"
              >
                <Trans
                  id={content.joinInformation.buttonText.id}
                  message={content.joinInformation.buttonText.message}
                />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleSignIn}
                className="w-full rounded-lg border border-white bg-black px-8 py-2 text-[17px] font-bold text-white md:w-auto"
              >
                <Trans
                  id={content.accountOwner.buttonText.id}
                  message={content.accountOwner.buttonText.message}
                />
              </button>
            </div>
            <div
              className="flex cursor-pointer items-center"
              onClick={() =>
                (window.location.href = content.nonCreatorQuestion.url || '#')
              }
            >
              <h2 className="text-h2 font-bold">
                <Trans
                  id={content.nonCreatorQuestion.title.id}
                  message={content.nonCreatorQuestion.title.message}
                />
              </h2>
              <ChevronRight className="ml-3 h-5 w-5" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
