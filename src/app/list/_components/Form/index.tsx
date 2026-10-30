import { GetUserListsResponse, PutListsRequest } from '@/api/query/lists';
import { useListDraft } from '@/app/list/_hooks/useListDraft';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { EditFieldFakePageComponent } from '@/components/FakePage/EditFieldFakePage';
import { useFakePage } from '@/components/FakePage/useFakePage';
import { IChoice } from '@/components/Radio';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconRightArrow from '@/components/ui/icons/RightArrowIcon';
import { Input } from '@/components/ui/input';
import { DrawerIds } from '@/constants/Drawer';
import { DESC_MAX_LENGTH, TITLE_MAX_LENGTH } from '@/constants/form';
import { CategoriesI18n } from '@/constants/Lists/i18n';
import { EditFieldVariant } from '@/enums/EditField/index.enum';
import { LocalStorageKey } from '@/enums/index.enum';
import { ListType } from '@/enums/Lists/index.enum';
import { useGetCategories } from '@/hooks/api/categories/useGetCategories';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import useFormErrorHandler from '@/hooks/ui/useFormErrorHandler';
import useStrictNavigateNext from '@/hooks/useStrictNavigateNext';
import { cn, removeLocalStorage, setLocalStorage } from '@/lib/utils';
import { resolveListFormError } from '@/lib/validator';
import { ListFormSchema } from '@/types/common';
import { IEditFieldConfig } from '@/types/EditField/index.d';
import { zodResolver } from '@hookform/resolvers/zod';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import AutoResizeFields from '@/app/list/_components/Form/AutoResizeFields';
import CancelConfirmDrawer from '@/app/list/_components/Form/CancelConfirmDrawer';
import CategoryDrawer from '@/app/list/_components/Form/CategoryDrawer';
import CategoryDropdown, {
  CategoryOption,
} from '@/app/list/_components/Form/CategoryDropdown';
import CoverImageFields from '@/app/list/_components/Form/CoverImageFields';
import DraftDrawer from '@/app/list/_components/Form/DraftDrawer';
import VisibilityFields from '@/app/list/_components/Form/VisibilityFields';

// 展開「更多內容」時新出現欄位的進場動畫；僅在使用者未要求減少動態時播放
const EXPAND_ANIMATION =
  'motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-top-2 motion-safe:duration-300';

export interface ListFormHandle {
  requestClose: () => void;
}

interface IListFormProps {
  defaultListInfo?: GetUserListsResponse['content'][number];
  isEdit: boolean;
  dismissCallback: (isFormEmpty: boolean) => void;
  completedCallback: (listData: Omit<PutListsRequest, 'listID'>) => void;
}

