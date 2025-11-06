import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import { useFakePage } from '@/components/FakePage/useFakePage';
import ImageUploader from '@/components/ImageUploader';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
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
import { IEditFieldConfig } from '@/types/EditField/index.d';
import { IdeaBody, IdeaResponse } from '@/types/Idea';
import { zodResolver } from '@hookform/resolvers/zod';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().max(DESC_MAX_LENGTH).optional(),
  externalLink: z.string().url().optional().or(z.literal('')),
  coverImage: z.string().or(z.literal('')).nullable().optional(), // FUTURE: base64 check
});

interface IIdeaFormProps {
  previousIdeaInfo?: IdeaResponse;
  dismissCallback: (isFormNotEdited: boolean) => void;
  completedCallback: (completedIdeaForm: IdeaBody) => void;
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

  // TODO load from localStorage in v0.3.5
  const ideaForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: previousIdeaInfo.title,
      description: previousIdeaInfo.description,
      externalLink: previousIdeaInfo.externalLink,
      coverImage: previousIdeaInfo.coverImage,
    },
  });

  const { isIdle, reset } = useIdle({
    timeout: 2000,
    watch: ideaForm.watch,
  });

  const isFormModified =
    ideaForm.getValues('title') !== '' ||
    ideaForm.getValues('title') !== previousIdeaInfo.title ||
    ideaForm.getValues('description') !== previousIdeaInfo.description ||
    ideaForm.getValues('externalLink') !== previousIdeaInfo.externalLink ||
    ideaForm.getValues('coverImage') !== previousIdeaInfo.coverImage;

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

  const onSubmitFailed = useFormErrorHandler<z.infer<typeof FormSchema>>({
    resolver: resolveIdeaFormError,
  });

  const onCoverImageChange = (base64: string | null) => {
    ideaForm.setValue('coverImage', base64);
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    completedCallback(data);
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
      FormSchema
    );
    ideaForm.reset(getLocalStorage(LocalStorageKey.IDEA_DRAFT, FormSchema), {
      keepValues: true,
    });
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
    ideaForm.setFocus('title');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (previousIdeaInfo.title !== '') return;

    const draft = getLocalStorage(LocalStorageKey.IDEA_DRAFT, FormSchema);
    if (draft) openDraftDrawer();
  }, [mounted, previousIdeaInfo.title]);

  return (
    <>
      <div className="fixed top-0 z-10 flex h-14 w-full justify-between overflow-hidden border-b border-b-gray-note-05 bg-white px-4 py-2">
        <div className="flex items-center gap-1 font-bold">
          <div
            onClick={() => onDismiss()}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center"
          >
            <IconLeftArrowThin width={7.5} height={15} color="black" />
          </div>
          {!mounted || previousIdeaInfo.title !== '' ? (
            <Trans>Edit Idea</Trans>
          ) : (
            <Trans>Add Idea</Trans>
          )}
        </div>
        <Button
          disabled={
            !isFormModified ||
            ideaForm.watch('title') === '' ||
            ideaForm.formState.isSubmitting
          }
          onClick={() => void ideaForm.handleSubmit(onSubmit, onSubmitFailed)()}
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_5PX}
        >
          {!mounted || previousIdeaInfo.title !== '' ? (
            <Trans>Done</Trans>
          ) : (
            <Trans>Next</Trans>
          )}
        </Button>
      </div>
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
                      field.onChange(formatInput(event.target.value));
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
            className="line-clamp-1 min-h-14 w-full truncate border-black-tint-04 py-4 pl-10 pr-3 focus:border-black focus:ring-1 focus:ring-black"
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
            onClick={() => {
              ideaForm.reset(
                getLocalStorage(LocalStorageKey.IDEA_DRAFT, FormSchema)
              );
              closeDraftDrawer();
              setTimeout(() => {
                titleTextarea.bind.onChange();
                descriptionTextarea.bind.onChange();
                ideaForm.setFocus('title');
              }, 0);
            }}
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
