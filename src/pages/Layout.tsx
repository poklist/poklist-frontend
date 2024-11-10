import AlertComponent from '@/components/ui/Alert';
// import { DrawerProvider } from '@/components/ui/Drawer';
import { LanguageProvider, LanguageSelector } from '@/lib/languageProvider';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  // const navigate = useNavigate();
  // const logout = () => {
  //   localStorage.removeItem('token');
  //   navigate('/');
  // };
  return (
    <LanguageProvider>
      {/* <DrawerProvider> */}
      <AlertComponent />
      <LanguageSelector />
      <Outlet />
      {/* </DrawerProvider> */}
    </LanguageProvider>
  );
}
