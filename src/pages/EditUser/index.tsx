import { useFakePage } from '@/components/FakePage';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import EditModeFooter from '@/components/Footer/EditModeFooter';
import { Header } from '@/components/Header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileContainer from '@/components/ui/containers/MobileContainer';
import { IconCamera } from '@/components/ui/icons/CameraIcon';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { socialLinkStarterMap } from '@/constants/User';
import { EditFieldVariant, FieldType } from '@/enums/EditField/index.enum';
import { SocialLinkType } from '@/enums/index.enum';
import axios from '@/lib/axios';
import { urlPreview } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import useEditProfileStore from '@/stores/useEditProfileStore';
import useUserStore from '@/stores/useUserStore';
import { IEditFieldConfig } from '@/types/EditField';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const {
    newUserInfo,
    resetNewUserInfo,
    setDisplayName,
    setProfileImage,
    setUserCode,
    setBio,
    setSocialLink,
    isModified,
  } = useEditProfileStore();
  const { setShowErrorDrawer } = useCommonStore(); // TODO:
  const { openFakePage, closeFakePage } = useFakePage();
  const socialLinkTypeList = Object.values(SocialLinkType);

  const fieldConfigMap: Record<FieldType | SocialLinkType, IEditFieldConfig> = {
    [FieldType.DISPLAY_NAME]: {
      fieldName: 'Name',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your name here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setDisplayName(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [FieldType.USER_CODE]: {
      fieldName: 'Username',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your username here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setUserCode(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [FieldType.BIO]: {
      fieldName: 'Bio',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your bio here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setBio(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [FieldType.PROFILE_IMAGE]: {
      fieldName: 'Profile Image',
      variant: EditFieldVariant.IMAGE,
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setProfileImage(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.CUSTOMIZED]: {
      fieldName: 'Customized Link',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your link here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setSocialLink(SocialLinkType.CUSTOMIZED, value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.INSTAGRAM]: {
      fieldName: 'Instagram',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your Instagram link here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setSocialLink(SocialLinkType.INSTAGRAM, value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.YOUTUBE]: {
      fieldName: 'YouTube',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your YouTube link here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setSocialLink(SocialLinkType.YOUTUBE, value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.TIKTOK]: {
      fieldName: 'TikTok',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your TikTok link here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setSocialLink(SocialLinkType.TIKTOK, value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.THREADS]: {
      fieldName: 'Threads',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your Threads link here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setSocialLink(SocialLinkType.THREADS, value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.LINKEDIN]: {
      fieldName: 'LinkedIn',
      variant: EditFieldVariant.TEXT,
      placeholder: 'Enter your LinkedIn link here',
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setSocialLink(SocialLinkType.LINKEDIN, value);
        } else {
          console.log('value is undefined');
        }
      },
    },
  };

  const [fieldConfig, setFieldConfig] = useState<IEditFieldConfig>();

  const onOpenDrawer = (fieldType: FieldType | SocialLinkType) => {
    setFieldConfig(fieldConfigMap[fieldType]);
    openFakePage();
  };

  const onSubmit = () => {
    axios.put(`/users/me`, newUserInfo);
    navigate(`/${user.id}`);
  };

  useEffect(() => {
    // onUnmounted
    return () => {
      closeFakePage();
      resetNewUserInfo();
    };
  }, []);

  return (
    <MobileContainer>
      <Header type="back-to-user" />
      {/* Upload ProfileImageSection */}
      <div id="profile-image" className="flex items-end justify-center pt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={newUserInfo.profileImage} />
          <AvatarFallback>{newUserInfo.displayName[0]}</AvatarFallback>
        </Avatar>
        <label
          className="z-10 -ml-8 flex h-8 w-8 items-center justify-center rounded-full border border-black-text-01 bg-white"
          onClick={() => onOpenDrawer(FieldType.PROFILE_IMAGE)}
        >
          <IconCamera />
        </label>
      </div>
      {/* Basic Info Section */}
      <div id="info-section" className="px-4 pt-10">
        <div className="py-2">
          <h2 className="text-[15px] font-semibold">Profile</h2>
        </div>
        <div
          className="flex h-16 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-2 text-[13px]"
          onClick={() => onOpenDrawer(FieldType.DISPLAY_NAME)}
        >
          <p>Name</p>
          <p className="text-right text-gray-storm-01">
            {newUserInfo.displayName
              ? newUserInfo.displayName
              : fieldConfigMap[FieldType.DISPLAY_NAME]?.placeholder}
          </p>
        </div>
        <div
          className="flex h-16 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-2 text-[13px]"
          onClick={() => onOpenDrawer(FieldType.USER_CODE)}
        >
          <p>Username</p>
          <p className="text-right text-gray-storm-01">
            {newUserInfo.userCode
              ? newUserInfo.userCode
              : fieldConfigMap[FieldType.USER_CODE]?.placeholder}
          </p>
        </div>
        <div
          className="flex h-16 cursor-pointer items-center justify-between border-t border-[#F6F6F6] px-2 text-[13px]"
          onClick={() => onOpenDrawer(FieldType.BIO)}
        >
          <p>Bio</p>
          <p className="text-right text-gray-storm-01">
            {newUserInfo.bio
              ? newUserInfo.bio
              : fieldConfigMap[FieldType.BIO]?.placeholder}
          </p>
        </div>
      </div>
      {/* Social Links Section */}
      <div id="links-section" className="px-4 pb-20 pt-10">
        <div className="py-2">
          <h2 className="text-[15px] font-semibold">Links</h2>
        </div>
        {socialLinkTypeList.map((linkType) => {
          return (
            <div
              key={linkType}
              className="flex h-16 cursor-pointer items-center gap-2 border-t border-[#F6F6F6] px-2 text-[13px]"
              onClick={() => onOpenDrawer(linkType)}
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
      <EditModeFooter
        isModified={isModified()}
        onClose={() => navigate(`/${user.id}`)}
        title={'Edit profile and account'}
        onSave={onSubmit}
      />
      {fieldConfig && (
        <EditFieldFakePageComponent
          variant={fieldConfig.variant}
          title={fieldConfig.fieldName}
          placeholder={fieldConfig.placeholder}
          onFieldValueSet={fieldConfig.onFieldValueSet}
        />
      )}
    </MobileContainer>
  );
};

export default EditUserPage;
