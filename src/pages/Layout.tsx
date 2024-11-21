import AlertComponent from '@/components/Alert';
import { DrawerProvider } from '@/components/Drawer';
import LoadingSpinner from '@/components/Loading';
import { LanguageProvider } from '@/lib/languageProvider';
import useCommonStore from '@/stores/useCommonStore';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  const { isLoading } = useCommonStore();
  // const navigate = useNavigate();
  // const logout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/');
  // };
  return (
    <LanguageProvider>
      <DrawerProvider>
        <AlertComponent />
        {/* <LanguageSelector /> */}
        <Outlet />
        <LoadingSpinner isLoading={isLoading} />
      </DrawerProvider>
    </LanguageProvider>
  );
}
