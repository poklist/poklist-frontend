import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconCamera } from '@/components/ui/icons/CameraIcon';
import useUserStore from '@/stores/useUserStore';

const UploadProfileImageSection: React.FC = () => {
  const { user } = useUserStore();

  const openUploadOptions = () => {}; // TODO:

  return (
    <div id="profile-image" className="flex items-end justify-center pt-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={user.profileImage} />
        <AvatarFallback>{user.displayName[0]}</AvatarFallback>
      </Avatar>
      <div
        className="z-10 -ml-8 flex h-8 w-8 items-center justify-center rounded-full border border-black-text-01 bg-white"
        onClick={openUploadOptions}
      >
        <IconCamera />
      </div>
    </div>
  );
};

export default UploadProfileImageSection;
