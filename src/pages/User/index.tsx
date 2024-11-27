import MobileContainer from '@/components/ui/containers/MobileContainer';
import axios from '@/lib/axios';
import useUserStore from '@/stores/useUserStore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from './Header';

interface UserPageProps {
  // Add any props you need for the page
}

const UserPage: React.FC<UserPageProps> = () => {
  const { id } = useParams();
  const { isLoggedIn, setUser } = useUserStore();
  const [isMyPage, setIsMyPage] = useState(false);

  const getUser = () => {
    let userID = id;
    if (id === undefined) {
      userID = 'me';
      setIsMyPage(true);
    }

    axios.get(`/users/${userID}`).then(async (res: any) => {
      setUser(res.data);
    });
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    // Your component code here
    <MobileContainer>
      <Header isLoggedIn={isLoggedIn} isMyPage={isMyPage} />
    </MobileContainer>
  );
};

export default UserPage;
