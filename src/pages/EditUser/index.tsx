import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import { useFakePage } from '@/components/FakePage/useFakePage';
import EditModeFooter from '@/components/Footer/EditModeFooter';
import BackToUserHeader from '@/components/Header/BackToUserHeader';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IconCamera } from '@/components/ui/icons/CameraIcon';
import LinkIconWrapper from '@/components/ui/wrappers/LinkIconWrapper';
import { socialLinkStarterMap } from '@/constants/User';
import { EditFieldVariant, FieldType } from '@/enums/EditField/index.enum';
import { SocialLinkType } from '@/enums/index.enum';
import { useEditProfile } from '@/hooks/mutations/useEditProfile';
import { useAuthCheck } from '@/hooks/useAuth';
import useStrictNavigation from '@/hooks/useStrictNavigate';
import { extractUsernameFromUrl, urlPreview } from '@/lib/utils';
import { validateUserCode } from '@/lib/validator';
import useEditProfileStore from '@/stores/useEditProfileStore';
import useUserStore from '@/stores/useUserStore';
import { IEditFieldConfig } from '@/types/EditField';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import { useEffect, useState } from 'react';

const EditUserPage: React.FC = () => {
  const navigateTo = useStrictNavigation();
  const { me } = useUserStore();
  const {
    newUserInfo,
    setNewUserInfo,
    resetNewUserInfo,
    setDisplayName,
    setProfileImage,
    setUserCode,
    setBio,
    setSocialLink,
    isModified,
  } = useEditProfileStore();
  const { checkAuthAndRedirect } = useAuthCheck();
  const { editProfile } = useEditProfile();
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
          console.error('value is undefined');
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
      validator: validateUserCode,
      onFieldValueSet: (value: string | undefined) => {
        if (value) {
          setUserCode(value);
        } else {
          console.error('value is undefined');
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
          console.error('value is undefined');
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
          console.error('value is undefined');
        }
      },
    },
    [SocialLinkType.CUSTOMIZED]: {
      fieldName: t`Customized Link`,
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add URL`,
      edittingFieldValue: newUserInfo.socialLinks?.[SocialLinkType.CUSTOMIZED],
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setSocialLink(SocialLinkType.CUSTOMIZED, value);
        } else {
          console.error('value is undefined');
        }
      },
    },
    [SocialLinkType.INSTAGRAM]: {
      fieldName: 'Instagram',
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add account`,
      edittingFieldValue: extractUsernameFromUrl(
        SocialLinkType.INSTAGRAM,
        newUserInfo.socialLinks?.[SocialLinkType.INSTAGRAM]
      ),
      trimmer: (value: string) => {
        return extractUsernameFromUrl(SocialLinkType.INSTAGRAM, value) ?? '';
      },
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setSocialLink(
            SocialLinkType.INSTAGRAM,
            value.length > 0
              ? `${socialLinkStarterMap[SocialLinkType.INSTAGRAM]}${value}`
              : ''
          );
        } else {
          console.error('value is undefined');
        }
      },
    },
    [SocialLinkType.YOUTUBE]: {
      fieldName: 'YouTube',
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add account`,
      edittingFieldValue: extractUsernameFromUrl(
        SocialLinkType.YOUTUBE,
        newUserInfo.socialLinks?.[SocialLinkType.YOUTUBE]
      ),
      trimmer: (value: string) => {
        return extractUsernameFromUrl(SocialLinkType.YOUTUBE, value) ?? '';
      },
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setSocialLink(
            SocialLinkType.YOUTUBE,
            value.length > 0
              ? `${socialLinkStarterMap[SocialLinkType.YOUTUBE]}${value}`
              : ''
          );
        } else {
          console.error('value is undefined');
        }
      },
    },
    [SocialLinkType.TIKTOK]: {
      fieldName: 'TikTok',
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add account`,
      edittingFieldValue: extractUsernameFromUrl(
        SocialLinkType.TIKTOK,
        newUserInfo.socialLinks?.[SocialLinkType.TIKTOK]
      ),
      trimmer: (value: string) => {
        return extractUsernameFromUrl(SocialLinkType.TIKTOK, value) ?? '';
      },
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setSocialLink(
            SocialLinkType.TIKTOK,
            value.length > 0
              ? `${socialLinkStarterMap[SocialLinkType.TIKTOK]}${value}`
              : ''
          );
        } else {
          console.error('value is undefined');
        }
      },
    },
    [SocialLinkType.THREADS]: {
      fieldName: 'Threads',
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add account`,
      edittingFieldValue: extractUsernameFromUrl(
        SocialLinkType.THREADS,
        newUserInfo.socialLinks?.[SocialLinkType.THREADS]
      ),
      trimmer: (value: string) => {
        return extractUsernameFromUrl(SocialLinkType.THREADS, value) ?? '';
      },
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setSocialLink(
            SocialLinkType.THREADS,
            value.length > 0
              ? `${socialLinkStarterMap[SocialLinkType.THREADS]}${value}`
              : ''
          );
        } else {
          console.error('value is undefined');
        }
      },
    },
    [SocialLinkType.LINKEDIN]: {
      fieldName: 'LinkedIn',
      variant: EditFieldVariant.TEXT,
      placeholder: t`Add account`,
      edittingFieldValue: extractUsernameFromUrl(
        SocialLinkType.LINKEDIN,
        newUserInfo.socialLinks?.[SocialLinkType.LINKEDIN]
      ),
      trimmer: (value: string) => {
        return extractUsernameFromUrl(SocialLinkType.LINKEDIN, value) ?? '';
      },
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined) {
          setSocialLink(
            SocialLinkType.LINKEDIN,
            value.length > 0
              ? `${socialLinkStarterMap[SocialLinkType.LINKEDIN]}${value}`
              : ''
          );
        } else {
          console.error('value is undefined');
        }
      },
    },
  };

  const [fieldConfig, setFieldConfig] = useState<IEditFieldConfig>();

  const onOpenFakePage = (fieldType: FieldType | SocialLinkType) => {
    setFieldConfig(fieldConfigMap[fieldType]);
    openFakePage();
  };

  const onSubmit = () => {
    editProfile({ newUserInfo });
  };

  useEffect(() => {
    setNewUserInfo(me);
    checkAuthAndRedirect(); // NOTE: will cause infinite loop if put in dependency array
    // onUnmounted
    return () => {
      closeFakePage();
      resetNewUserInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, setNewUserInfo, checkAuthAndRedirect]);

  return (
    <>
      <BackToUserHeader owner={me} />
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
              ) : linkType === SocialLinkType.CUSTOMIZED ? (
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
        onClose={() => navigateTo.user(me.userCode)}
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
