import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import { useFakePage } from '@/components/FakePage/useFakePage';
import ImageUploader from '@/components/ImageUploader';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DrawerIds } from '@/constants/Drawer';
import { CategoriesI18n } from '@/constants/Lists/i18n';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { LocalStorageKey } from '@/enums/index.enum';
import { MessageType, RadioType } from '@/enums/Style/index.enum';
import { useCategories } from '@/hooks/queries/useCategories';
import useIdle from '@/hooks/useIdle';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { cn, formatInput, getLocalStorage, setLocalStorage } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IEditFieldConfig } from '@/types/EditField/index.d';
import { ListBody } from '@/types/List';
import { zodResolver } from '@hookform/resolvers/zod';
import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { Trans } from '@lingui/react/macro';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';

const TITLE_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 250;

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
  const { setErrorDrawerMessage, setIsLoading } = useCommonStore();
  const { openDrawer: openCategoryDrawer, closeDrawer: closeCategoryDrawer } =
    useDrawer(DrawerIds.CATEGORY_DRAWER_ID);
  const { openDrawer: openCancelDrawer, closeDrawer: closeCancelDrawer } =
    useDrawer(DrawerIds.CANCEL_LIST_FORM_CONFIRM_DRAWER_ID);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

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
          console.error('value is undefined');
        }
      },
    });
    openFakePage();
  };

  const onOpenCategoryDrawer = () => {
    openCategoryDrawer();
  };

  const onCloseCategoryDrawer = () => {
    closeCategoryDrawer();
  };

  const [isTextareaFocus, setIsTextareaFocus] = useState(false);

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
  const isFormModified =
    listForm.getValues('title') !== '' ||
    listForm.getValues('title') !== defaultListInfo.title ||
    listForm.getValues('description') !== defaultListInfo.description ||
    listForm.getValues('externalLink') !== defaultListInfo.externalLink ||
    listForm.getValues('coverImage') !== defaultListInfo.coverImage ||
    listForm.getValues('categoryID') !== defaultListInfo.categoryID;

  const onInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    event.target.value = formatInput(event.target.value);
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const { isIdle, reset } = useIdle({ timeout: 2000, watch: listForm.watch });

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
      // TODO load from localStorage in v0.3.5
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
            content: t`Every list needs a title, so fill it in!`,
          });
        }
        if (value.title?.type === 'too_big') {
          setErrorDrawerMessage({
            title: t`List title is too long!`,
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
        toast({
          title: t`Error - Link must start with https:// `,
          variant: MessageType.ERROR,
        });
        break;
      }

      default: {
        return;
      }
    }
  };

  const onCoverImageChange = (base64: string | null) => {
    listForm.setValue('coverImage', base64);
  };

  const onCategoryChange = (category: string) => {
    listForm.setValue('categoryID', Number(category));
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    completedCallback(data);
  };

  useEffect(() => {
    // Close drawers when the component is unmounted
    return () => {
      closeCategoryDrawer();
      closeCancelDrawer();
    };
  }, []);

  // TODO load from localStorage in v0.3.5
  useEffect(() => {
    if (defaultListInfo.title === '') {
      return;
    }
    listForm.reset({ ...defaultListInfo });
  }, [defaultListInfo]);

  useEffect(() => {
    if (categoriesLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [categoriesLoading]);

  useEffect(() => {
    listForm.setFocus('title');
  }, []);

  const [radioChoice, setRadioChoice] = useState<IChoice[]>([]);

  useEffect(() => {
    if (!categories) return;
    const _radioChoice = categories.map((_category) => {
      const { id: value } = { id: String(_category.id) };
      const label = i18n._(CategoriesI18n[_category.id]);
      return { value, label };
    });
    setRadioChoice(_radioChoice);
  }, [categories]);

  const navigateTo = useStrictNavigateNext();

  return (
    <>
      <form
        onSubmit={() => {
          void listForm.handleSubmit(onSubmit, onSubmitFailed)();
        }}
        className="mx-4 mt-6 flex flex-1 flex-col gap-6 px-4 md:max-w-mobile-max"
      >
        <div className="flex items-center justify-center font-extrabold">
          <Input
            placeholder={t`This is the title of your list`}
            className="relative w-min border-none text-h1 placeholder:text-h1"
            {...listForm.register('title', { onChange: onInputChange })}
          />
        </div>
        <div className="flex items-start gap-2">
          <IconTextarea />
          <Controller
            name="description"
            control={listForm.control}
            render={({ field }) => {
              if (!isTextareaFocus) {
                const isEmpty = !field.value;
                return (
                  <div
                    className={cn(
                      'line-clamp-1 h-6 w-full cursor-text border-none p-0',
                      isEmpty && 'text-black-gray-03'
                    )}
                    onClick={() => {
                      setIsTextareaFocus(true);
                      setTimeout(() => {
                        const el = textareaRef.current;
                        if (el) {
                          el.focus();
                          const len = el.value.length;
                          el.setSelectionRange(len, len);
                          el.scrollTop = el.scrollHeight;
                        }
                      }, 0);
                    }}
                  >
                    {field.value || t`Describe what this title is about`}
                  </div>
                );
              }
              return (
                <Textarea
                  placeholder={t`Describe what this title is about`}
                  className="resize-none border-none p-0 leading-[1.45]"
                  {...field}
                  onChange={(e) => field.onChange(formatInput(e.target.value))}
                  onBlur={() => {
                    field.onBlur();
                    textareaRef.current?.scrollTo({ top: 0 });
                    setIsTextareaFocus(false);
                  }}
                  onFocus={() => setIsTextareaFocus(true)}
                  ref={(el) => {
                    field.ref(el);
                    textareaRef.current = el;
                  }}
                />
              );
            }}
          />
        </div>
        {isTextareaFocus && (
          <div className="mt-2 flex justify-end text-black-tint-04">
            {listForm.watch('description')?.length ?? 0}/{DESC_MAX_LENGTH}
          </div>
        )}
        <div className="flex items-center gap-2">
          <IconExteriorLink />
          <Input
            {...listForm.register('externalLink')}
            placeholder={t`Link a page`}
            className="line-clamp-1 h-6 w-full border-none p-0"
          />
        </div>
        <div
          className={cn(`flex items-center sm:justify-start`, {
            'justify-center': isFieldNotEmpty(listForm.watch('coverImage')),
          })}
        >
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
        {defaultListInfo.title !== '' && (
          <div
            onClick={() => onOpenCategoryDrawer()}
            className="inline-flex h-10 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-black text-h2 font-bold text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:bg-gray-main-03 disabled:text-black-tint-04"
          >
            <Trans>Edit List Topic</Trans>
          </div>
        )}
      </form>

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
              onClick={() => onCloseCategoryDrawer()}
              variant={ButtonVariant.BLACK}
              shape={ButtonShape.ROUNDED_5PX}
            >
              <Trans>Next</Trans>
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

      {fieldConfig && <EditFieldFakePageComponent {...fieldConfig} />}

      {/* FUTURE: merge into reusable component */}
      <footer className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky md:max-w-full">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onDismiss()}
            aria-label="Previous"
            className="h-auto rounded-full bg-inherit p-0"
          >
            <IconClose />
          </div>
          <p className="text-[17px] font-bold">
            {defaultListInfo.title === '' ? (
              <Trans>Create Idea List</Trans>
            ) : (
              <Trans>Edit List</Trans>
            )}
          </p>
        </div>
        <Button
          disabled={!isFormModified || listForm.watch('title') === ''}
          type="submit"
          variant={
            !isFormModified || listForm.watch('title') === ''
              ? ButtonVariant.GRAY
              : ButtonVariant.BLACK
          }
          shape={ButtonShape.ROUNDED_5PX}
          onClick={() => {
            if (defaultListInfo.title === '') {
              onOpenCategoryDrawer();
            } else {
              void listForm.handleSubmit(onSubmit, onSubmitFailed)();
            }
          }}
        >
          <Trans>Next</Trans>
        </Button>
      </footer>
    </>
  );
};
export default ListForm;
