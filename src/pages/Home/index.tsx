import { Button } from '@/components/ui/button';
import MainContainer from '@/components/ui/containers/MainContainer';
import SiteFooter from '@/components/ui/SiteFooter';
import { UserResponse } from '@/types/payload';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from './HeroSection';

export default function Home() {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const [user, setUser] = useState<UserResponse>();

  const getMe = () => {
    fetch(`${baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    }).then(async (res) => {
      const body = await res.json();
      setUser(body);
    });
  };

  const getMyLists = () => {
    fetch(`${baseUrl}/lists`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('accessToken'),
      },
    }).then(async (res) => {
      const body = await res.json();
      console.log('my lists:', body);
    });
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <MainContainer>
      <Link to="/" className="contents">
        <Button variant="outline" className="mt-5 self-start hover:bg-gray-100">
          Logout
        </Button>
      </Link>
      <Button className="mt-5 self-start" onClick={getMyLists}>
        Test Get Lists
      </Button>
      <HeroSection user={user} />
      <SiteFooter floatingBtnTxts={['喜歡', '轉單', '分享']} />
    </MainContainer>
  );
}
