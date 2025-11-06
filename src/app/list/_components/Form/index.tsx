import { TileBackground } from '@/app/user/_components/TileBackground';
import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import { useFakePage } from '@/components/FakePage/useFakePage';
import ImageUploader from '@/components/ImageUploader';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DrawerIds } from '@/constants/Drawer';
import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
import { CategoriesI18n } from '@/constants/Lists/i18n';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { LocalStorageKey } from '@/enums/index.enum';
import { RadioType } from '@/enums/Style/index.enum';
import { useCategories } from '@/hooks/queries/useCategories';
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
import { resolveListFormError } from '@/lib/validator';
import useCommonStore from '@/stores/useCommonStore';
import { IEditFieldConfig } from '@/types/EditField/index.d';
import { ListBody } from '@/types/List';
import { zodResolver } from '@hookform/resolvers/zod';
import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().max(DESC_MAX_LENGTH).optional(),
  externalLink: z.string().url().or(z.literal('')),
  coverImage: z.string().or(z.literal('')).nullable().optional(), // FUTURE: base64 check
  categoryID: z.number().nonnegative(),
});

interface IListFormProps {
  defaultListInfo?: ListBody;
  dismissCallback: (isFormEmpty: boolean) => void;
  completedCallback: (listData: ListBody) => void;
}

