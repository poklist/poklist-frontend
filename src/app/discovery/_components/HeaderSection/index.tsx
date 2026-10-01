import { ExternalLinks } from '@/constants/externalLink';
import { useLogin } from '@/hooks/useLogin';
import { openWindow } from '@/lib/openLink';
import useAuthStore from '@/stores/useAuthStore';
import '@/types/global';
import { i18n } from '@lingui/core';
import { Trans } from '@lingui/macro';
import { GoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';

export const HeaderSection = () => {
  const { isLoggedIn } = useAuthStore();
  const { handleLogin, handleLoginError } = useLogin();
  const [buttonWidth, setButtonWidth] = useState(376);

  useEffect(() => {
    const updateWidth = () => {
      setButtonWidth(window.innerWidth - 144);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Clean up Google account resources
  useEffect(() => {
    return () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.cancel();
      }
    };
  }, [isLoggedIn]);

  return (
    <section className="flex flex-1 items-center justify-center bg-yellow-bright-01">
      <div className="flex w-full flex-col justify-center gap-6 px-6 pb-8 pt-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-h1 font-bold text-black-text-01">
            <Trans>好料都在我的口袋名單</Trans>
          </h1>
          <p className="text-t1 text-black-text-01">
            <Trans>免費登入 立即體驗</Trans>
          </p>
        </div>
        <div className="mx-12 flex flex-col gap-2 rounded-full ring-1 ring-black">
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              void handleLogin(credentialResponse);
            }}
            onError={handleLoginError}
            useOneTap={false}
            type="standard"
            theme="outline"
            size="large"
            text="signin_with"
            shape="pill"
            width={buttonWidth.toString()}
          />
        </div>
        <div className="bg-yellow-bright-01 px-6 text-center text-t2 text-black-text-01">
          <Trans>
            登入或註冊即表示您已閱讀並同意我們的
            <span
              className={
                'cursor-pointer text-black-text-01' +
                (i18n.locale === 'en' ? ' underline decoration-[#909090]' : '')
              }
              onClick={() => openWindow(ExternalLinks.TERMS)}
            >
              《使用者條款》
            </span>
            與
            <span
              className={
                'cursor-pointer text-black-text-01' +
                (i18n.locale === 'en' ? ' underline decoration-[#909090]' : '')
              }
              onClick={() => openWindow(ExternalLinks.PRIVACY)}
            >
              《隱私權保護政策》
            </span>
            ，並確認您已年滿 13 歲。
          </Trans>
        </div>
      </div>
    </section>
  );
};
