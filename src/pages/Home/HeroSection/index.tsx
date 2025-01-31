import { useNavigate } from 'react-router-dom';
import useUserStore from '@/stores/useUserStore';
import { ChevronRight } from 'lucide-react';
import { HeroSectionContent } from '@/types/Home';
import { useGoogleOneTapLogin, CredentialResponse } from '@react-oauth/google';
import { useState, useEffect } from 'react';
import axios from '@/lib/axios';
import { IResponse } from '@/types/response';
import { User } from '@/types/User';

interface HeroSectionProps {
  content: HeroSectionContent;
}

export interface ILoginRequest {
  idToken: string;
}

export interface LoginInfo {
  accessToken: string;
  user: User;
}

export const HeroSection = ({ content }: HeroSectionProps) => {
  const navigate = useNavigate();
  const { login, setUser, isLoggedIn, user } = useUserStore();
  const [showGoogleLogin, setShowGoogleLogin] = useState(false);

  useGoogleOneTapLogin({
    onSuccess: async (credentialResponse: CredentialResponse) => {
      try {
        const res = await axios.post<IResponse<LoginInfo>>('/auth/google', {
          idToken: credentialResponse.credential,
        });
        if (!res.data.content?.accessToken) {
          throw new Error('No access token');
        }
        login(res.data.content?.accessToken);
        const userData = res.data.content?.user;
        setUser(userData);
        navigate(`/${userData.userCode}`);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    onError: () => {
      console.log('Login Failed');
      setShowGoogleLogin(false);
    },
    disabled: !showGoogleLogin,
  });

  useEffect(() => {
    if (showGoogleLogin) {
      // 強制重新初始化 Google One Tap
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [showGoogleLogin]);

  const handleSignIn = () => {
    // 如果已經登入且有 userCode，則導向該用戶的頁面
    if (isLoggedIn && user?.userCode) {
      navigate(`/${user.userCode}`);
    } else {
      setShowGoogleLogin(true);
    }
  };

  return (
    <section className="relative flex flex-1 items-center justify-center">
      <div className="z-10 flex w-full justify-center px-8 pb-10 pt-24">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <h2 className="text-h2 font-bold text-black-text-01">
                {content.joinInformation.title}
              </h2>
              <p className="text-t1 text-black-text-01">
                {content.joinInformation.descriprion}
              </p>
            </div>
            <button
              onClick={() => {}}
              className="w-full rounded-lg border border-black bg-yellow-bright-01 px-8 py-2 text-h2 font-bold text-black-text-01 md:w-auto"
            >
              {content.joinInformation.buttonText}
            </button>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-h2 font-bold text-black-text-01">
              {content.accountOwner.title}
            </p>
            <button
              onClick={handleSignIn}
              className="w-full rounded-lg border border-white bg-black px-8 py-2 text-[17px] font-bold text-white md:w-auto"
            >
              {content.accountOwner.buttonText}
            </button>
          </div>
          <div
            className="flex cursor-pointer items-center"
            onClick={() =>
              (window.location.href = content.nonCreatorQuestion.url || '#')
            }
          >
            <h2 className="text-h2 font-bold">
              {content.nonCreatorQuestion.title}
            </h2>
            <ChevronRight className="ml-3 h-5 w-5" />
          </div>
        </div>
      </div>
    </section>
  );
};
