import useStrictNavigate from '@/hooks/useStrictNavigate';
import { Outlet, useParams } from 'react-router-dom';

export interface UserRouteLayoutContextType {
  userCode: string;
}

export default function UserRouteLayout() {
  const { userCode: rawUserCode } = useParams();
  const navigateTo = useStrictNavigate();

  if (!rawUserCode?.startsWith('@')) {
    // Prevent capturing userCode that does not start with @, such as conflicting with /home or /settings
    navigateTo.error();
  }

  // ✅ Pass to context or props etc.: Remove the prefix @
  const cleanUserCode = rawUserCode?.slice(1);

  // You can also use context to pass cleanUserCode to the child pages inside Outlet
  return (
    <div>
      {/* Can put user profile layout */}
      <Outlet context={{ userCode: cleanUserCode }} />
    </div>
  );
}