const ListForm = forwardRef<ListFormHandle, IListFormProps>(function ListForm(
  {
    defaultListInfo = {
      title: '',
      description: '',
      externalLink: '',
      coverImage: '',
      categoryID: 0,
      type: ListType.PUBLIC,
    },
    isEdit,
    dismissCallback,
    completedCallback,
  },
  ref
) {
  const navigateTo = useStrictNavigateNext();
  const { openFakePage } = useFakePage();
  const [fieldConfig, setFieldConfig] = useState<IEditFieldConfig>();
  const { openDrawer: openCategoryDrawer, closeDrawer: closeCategoryDrawer } =
    useDrawer(DrawerIds.CATEGORY_DRAWER_ID);
  const { openDrawer: openCancelDrawer, closeDrawer: closeCancelDrawer } =
    useDrawer(DrawerIds.CANCEL_LIST_FORM_CONFIRM_DRAWER_ID);
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const [mounted, setMounted] = useState(false);

  const listForm = useForm<z.infer<typeof ListFormSchema>>({
    resolver: zodResolver(ListFormSchema),
    defaultValues: {
      title: defaultListInfo.title,
      description: defaultListInfo.description,
      externalLink: defaultListInfo.externalLink,
      coverImage: defaultListInfo.coverImage,
      categoryID: defaultListInfo.categoryID,
      type: defaultListInfo.type,
    },
  });

  const titleTextarea = useAutoResizeTextarea({
    minHeight: 56,
    focusMinHeight: 83,
  });

  const descriptionTextarea = useAutoResizeTextarea({
    minHeight: 56,
    focusMinHeight: 83,
  });

  const isCreate = defaultListInfo.title === '';
  const { onRestoreDraft, closeDraftDrawer, stop } = useListDraft({
    listForm,
    isCreate,
    mounted,
    titleTextarea,
    descriptionTextarea,
  });

  const onSelectCategory = (option: CategoryOption) => {
    listForm.setValue('title', option.title, { shouldDirty: true });
    if (option.categoryID !== undefined) {
      listForm.setValue('categoryID', option.categoryID, { shouldDirty: true });
    }
    setTimeout(() => {
      titleTextarea.bind.onChange();
      descriptionTextarea.bind.onChange();
    }, 1);
  };

  const onOpenFakePage = () => {
    setFieldConfig({
      fieldName: t`封面圖片`,
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

  const [isExpand, setIsExpand] = useState(false);

  const onDismiss = () => {
    let isFormEmpty = true;
    if (listForm.formState.isDirty) {
      openCancelDrawer();
      isFormEmpty = false;
    } else {
      dismissCallback(isFormEmpty);
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof ListFormSchema>> = (data) => {
    closeCategoryDrawer();
    try {
      completedCallback(data);
      if (defaultListInfo.title !== '') {
        return;
      }
      setLocalStorage(
        LocalStorageKey.LIST_DRAFT,
        listForm.getValues(),
        ListFormSchema
      );
      stop();
    } catch (error) {
      console.error(`Failed to submit: ${String(error)}`);
      listForm.reset(listForm.getValues(), { keepDirty: true });
    }
  };

  const onSubmitFailed = useFormErrorHandler<z.infer<typeof ListFormSchema>>({
    resolver: resolveListFormError,
  });

  const onCoverImageChange = (base64: string | null) => {
    if (defaultListInfo.title === '') {
      listForm.setValue('coverImage', base64);
    } else {
      listForm.setValue('coverImage', base64, { shouldDirty: true });
    }
  };

  const onListTypeChange = (checkedValue: boolean) => {
    listForm.setValue(
      'type',
      checkedValue ? ListType.PRIVATE : ListType.PUBLIC,
      {
        shouldDirty: true,
      }
    );
  };

  const [radioChoice, setRadioChoice] = useState<IChoice[]>([]);

  const onCategoryChange = (category: string) => {
    listForm.setValue('categoryID', Number(category), { shouldDirty: true });
  };

  useEffect(() => {
    document.body.style.pointerEvents = '';
    document.body.removeAttribute('data-scroll-locked');

    listForm.setFocus('title');
    setMounted(true);
  }, []);

  useEffect(() => {
    if (defaultListInfo.title === '') {
      return;
    }
    listForm.reset({ ...defaultListInfo });
    setTimeout(() => {
      titleTextarea.bind.onChange();
      descriptionTextarea.bind.onChange();
      listForm.setFocus('title');
    }, 1);
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
    // Close drawers when the component is unmounted
    return () => {
      closeCategoryDrawer();
      closeCancelDrawer();
    };
  }, []);

  useImperativeHandle(ref, () => ({ requestClose: onDismiss }));

  return (
    <>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="relative flex flex-1 flex-col gap-6 bg-gray-note-05 px-4 py-6 pt-20 md:max-w-mobile-max"
      >
        <CategoryDropdown onSelect={onSelectCategory} />
        {isExpand && (
          <div className={EXPAND_ANIMATION}>
            <CoverImageFields
              control={listForm.control}
              onOpenImage={onOpenFakePage}
              onRemove={() => listForm.setValue('coverImage', '')}
            />
          </div>
        )}
        <label className="flex flex-col gap-2">
          {isExpand && (
            <div
              className={cn(
                'text-t1 font-semibold text-black-text-01',
                EXPAND_ANIMATION
              )}
            >
              <Trans>名單主題</Trans>
            </div>
          )}
          <AutoResizeFields
            name="title"
            control={listForm.control}
            placeholder={t`為這份名單取個主題`}
            maxLength={TITLE_MAX_LENGTH}
            textareaControl={titleTextarea}
            wrapperClassName="relative flex items-center justify-center font-extrabold"
            className="relative min-h-20 resize-none overflow-hidden rounded-2xl border border-note-gray-06 px-3 py-4 text-center text-h1 font-black placeholder:text-h1 placeholder:font-black placeholder:text-black-tint-04 focus:border-smart-purple focus:pb-10 focus:ring-1 focus:ring-smart-purple"
            data-testid="list-title-input"
          />
        </label>
        {!isExpand && (
          <Button
            type="button"
            onClick={() => {
              setIsExpand(true);
              setTimeout(() => {
                descriptionTextarea.bind.onChange();
                // 按鈕展開後即 unmount，把焦點移到新出現的描述欄，避免焦點掉回 body
                listForm.setFocus('description');
              }, 1);
            }}
            variant={ButtonVariant.GRAY_NOTE}
            shape={ButtonShape.ROUNDED_12PX}
            size={ButtonSize.H40}
            data-testid="list-form-expand"
          >
            <div className="flex items-center gap-1 text-t1 font-semibold text-black-text-01">
              <IconAdd className="h-3 w-3" />
              <Trans>更多內容</Trans>
            </div>
          </Button>
        )}
        {isExpand && (
          <label className={cn('flex flex-col gap-2', EXPAND_ANIMATION)}>
            <div className="text-t1 font-semibold text-black-text-01">
              <Trans>描述</Trans>
            </div>
            <AutoResizeFields
              name="description"
              control={listForm.control}
              placeholder={t`描述標題`}
              maxLength={DESC_MAX_LENGTH}
              textareaControl={descriptionTextarea}
              wrapperClassName="relative flex items-center justify-center"
              className="relative min-h-14 w-full resize-none overflow-hidden rounded-2xl border border-note-gray-06 p-4 focus:border-smart-purple focus:pb-10 focus:ring-1 focus:ring-smart-purple"
              data-testid="list-desc-input"
            />
          </label>
        )}
        {isExpand && (
          <label className={cn('flex flex-col gap-2', EXPAND_ANIMATION)}>
            <div className="text-t1 font-semibold text-black-text-01">
              <Trans>網址</Trans>
            </div>
            <div className="relative flex items-center gap-2">
              <Input
                {...listForm.register('externalLink')}
                placeholder={t`連結網頁`}
                data-testid="list-link-input"
                className="line-clamp-1 block min-h-14 w-full truncate rounded-2xl border-note-gray-06 p-4 focus:border-smart-purple focus:ring-1 focus:ring-smart-purple"
              />
            </div>
          </label>
        )}
        <div className="flex flex-col gap-4">
          <VisibilityFields
            control={listForm.control}
            onChange={onListTypeChange}
          />
          <Button
            type="button"
            disabled={
              !listForm.formState.isDirty || listForm.watch('title') === ''
            }
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.preventDefault();
              if (isEdit) {
                void listForm.handleSubmit(onSubmit, (errors) =>
                  onSubmitFailed(errors)
                )();
              } else {
                openCategoryDrawer();
              }
            }}
            variant={ButtonVariant.SMART_PURPLE}
            shape={ButtonShape.ROUNDED_8PX}
            size={ButtonSize.H40}
            data-testid="edit-mode-save"
          >
            {isEdit ? <Trans>完成</Trans> : <Trans>下一步</Trans>}
          </Button>
        </div>
      </form>
      {defaultListInfo.title !== '' && (
        <div
          onClick={() => openCategoryDrawer()}
          className="relative mx-4 inline-flex items-center justify-between whitespace-nowrap rounded-full border border-black-tint-04 bg-white py-2 pl-4 pr-3 text-t1 font-semibold text-black-text-01 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <Trans>編輯名單分類</Trans>
          <IconRightArrow className="size-7 text-black-gray-03" />
        </div>
      )}

      <CategoryDrawer
        isCategoryLoading={categoriesLoading}
        categories={radioChoice}
        control={listForm.control}
        onCategoryChange={onCategoryChange}
        isCreate={isCreate}
        disabledNext={
          !listForm.formState.isDirty || listForm.watch('title') === ''
        }
        onNext={() => void listForm.handleSubmit(onSubmit, onSubmitFailed)()}
        onDone={() => closeCategoryDrawer()}
      />

      <CancelConfirmDrawer
        onCancelEditing={() => {
          closeCancelDrawer();
          navigateTo.backward();
        }}
        onContinue={() => closeCancelDrawer()}
      />

      <DraftDrawer
        onDelete={() => {
          removeLocalStorage(LocalStorageKey.LIST_DRAFT);
          closeDraftDrawer();
        }}
        onKeep={() => onRestoreDraft()}
      />

      {fieldConfig && <EditFieldFakePageComponent {...fieldConfig} />}
    </>
  );
});
export default ListForm;