const ListForm: React.FC<IListFormProps> = ({
  defaultListInfo = {
    title: '',
    description: '',
    externalLink: '',
    coverImage: '',
    categoryID: 0,
  },
  dismissCallback,
  completedCallback,
}) => {
  const { setIsLoading } = useCommonStore();
  const navigateTo = useStrictNavigateNext();
  const { openFakePage } = useFakePage();
  const [fieldConfig, setFieldConfig] = useState<IEditFieldConfig>();
  const { openDrawer: openCategoryDrawer, closeDrawer: closeCategoryDrawer } =
    useDrawer(DrawerIds.CATEGORY_DRAWER_ID);
  const { openDrawer: openCancelDrawer, closeDrawer: closeCancelDrawer } =
    useDrawer(DrawerIds.CANCEL_LIST_FORM_CONFIRM_DRAWER_ID);
  const { openDrawer: openDraftDrawer, closeDrawer: closeDraftDrawer } =
    useDrawer(DrawerIds.LIST_DRAFT_DRAWER_ID);
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const [mounted, setMounted] = useState(false);

  // TODO load from localStorage in v0.3.5
  const listForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: defaultListInfo.title,
      description: defaultListInfo.description,
      externalLink: defaultListInfo.externalLink,
      coverImage: defaultListInfo.coverImage,
      categoryID: defaultListInfo.categoryID,
    },
  });

  const { isIdle, reset } = useIdle({ timeout: 2000, watch: listForm.watch });

  const isFormModified =
    listForm.getValues('title') !== '' ||
    listForm.getValues('title') !== defaultListInfo.title ||
    listForm.getValues('description') !== defaultListInfo.description ||
    listForm.getValues('externalLink') !== defaultListInfo.externalLink ||
    listForm.getValues('coverImage') !== defaultListInfo.coverImage ||
    listForm.getValues('categoryID') !== defaultListInfo.categoryID;

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
    if (listForm.formState.isDirty) {
      openCancelDrawer();
      isFormEmpty = false;
    } else {
      dismissCallback(isFormEmpty);
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    closeCategoryDrawer();
    completedCallback(data);
  };

  const onSubmitFailed = useFormErrorHandler<z.infer<typeof FormSchema>>({
    resolver: resolveListFormError,
  });

  const onCoverImageChange = (base64: string | null) => {
    listForm.setValue('coverImage', base64);
  };

  const [radioChoice, setRadioChoice] = useState<IChoice[]>([]);

  const onCategoryChange = (category: string) => {
    listForm.setValue('categoryID', Number(category));
  };

  useEffect(() => {
    listForm.setFocus('title');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (defaultListInfo.title !== '') return;

    const draft = getLocalStorage(LocalStorageKey.LIST_DRAFT, FormSchema);
    if (draft) openDraftDrawer();
  }, [mounted, defaultListInfo.title]);

  useEffect(() => {
    if (
      !(isIdle && listForm.formState.isDirty) ||
      defaultListInfo.title !== ''
    ) {
      return;
    }
    setLocalStorage(
      LocalStorageKey.LIST_DRAFT,
      listForm.getValues(),
      FormSchema
    );
    listForm.reset(getLocalStorage(LocalStorageKey.LIST_DRAFT, FormSchema), {
      keepValues: true,
    });
    reset();
  }, [isIdle, listForm.formState.isDirty, defaultListInfo.title]);

  useEffect(() => {
    if (defaultListInfo.title === '') {
      return;
    }
    listForm.reset({ ...defaultListInfo });
    setTimeout(() => {
      titleTextarea.bind.onChange();
      descriptionTextarea.bind.onChange();
      listForm.setFocus('title');
    }, 0);
  }, [defaultListInfo]);

  useEffect(() => {
    if (!categories) return;
    const _radioChoice = categories.map((_category) => {
      const { id: value } = { id: String(_category.id) };
      const label = i18n._(CategoriesI18n[_category.id]);
      return { value, label };
    });
    setRadioChoice(_radioChoice);
  }, [categories]);

  useEffect(() => {
    if (categoriesLoading || listForm.formState.isSubmitting) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [categoriesLoading, listForm.formState.isSubmitting]);

  useEffect(() => {
    // Close drawers when the component is unmounted
    return () => {
      closeCategoryDrawer();
      closeCancelDrawer();
    };
  }, []);

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
          {!mounted || defaultListInfo.title !== '' ? (
            <Trans>Edit List</Trans>
          ) : (
            <Trans>Create Idea List</Trans>
          )}
        </div>
        <Button
          disabled={!isFormModified || listForm.watch('title') === ''}
          onClick={() => {
            if (defaultListInfo.title === '') {
              openCategoryDrawer();
            } else {
              void listForm.handleSubmit(onSubmit, onSubmitFailed)();
            }
          }}
          variant={ButtonVariant.BLACK}
          shape={ButtonShape.ROUNDED_5PX}
        >
          {!mounted || defaultListInfo.title !== '' ? (
            <Trans>Done</Trans>
          ) : (
            <Trans>Next</Trans>
          )}
        </Button>
      </div>
      <TileBackground />
      <form
        onSubmit={() => {
          void listForm.handleSubmit(onSubmit, onSubmitFailed)();
        }}
        className="relative mx-4 mt-[4.5rem] flex flex-1 flex-col gap-6 rounded-2xl border border-black-tint-04 bg-white px-4 py-6 md:max-w-mobile-max"
      >
        <Controller
          name="title"
          control={listForm.control}
          render={({ field }) => {
            return (
              <div className="flex items-center justify-center">
                <div className="relative flex w-11/12 items-center justify-center font-extrabold">
                  <Textarea
                    placeholder={t`This is the title of your list`}
                    className="relative min-h-20 w-full resize-none overflow-hidden rounded-lg border border-black-tint-04 px-3 py-4 text-center text-h1 placeholder:text-h1 focus:border-black focus:pb-10 focus:ring-1 focus:ring-black"
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
                      {listForm.watch('title').length ?? 0}/{TITLE_MAX_LENGTH}
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        />
        <Controller
          name="description"
          control={listForm.control}
          render={({ field }) => {
            return (
              <div className="relative flex items-center justify-center">
                <IconTextarea className="absolute left-3 top-4 z-10" />
                <>
                  <Textarea
                    placeholder={t`Describe what this title is about`}
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
                      {listForm.watch('description')?.length ?? 0}/
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
            {...listForm.register('externalLink')}
            placeholder={t`Link a page`}
            className="line-clamp-1 min-h-14 w-full truncate border-black-tint-04 py-4 pl-10 pr-3 focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="flex items-center justify-center">
          <Controller
            name="coverImage"
            control={listForm.control}
            render={({ field }) => (
              <ImageUploader
                file={field.value}
                callback={onOpenFakePage}
                onRemove={() => {
                  listForm.setValue('coverImage', '');
                }}
              />
            )}
          />
        </div>
      </form>
      {defaultListInfo.title !== '' && (
        <div
          onClick={() => openCategoryDrawer()}
          className="relative mx-4 inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-black-tint-04 bg-white py-2 font-bold text-black-text-01 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Trans>Edit List Topic</Trans>
        </div>
      )}

      <DrawerComponent
        drawerId={DrawerIds.CATEGORY_DRAWER_ID}
        isShowClose={false}
        header={<Trans>List Topic</Trans>}
        subHeader={<Trans>Choose a topic that vibes with your List.</Trans>}
        content={
          !categoriesLoading && (
            <div className="mb-10 mt-6">
              <Controller
                name="categoryID"
                control={listForm.control}
                render={({ field }) => (
                  <RadioComponent
                    defaultValue={String(field.value)}
                    choices={radioChoice}
                    onChange={onCategoryChange}
                    type={RadioType.BUTTON}
                    className="flex flex-wrap gap-2"
                  />
                )}
              />
            </div>
          )
        }
        endFooter={
          defaultListInfo.title === '' ? (
            <Button
              disabled={
                listForm.formState.isSubmitting ||
                listForm.formState.isSubmitted
              }
              onClick={() =>
                void listForm.handleSubmit(onSubmit, onSubmitFailed)()
              }
              type="submit"
              variant={ButtonVariant.BLACK}
              shape={ButtonShape.ROUNDED_5PX}
            >
              <Trans>Next</Trans>
            </Button>
          ) : (
            <Button
              onClick={() => closeCategoryDrawer()}
              variant={ButtonVariant.BLACK}
              shape={ButtonShape.ROUNDED_5PX}
            >
              <Trans>Done</Trans>
            </Button>
          )
        }
      />

      <DrawerComponent
        drawerId={DrawerIds.CANCEL_LIST_FORM_CONFIRM_DRAWER_ID}
        isShowClose={false}
        header={<Trans>Your edits will be lost if you cancel!</Trans>}
        subHeader={
          <Trans>
            If you cancel, everything you&apos;ve entered will be lost.
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

      <DrawerComponent
        drawerId={DrawerIds.LIST_DRAFT_DRAWER_ID}
        isShowClose={true}
        header={<Trans>Still got an draft waiting for you</Trans>}
        subHeader={<Trans>Would you like to delete it or keep editing?</Trans>}
        content={<></>}
        startFooter={
          <Button
            onClick={() => {
              removeLocalStorage(LocalStorageKey.LIST_DRAFT);
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
              listForm.reset(
                getLocalStorage(LocalStorageKey.LIST_DRAFT, FormSchema)
              );
              closeDraftDrawer();
              setTimeout(() => {
                titleTextarea.bind.onChange();
                descriptionTextarea.bind.onChange();
                listForm.setFocus('title');
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
export default ListForm;
