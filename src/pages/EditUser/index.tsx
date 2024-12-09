import EditModeFooter from '@/components/Footer/EditModeFooter';
import { Header } from '@/components/Header';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { socialLinkStarterMap } from '@/constants/User';
import { urlPreview } from '@/lib/utils';
import useEditProfileStore from '@/stores/useEditProfileStore';
import { SocialLinkType } from '@/types/enum';
import UploadProfileImageSection from './UploadProfileImageSection';

interface EditUserPageProps {
  // Add any props you need for the page
}

const EditUserPage: React.FC<EditUserPageProps> = () => {
  const { newUserInfo } = useEditProfileStore();

  const socialLinkTypeList = Object.values(SocialLinkType);

  return (
    <MobileContainer>
      <Header type="back-to-user" />
      <UploadProfileImageSection />
      {/* Basic Info Section */}
      <div id="info-section" className="px-4 pt-10">
        <div className="py-2">
          <h2 className="text-[15px] font-semibold">Profile</h2>
        </div>
        <div className="flex h-16 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-2 text-[13px]">
          <p>Display Name</p>
          <p className="text-right text-gray-storm-01">
            {newUserInfo.displayName}
          </p>
        </div>
        <div className="flex h-16 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-2 text-[13px]">
          <p>Creator Code</p>
          <p className="text-right text-gray-storm-01">
            {newUserInfo.userCode}
          </p>
        </div>
        <div className="flex h-16 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-2 text-[13px]">
          <p>Bio</p>
          <p className="text-right text-gray-storm-01">
            {newUserInfo.bio /* TODO: Handle Preview */}
          </p>
        </div>
      </div>
      {/* Social Links Section */}
      <div id="links-section" className="px-4 pb-20 pt-10">
        <div className="py-2">
          <h2 className="text-[15px] font-semibold">Links</h2>
        </div>
        {socialLinkTypeList.map((linkType) => {
          console.log(newUserInfo.socialLinks);
          return (
            <div
              key={linkType}
              className="flex h-16 cursor-pointer items-center gap-2 border-t border-[#F6F6F6] px-2 text-[13px]"
            >
              <LinkIconWrapper variant={linkType} />
              {newUserInfo.socialLinks?.[linkType] ? (
                <p className="text-black-text-01">
                  {urlPreview(newUserInfo.socialLinks?.[linkType])}
                </p>
              ) : linkType === 'customized' ? (
                <p className="text-gray-storm-01">your.link</p>
              ) : (
                <div className="flex">
                  <p className="text-black-text-01">
                    {socialLinkStarterMap[linkType]}
                  </p>
                  <p className="text-gray-storm-01">your-account</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <EditModeFooter />
    </MobileContainer>
  );
};

export default EditUserPage;
