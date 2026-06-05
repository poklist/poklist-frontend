import { GetIdeasResponse, PostIdeasRequest } from '@/api/query/ideas';
import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import { useFakePage } from '@/components/FakePage/useFakePage';
import EditModeHeader from '@/components/Header/EditModeHeader';
import ImageUploader from '@/components/ImageUploader';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DrawerIds } from '@/constants/Drawer';
import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { LocalStorageKey } from '@/enums/index.enum';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import useFormErrorHandler from '@/hooks/ui/useFormErrorHandler';
import useIdle from '@/hooks/useIdle';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import {
  formatInput,
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from '@/lib/utils';
import { resolveIdeaFormError } from '@/lib/validator';
import { IdeaFormSchema } from '@/types/common';
import { IEditFieldConfig } from '@/types/EditField/index.d';
import { zodResolver } from '@hookform/resolvers/zod';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

interface IIdeaFormProps {
  previousIdeaInfo?: GetIdeasResponse['content'];
  dismissCallback: (isFormNotEdited: boolean) => void;
  completedCallback: (
    completedIdeaForm: Omit<PostIdeasRequest, 'listID'>
  ) => void;
}

const IdeaFormComponent: React.FC<IIdeaFormProps> = ({
  previousIdeaInfo = {
    title: '',
    description: '',
    externalLink: '',
    coverImage: '',
  },
  dismissCallback,
  completedCallback,
}) => {
  const navigateTo = useStrictNavigateNext();
  const { openFakePage } = useFakePage();
  const [fieldConfig, setFieldConfig] = useState<IEditFieldConfig>();
  const { openDrawer: openCancelDrawer, closeDrawer: closeCancelDrawer } =
    useDrawer(DrawerIds.CANCEL_IDEA_FORM_CONFIRM_DRAWER_ID);
  const { openDrawer: openDraftDrawer, closeDrawer: closeDraftDrawer } =
    useDrawer(DrawerIds.IDEA_DRAFT_DRAWER_ID);
  const [mounted, setMounted] = useState(false);

  const ideaForm = useForm<z.infer<typeof IdeaFormSchema>>({
    resolver: zodResolver(IdeaFormSchema),
    defaultValues: {
      title: previousIdeaInfo.title,
      description: previousIdeaInfo.description,
      externalLink: previousIdeaInfo.externalLink,
      coverImage: previousIdeaInfo.coverImage,
    },
  });

  const { isIdle, stop, reset } = useIdle({
    timeout: 2000,
    watch: ideaForm.watch,
  });

  const onOpenFakePage = () => {
    setFieldConfig({
      fieldName: t`Cover Image`,
      variant: EditFieldVariant.IMAGE,
      onFieldValueSet: (value: string | undefined) => {
        if (value !== undefined && value !== null) {
          onCoverImageChange(value);
        } else {
          console.error('value is undefined');
        }
      },
    });
    openFakePage('editField');
  };

  const titleTextarea = useAutoResizeTextarea({
    minHeight: 56,
    focusMinHeight: 83,
  });

  const descriptionTextarea = useAutoResizeTextarea({
    minHeight: 56,
    focusMinHeight: 83,
  });

  const onDismiss = () => {
    let isFormEmpty = true;
    if (ideaForm.formState.isDirty) {
      openCancelDrawer();
      isFormEmpty = false;
    } else {
      dismissCallback(isFormEmpty);
    }
  };

  const onSubmitFailed = useFormErrorHandler<z.infer<typeof IdeaFormSchema>>({
    resolver: resolveIdeaFormError,
  });

  const onCoverImageChange = (base64: string | null) => {
    if (previousIdeaInfo.title === '') {
      ideaForm.setValue('coverImage', base64);
    } else {
      ideaForm.setValue('coverImage', base64, { shouldDirty: true });
    }
  };

  const onSubmit = (data: z.infer<typeof IdeaFormSchema>) => {
    completedCallback(data);
    if (previousIdeaInfo.title !== '') {
      return;
    }
    setLocalStorage(
      LocalStorageKey.IDEA_DRAFT,
      ideaForm.getValues(),
      IdeaFormSchema
    );
    stop();
  };

  const onRestoreDraft = async () => {
    const ideaDraft = getLocalStorage(
      LocalStorageKey.IDEA_DRAFT,
      IdeaFormSchema
    );
    if (!ideaDraft) return;
    ideaForm.setValue('title', ideaDraft.title || '', {
      shouldDirty: ideaDraft.title !== '',
    });
    ideaForm.setValue('description', ideaDraft.description || '');
    ideaForm.setValue('coverImage', ideaDraft.coverImage || '');
    ideaForm.setValue('externalLink', ideaDraft.externalLink || '');
    closeDraftDrawer();
    await ideaForm.trigger();
    setTimeout(() => {
      titleTextarea.bind.onChange();
      descriptionTextarea.bind.onChange();
      ideaForm.setFocus('title');
    }, 0);
  };

  useEffect(() => {
    if (
      !(isIdle && ideaForm.formState.isDirty) ||
      previousIdeaInfo.title !== ''
    ) {
      return;
    }
    setLocalStorage(
      LocalStorageKey.IDEA_DRAFT,
      ideaForm.getValues(),
      IdeaFormSchema
    );
    // // 這裡有時候會引致 onSubmit 的 Button 變回 disabled 和 isDirty 狀態被重置有關
    // ideaForm.reset(getLocalStorage(LocalStorageKey.IDEA_DRAFT, IdeaFormSchema), {
    //   keepValues: true,
    //   keepDirty: true,
    // });
    reset();
  }, [isIdle, ideaForm.formState.isDirty, previousIdeaInfo.title]);

  useEffect(() => {
    if (previousIdeaInfo.title === '') return;
    ideaForm.reset({
      ...previousIdeaInfo,
    });
    setTimeout(() => {
      titleTextarea.bind.onChange();
      descriptionTextarea.bind.onChange();
      ideaForm.setFocus('title');
    }, 0);
  }, [previousIdeaInfo]);

  useEffect(() => {
    document.body.style.pointerEvents = '';
    document.body.removeAttribute('data-scroll-locked');

    ideaForm.setFocus('title');
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;
    if (previousIdeaInfo.title !== '') return;

    const draft = getLocalStorage(LocalStorageKey.IDEA_DRAFT, IdeaFormSchema);
    if (draft) openDraftDrawer();
  }, [mounted, previousIdeaInfo.title]);
  return (
    <>
      <EditModeHeader
        onClose={() => onDismiss()}
        title={
          !mounted || previousIdeaInfo.title !== '' ? t`Edit Idea` : t`Add Idea`
        }
        disabled={!ideaForm.formState.isDirty || ideaForm.watch('title') === ''}
        onSave={() => void ideaForm.handleSubmit(onSubmit, onSubmitFailed)()}
        saveButtonText={
          !mounted || previousIdeaInfo.title !== '' ? t`Done` : t`Next`
        }
      />
      <form
        onSubmit={() => void ideaForm.handleSubmit(onSubmit, onSubmitFailed)()}
        className="mx-4 mb-24 mt-4 flex flex-1 flex-col gap-6 md:max-w-mobile-max"
      >
        <div className="flex items-center justify-center">
          <Controller
            name="coverImage"
            control={ideaForm.control}
            render={({ field }) => (
              <ImageUploader
                file={field.value}
                callback={onOpenFakePage}
                onRemove={() => {
                  ideaForm.setValue('coverImage', '');
                }}
              />
            )}
          />
        </div>
        <Controller
          name="title"
          control={ideaForm.control}
          render={({ field }) => {
            return (
              <div className="relative flex items-center justify-center font-bold">
                <Textarea
                  placeholder={t`What’s your idea? (must-have)`}
                  className="relative min-h-16 w-full resize-none overflow-hidden rounded-lg border border-black-tint-04 px-3 py-4 text-lg placeholder:text-base focus:border-black focus:pb-10 focus:ring-1 focus:ring-black"
                  rows={1}
                  {...field}
                  ref={(el) => {
                    field.ref(el);
                    titleTextarea.ref.current = el;
                  }}
                  onBlur={() => {
                    field.onBlur();
                    titleTextarea.bind.onBlur();
                  }}
                  onFocus={() => titleTextarea.bind.onFocus()}
                  onChange={(event) => {
                    titleTextarea.bind.onChange();
                    field.onChange(formatInput(event.target.value));
                  }}
                />
                {titleTextarea.isFocus && (
                  <div className="absolute bottom-4 right-3 text-sm font-normal text-black-tint-04">
                    {ideaForm.watch('title')?.length ?? 0}/{TITLE_MAX_LENGTH}
                  </div>
                )}
              </div>
            );
          }}
        />
        <Controller
          name="description"
          control={ideaForm.control}
          render={({ field }) => {
            return (
              <div className="relative flex items-center justify-center">
                <IconTextarea className="absolute left-3 top-4 z-10" />
                <>
                  <Textarea
                    placeholder={t`Description`}
                    className="relative min-h-14 w-full resize-none overflow-hidden rounded-lg border border-black-tint-04 py-4 pl-10 pr-3 focus:border-black focus:pb-10 focus:ring-1 focus:ring-black"
                    rows={1}
                    {...field}
                    ref={descriptionTextarea.ref}
                    onBlur={() => {
                      field.onBlur();
                      descriptionTextarea.bind.onBlur();
                    }}
                    onFocus={() => descriptionTextarea.bind.onFocus()}
                    onChange={(event) => {
                      descriptionTextarea.bind.onChange();
                      field.onChange(event.target.value.replace(/^\s+/, ''));
                    }}
                  />
                  {descriptionTextarea.isFocus && (
                    <div className="absolute bottom-4 right-3 text-sm font-normal text-black-tint-04">
                      {ideaForm.watch('description')?.length ?? 0}/
                      {DESC_MAX_LENGTH}
                    </div>
                  )}
                </>
              </div>
            );
          }}
        />
        <div className="relative flex items-center gap-2">
          <IconExteriorLink className="absolute left-3 top-4 z-10" />
          <Input
            {...ideaForm.register('externalLink')}
            placeholder={t`Link`}
            className="line-clamp-1 block min-h-14 w-full truncate border-black-tint-04 py-4 pl-10 pr-3 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
      </form>

      <DrawerComponent
        drawerId={DrawerIds.CANCEL_IDEA_FORM_CONFIRM_DRAWER_ID}
        isShowClose={false}
        header={<Trans>Discarding your edits?</Trans>}
        subHeader={
          <Trans>If you choose to discard, you’ll lose this edit.</Trans>
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
            <Trans>Discard</Trans>
          </Button>
        }
        endFooter={
          <Button
            onClick={() => closeCancelDrawer()}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Continue editing</Trans>
          </Button>
        }
      />

      <DrawerComponent
        drawerId={DrawerIds.IDEA_DRAFT_DRAWER_ID}
        isShowClose={true}
        header={<Trans>Still got an draft waiting for you</Trans>}
        subHeader={<Trans>Would you like to delete it or keep editing?</Trans>}
        content={<></>}
        startFooter={
          <Button
            onClick={() => {
              removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
              closeDraftDrawer();
            }}
            variant={ButtonVariant.WARNING}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Delete draft</Trans>
          </Button>
        }
        endFooter={
          <Button
            onClick={() => void onRestoreDraft()}
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
          >
            <Trans>Keep editing</Trans>
          </Button>
        }
      />

      {fieldConfig && <EditFieldFakePageComponent {...fieldConfig} />}
    </>
  );
};
export default IdeaFormComponent;
