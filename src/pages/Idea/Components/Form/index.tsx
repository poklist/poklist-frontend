import { useFakePage } from '@/components/FakePage';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import ImageUploader from '@/components/ImageUploader';
import { DrawerComponent, useDrawer } from '@/components/Drawer';
import { DrawerIds } from '@/constants/Drawer';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { ICreateIdeaRequest } from '@/hooks/Ideas/useCreateIdea';
import { IEditIdeaRequest } from '@/hooks/Ideas/useEditIdea';
import { IIdeaInfo } from '@/hooks/Ideas/useGetIdea';
import { cn, formatInput } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IEditFieldConfig } from '@/types/EditField';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import useStrictNavigate from '@/hooks/useStrictNavigate';

const TITLE_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 250;

const FormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().max(DESC_MAX_LENGTH),
  externalLink: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().or(z.literal('')).nullable(), // FUTURE: base64 check
});

interface IIdeaFormProps {
  previousIdeaInfo?: IIdeaInfo;
  dismissCallback: (isFormNotEdited: boolean) => void;
  completedCallback: (
    completedIdeaForm:
      | Omit<IEditIdeaRequest, 'id'>
      | Omit<ICreateIdeaRequest, 'listID'>
  ) => void;
}

const IdeaFormComponent: React.FC<IIdeaFormProps> = ({
  previousIdeaInfo,
  dismissCallback,
  completedCallback,
}) => {
  const { setErrorDrawerMessage, setShowingAlert, setIsLoading } =
    useCommonStore();
  const { openDrawer: openCancelDrawer, closeDrawer: closeCancelDrawer } =
    useDrawer(DrawerIds.CANCEL_IDEA_FORM_CONFIRM_DRAWER_ID);
  const navigateTo = useStrictNavigate();

  const [isTextareaFocus, setIsTextareaFocus] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);

  const { openFakePage } = useFakePage();
  const [fieldConfig, setFieldConfig] = useState<IEditFieldConfig>();

  const onOpenFakePage = () => {
    setFieldConfig({
      fieldName: t`Cover Image`,
      variant: EditFieldVariant.IMAGE,
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined && value !== null) {
          onCoverImageChange(value);
        } else {
          console.log('value is undefined');
        }
      },
    });
    openFakePage();
  };

  const ideaForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: previousIdeaInfo?.title,
      description: previousIdeaInfo?.description,
      externalLink: previousIdeaInfo?.externalLink,
      coverImage: previousIdeaInfo?.coverImage,
    },
  });

  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.target.value = formatInput(event.target.value);
  };

  const onTextareaBlur = () => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = 0;
      setIsTextareaFocus(false);
    }
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const { ref, ...registerRest } = ideaForm.register('description', {
    onChange: onInputChange,
    onBlur: onTextareaBlur,
  });

  useEffect(() => {
    if (!previousIdeaInfo) return;
    const subscription = ideaForm.watch((fields) => {
      const isModified =
        fields.title !== previousIdeaInfo?.title ||
        fields.description !== previousIdeaInfo?.description ||
        fields.externalLink !== previousIdeaInfo?.externalLink ||
        fields.coverImage !== previousIdeaInfo?.coverImage;
      setIsFormModified(isModified);
    });
    return () => subscription.unsubscribe();
  }, [ideaForm.watch(), previousIdeaInfo]);

  const isFieldNotEmpty = (
    value: string | number | File | null | undefined
  ) => {
    if (value === '' || value === 0 || value === null || value === undefined)
      return false;
    if (value instanceof File && value.size === 0) return false;
    return true;
  };

  const onDismiss = () => {
    let isFormEmpty = true;
    if (isFormModified) {
      openCancelDrawer();
      isFormEmpty = false;
    } else {
      dismissCallback(isFormEmpty);
    }
  };

  const onSubmitFailed = (
    value: FieldErrors<{
      title: string;
      description: string;
      externalLink?: string | undefined;
      coverImage?: File | null | undefined;
    }>
  ) => {
    const errorKey = Object.keys(value)[0];
    // TODO 目前解法
    switch (errorKey) {
      case 'title': {
        if (value.title?.type === 'too_small') {
          setErrorDrawerMessage({
            title: t`Hey, the title can't be left empty!`,
            content: t`Every idea needs a title, so fill it in!`,
          });
        }
        if (value.title?.type === 'too_big') {
          setErrorDrawerMessage({
            title: t`Idea title is too long!`,
            content: t`Please keep it under ${TITLE_MAX_LENGTH} characters.`,
          });
        }

        break;
      }
      case 'description': {
        if (value.description?.type === 'too_big') {
          setErrorDrawerMessage({
            title: t`Description is too long!`,
            content: t`Please keep it under ${DESC_MAX_LENGTH} characters.`,
          });
        }

        break;
      }
      case 'externalLink': {
        setShowingAlert(true, {
          message: value.externalLink?.message || 'Invalid url',
        });
        break;
      }

      default: {
        return;
      }
    }
  };

  const onCoverImageChange = (base64: string | null) => {
    ideaForm.setValue('coverImage', base64);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    completedCallback(data);
  };

  // const submitFooterRef = useRef<HTMLDivElement>(null);

  // const footerPosition = () => {
  //   if (submitFooterRef.current && window.visualViewport) {
  //     submitFooterRef.current.style.top = `${window.visualViewport.height - submitFooterRef.current.offsetHeight}px`;
  //   }
  // };
  // useEffect(() => {
  //   footerPosition();
  // }, []);

  useEffect(() => {
    if (!previousIdeaInfo) {
      return;
    }
    ideaForm.setValue('title', previousIdeaInfo.title);
    ideaForm.setValue('description', previousIdeaInfo.description);
    ideaForm.setValue('externalLink', previousIdeaInfo.externalLink);
    ideaForm.setValue('coverImage', previousIdeaInfo.coverImage);
  }, [previousIdeaInfo]);

  useEffect(() => {
    if (previousIdeaInfo) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [previousIdeaInfo, setIsLoading]);

  return (
    <>
      <form
        onSubmit={ideaForm.handleSubmit(onSubmit, onSubmitFailed)}
        className="mx-4 mt-4 flex flex-1 flex-col gap-6 md:max-w-mobile-max"
      >
        <div
          className={cn(`flex items-center font-extrabold`, {
            'before:h-8 before:w-0.5 before:bg-black-text-01':
              ideaForm.watch('title') === '',
          })}
        >
          <Input
            placeholder={t`What's your Idea?`}
            className="relative border-none px-0 text-h1 placeholder:text-h1"
            {...ideaForm.register('title', { onChange: onInputChange })}
          />
        </div>
        <div className="flex items-start gap-2">
          <IconTextarea />
          <Textarea
            placeholder={t`Describe what this idea is about`}
            className={cn(`resize-none border-none p-0`, {
              'line-clamp-1 h-6 min-h-6': !isTextareaFocus,
            })}
            {...registerRest}
            ref={(e) => {
              ref(e);
              textareaRef.current = e;
            }}
            onFocus={() => setIsTextareaFocus(true)}
          />
        </div>
        {isTextareaFocus && (
          <div className="mt-2 flex justify-end text-black-tint-04">
            {ideaForm.watch('description').length}/{DESC_MAX_LENGTH}
          </div>
        )}
        <div className="flex items-center gap-2">
          <IconExteriorLink />
          <Input
            {...ideaForm.register('externalLink')}
            placeholder={t`Link a page`}
            className="h-6 w-full border-none p-0"
          />
        </div>
        <div
          className={cn(`flex items-center sm:justify-start`, {
            'justify-center': isFieldNotEmpty(ideaForm.watch('coverImage')),
          })}
        >
          <Controller
            name="coverImage"
            control={ideaForm.control}
            render={({ field }) => (
              <ImageUploader file={field.value} callback={onOpenFakePage} />
            )}
          />
        </div>
      </form>

      {fieldConfig && <EditFieldFakePageComponent {...fieldConfig} />}

      <DrawerComponent
        drawerId={DrawerIds.CANCEL_IDEA_FORM_CONFIRM_DRAWER_ID}
        isShowClose={false}
        header={<Trans>Your edits will be lost if you cancel!</Trans>}
        subHeader={
          <Trans>
            Title is saved, but your idea edits will be lost! Are you sure you
            want to cancel?
          </Trans>
        }
        content={<></>}
        startFooter={
          <Button
            onClick={() => {
              closeCancelDrawer();
              navigateTo.backward();
            }}
            variant={ButtonVariant.WARNING}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Cancel Editing</Trans>
          </Button>
        }
        endFooter={
          <Button
            onClick={() => closeCancelDrawer()}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Continue Editing</Trans>
          </Button>
        }
      />

      <footer className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 px-4 py-2 sm:sticky">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onDismiss()}
            aria-label="Previous"
            className="h-auto rounded-full bg-inherit p-0"
          >
            <IconClose />
          </div>
          {previousIdeaInfo ? (
            <Trans>Edit Idea</Trans>
          ) : (
            <Trans>New Idea</Trans>
          )}
        </div>

        <Button
          disabled={
            (previousIdeaInfo !== undefined && !isFormModified) ||
            ideaForm.getValues('title') === ''
          }
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_5PX}
          onClick={() => ideaForm.handleSubmit(onSubmit, onSubmitFailed)()}
        >
          <Trans>Next</Trans>
        </Button>
      </footer>
    </>
  );
};
export default IdeaFormComponent;
