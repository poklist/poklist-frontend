import MobileContainer from '@/components/ui/containers/MobileContainer';
import axios from '@/lib/axios';
import { User } from '@/types/User';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from './Header';
import { HeroSection } from './HeroSection';

interface UserPageProps {
  // Add any props you need for the page
}

const UserPage: React.FC<UserPageProps> = () => {
  const { id } = useParams();
  const [viewUser, setViewUser] = useState<User>({
    id: 0,
    displayName: '',
    userCode: '',
  });

  const getUser = async () => {
    axios.get(`/users/${id}`).then((res: any) => {
      setViewUser({ ...res.data }); // deep copy
    });
  };

  useEffect(() => {
    getUser();
    console.log('enter');
  }, [id]);

  return (
    // Your component code here
    <MobileContainer>
      <Header />
      <HeroSection viewUser={viewUser} />
    </MobileContainer>
  );
};

export default UserPage;
