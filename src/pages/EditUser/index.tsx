import { useFakePage } from '@/components/FakePage';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import EditModeFooter from '@/components/Footer/EditModeFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconCamera } from '@/components/ui/icons/CameraIcon';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { socialLinkStarterMap } from '@/constants/User';
import { EditFieldVariant, FieldType } from '@/enums/EditField/index.enum';
import { SocialLinkType } from '@/enums/index.enum';
import axios from '@/lib/axios';
import { urlPreview } from '@/lib/utils';
import useEditProfileStore from '@/stores/useEditProfileStore';
import useUserStore from '@/stores/useUserStore';
import { IEditFieldConfig } from '@/types/EditField';
import { IResponse } from '@/types/response';
import { IUpdateUserResponse } from '@/types/User';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EditUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUser, refreshToken } = useUserStore();
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

  const { openFakePage, closeFakePage } = useFakePage();
  const socialLinkTypeList = Object.values(SocialLinkType);

  const fieldConfigMap: Record<FieldType | SocialLinkType, IEditFieldConfig> = {
    [FieldType.DISPLAY_NAME]: {
      fieldName: t`Name`,
      variant: EditFieldVariant.TEXT,
      placeholder: t`Enter your name here`, // FUTURE: interpolation
      characterLimit: 20,
      edittingFieldValue: newUserInfo.displayName,
      allowEmpty: false,
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setDisplayName(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [FieldType.USER_CODE]: {
      fieldName: t`Username`,
      variant: EditFieldVariant.TEXT,
      placeholder: t`Enter your username here`, // FUTURE: interpolation
      characterLimit: 30,
      edittingFieldValue: newUserInfo.userCode,
      allowEmpty: false,
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setUserCode(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [FieldType.BIO]: {
      fieldName: t`Bio`,
      variant: EditFieldVariant.TEXT,
      placeholder: t`Enter your bio here`, // FUTURE: interpolation
      characterLimit: 250,
      edittingFieldValue: newUserInfo.bio,
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setBio(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [FieldType.PROFILE_IMAGE]: {
      fieldName: t`Profile Image`,
      variant: EditFieldVariant.IMAGE,
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setProfileImage(value);
        } else {
          console.log('value is undefined');
        }
      },
    },
    [SocialLinkType.CUSTOMIZED]: {
      fieldName: t`Customized Link`,
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add URL`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.CUSTOMIZED],
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
      placeholder: t`Add account`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.INSTAGRAM],
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
      placeholder: t`Add account`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.YOUTUBE],
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
      placeholder: t`Add account`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.TIKTOK],
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
      placeholder: t`Add account`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.THREADS],
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
      placeholder: t`Add account`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.LINKEDIN],
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

  const onOpenFakePage = (fieldType: FieldType | SocialLinkType) => {
    setFieldConfig(fieldConfigMap[fieldType]);
    openFakePage();
  };

  const onSubmit = async () => {
    if (newUserInfo.profileImage === user.profileImage) {
      console.log('profile image is the same');
      delete newUserInfo.profileImage;
    }
    const response = await axios.put<IResponse<IUpdateUserResponse>>(
      `/users/me`,
      newUserInfo
    );
    if (response.data.content?.accessToken) {
      console.log('accessToken is updated');
      refreshToken(response.data.content.accessToken);
      setUser({ ...newUserInfo });
    }
    navigate(`/${user.userCode}`);
  };

  useEffect(() => {
    // onUnmounted
    return () => {
      closeFakePage();
      resetNewUserInfo();
    };
  }, []);

  return (
    <>
      <BackToUserHeader owner={user} />
      {/* Upload ProfileImageSection */}
      <div id="profile-image" className="flex items-end justify-center pt-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={newUserInfo.profileImage} />
          <AvatarFallback>{newUserInfo.displayName[0]}</AvatarFallback>
        </Avatar>
        <label
          className="z-10 -ml-8 flex h-8 w-8 items-center justify-center rounded-full border border-black-text-01 bg-white"
          onClick={() => onOpenFakePage(FieldType.PROFILE_IMAGE)}
        >
          <IconCamera />
        </label>
      </div>
      {/* Basic Info Section */}
      <div id="info-section" className="px-4 pt-10">
        <div className="py-2">
          <h2 className="text-[15px] font-semibold">
            <Trans>Profile</Trans>
          </h2>
        </div>
        <div
          className="flex h-16 cursor-pointer items-center justify-between border-t border-gray-note-05 px-2 text-[13px]"
          onClick={() => onOpenFakePage(FieldType.DISPLAY_NAME)}
        >
          <p>
            <Trans>Name</Trans>
          </p>
          <>
            {newUserInfo.displayName ? (
              <p className="text-right text-black-text-01">
                {newUserInfo.displayName}
              </p>
            ) : (
              <p className="text-right text-gray-storm-01">
                {fieldConfigMap[FieldType.DISPLAY_NAME]?.placeholder}
              </p>
            )}
          </>
        </div>
        <div
          className="flex h-16 cursor-pointer items-center justify-between border-t border-gray-note-05 px-2 text-[13px]"
          onClick={() => onOpenFakePage(FieldType.USER_CODE)}
        >
          <p>
            <Trans>Username</Trans>
          </p>
          <>
            {newUserInfo.userCode ? (
              <p className="text-right text-black-text-01">
                {newUserInfo.userCode}
              </p>
            ) : (
              <p className="text-right text-gray-storm-01">
                {fieldConfigMap[FieldType.USER_CODE]?.placeholder}
              </p>
            )}
          </>
        </div>
        <div
          className="flex h-16 cursor-pointer items-center justify-between border-t border-gray-note-05 px-2 text-[13px]"
          onClick={() => onOpenFakePage(FieldType.BIO)}
        >
          <p>
            <Trans>Bio</Trans>
          </p>
          <>
            {newUserInfo.bio ? (
              <p className="line-clamp-1 max-w-[240px] text-right text-black-text-01">
                {newUserInfo.bio}
              </p>
            ) : (
              <p className="text-right text-gray-storm-01">
                {fieldConfigMap[FieldType.BIO]?.placeholder}
              </p>
            )}
          </>
        </div>
      </div>
      {/* Social Links Section */}
      <div id="links-section" className="px-4 pb-20 pt-10">
        <div className="py-2">
          <h2 className="text-[15px] font-semibold">
            <Trans context="title">Links</Trans>
          </h2>
        </div>
        {socialLinkTypeList.map((linkType: SocialLinkType) => {
          return (
            <div
              key={linkType}
              className="flex h-16 cursor-pointer items-center gap-2 border-t border-gray-note-05 px-2 text-[13px]"
              onClick={() => onOpenFakePage(linkType)}
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
        disabled={!isModified()}
        onClose={() => navigate(`/${user.userCode}`)}
        title={t`Edit profile and account`}
        onSave={onSubmit}
      />
      {fieldConfig && (
        <EditFieldFakePageComponent {...fieldConfig} cropShape="round" />
      )}
    </>
  );
};

export default EditUserPage;
