import AlertComponent from '@/components/Alert';
import { DrawerProvider } from '@/components/Drawer';
import { LanguageProvider } from '@/lib/languageProvider';
import { Outlet } from 'react-router-dom';

export default function Layout() {
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
      </DrawerProvider>
    </LanguageProvider>
  );
}
