import { DrawerComponent, useDrawer } from '@/components/Drawer';
import { useFakePage } from '@/components/FakePage';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import ImageUploader from '@/components/ImageUploader';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DrawerIds } from '@/constants/Drawer';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { RadioType } from '@/enums/Style/index.enum';
import { useCategories } from '@/hooks/queries/useCategories';
import useStrictNavigate from '@/hooks/useStrictNavigate';
import { cn, formatInput } from '@/lib/utils';
import { CategoriesI18n } from '@/pages/Lists/i18n';
import useCommonStore from '@/stores/useCommonStore';
import { IEditFieldConfig } from '@/types/EditField';
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
  description: z.string().max(DESC_MAX_LENGTH),
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
  defaultListInfo,
  dismissCallback,
  completedCallback,
}) => {
  const { setErrorDrawerMessage, setShowingAlert, setIsLoading } =
    useCommonStore();
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
          console.log('value is undefined');
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
  const [isFormModified, setIsFormModified] = useState(false);

  const listForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: defaultListInfo?.title,
      description: defaultListInfo?.description,
      externalLink: defaultListInfo?.externalLink,
      coverImage: defaultListInfo?.coverImage,
      categoryID: defaultListInfo?.categoryID,
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
  const { ref, ...registerRest } = listForm.register('description', {
    onChange: onInputChange,
    onBlur: onTextareaBlur,
  });

  useEffect(() => {
    if (!defaultListInfo) return;
    const subscription = listForm.watch((fields) => {
      const isModified =
        fields.title !== defaultListInfo.title ||
        fields.description !== defaultListInfo.description ||
        fields.externalLink !== defaultListInfo.externalLink ||
        fields.coverImage !== defaultListInfo.coverImage ||
        fields.categoryID !== defaultListInfo.categoryID;
      setIsFormModified(isModified);
    });
    return () => subscription.unsubscribe();
  }, [listForm.watch(), defaultListInfo]);

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
    listForm.setValue('coverImage', base64);
  };

  const onCategoryChange = (category: string) => {
    listForm.setValue('categoryID', Number(category));
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
  useEffect(() => {
    // footerPosition();

    // 組件卸載時關閉抽屜
    return () => {
      closeCategoryDrawer();
      closeCancelDrawer();
    };
  }, []);

  useEffect(() => {
    if (!defaultListInfo) {
      return;
    }
    listForm.setValue('title', defaultListInfo.title);
    listForm.setValue('description', defaultListInfo.description);
    listForm.setValue('externalLink', defaultListInfo.externalLink);
    listForm.setValue('coverImage', defaultListInfo.coverImage);
    listForm.setValue('categoryID', defaultListInfo.categoryID);
  }, [defaultListInfo]);

  useEffect(() => {
    if (categoriesLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [categoriesLoading, setIsLoading]);

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

  const navigateTo = useStrictNavigate();

  return (
    <>
      <form
        onSubmit={() => {
          void listForm.handleSubmit(onSubmit, onSubmitFailed)();
        }}
        className="mx-4 mt-6 flex flex-1 flex-col gap-6 px-4 md:max-w-mobile-max"
      >
        <div
          className={cn(`flex items-center justify-center font-extrabold`, {
            'before:h-8 before:w-0.5 before:bg-black-text-01':
              listForm.watch('title') === '',
          })}
        >
          <Input
            placeholder={t`Give your list a title`}
            className="relative w-min border-none text-h1 placeholder:text-h1"
            {...listForm.register('title', { onChange: onInputChange })}
          />
        </div>
        <div className="flex items-start gap-2">
          <IconTextarea />
          <Textarea
            placeholder={t`Describe what this title is about`}
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
            {listForm.watch('description').length}/{DESC_MAX_LENGTH}
          </div>
        )}
        <div className="flex items-center gap-2">
          <IconExteriorLink />
          <Input
            {...listForm.register('externalLink')}
            placeholder={t`Link a page`}
            className="h-6 w-full border-none p-0"
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
                  listForm.setValue('coverImage', null);
                }}
              />
            )}
          />
        </div>
        {defaultListInfo && (
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
          defaultListInfo ? (
            <Button
              onClick={() => onCloseCategoryDrawer()}
              variant={ButtonVariant.BLACK}
              shape={ButtonShape.ROUNDED_5PX}
            >
              <Trans>Next</Trans>
            </Button>
          ) : (
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
      <footer className="fixed bottom-0 left-0 z-10 flex w-full justify-between border-t border-t-gray-main-03 bg-white px-4 py-2 sm:sticky md:max-w-mobile-max">
        <div className="flex items-center gap-2">
          <div
            onClick={() => onDismiss()}
            aria-label="Previous"
            className="h-auto rounded-full bg-inherit p-0"
          >
            <IconClose />
          </div>
          {defaultListInfo ? (
            <Trans>Edit List</Trans>
          ) : (
            <Trans>Create Idea List</Trans>
          )}
        </div>
        {defaultListInfo ? (
          <Button
            disabled={!isFormModified}
            type="submit"
            variant={ButtonVariant.BLACK}
            shape={ButtonShape.ROUNDED_5PX}
            onClick={() => {
              void listForm.handleSubmit(onSubmit, onSubmitFailed)();
            }}
          >
            <Trans>Next</Trans>
          </Button>
        ) : (
          <Button
            variant={
              listForm.getValues('title') === ''
                ? ButtonVariant.GRAY
                : ButtonVariant.BLACK
            }
            shape={ButtonShape.ROUNDED_5PX}
            onClick={() => onOpenCategoryDrawer()}
          >
            <Trans>Next</Trans>
          </Button>
        )}
      </footer>
    </>
  );
};
export default ListForm;
