'use client';
import { DrawerComponent } from '@/components/Drawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import EditModeHeader from '@/components/Header/EditModeHeader';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button, ButtonShape, ButtonVariant } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DrawerIds } from '@/constants/Drawer';
import { TITLE_MAX_LENGTH } from '@/constants/form';
import { CategoriesI18n } from '@/constants/Lists/i18n';
import { MessageType, RadioType } from '@/enums/Style/index.enum';
import { useCreateIdea } from '@/hooks/mutations/useCreateIdea';
import { useCreateList } from '@/hooks/mutations/useCreateList';
import { useCategories } from '@/hooks/queries/useCategories';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import useFormErrorHandler from '@/hooks/ui/useFormErrorHandler';
import { useAuthCheck, useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationNext from '@/hooks/useStrictNavigateNext';
import { toast } from '@/hooks/useToast';
import { formatInput } from '@/lib/utils';
import { resolveListFormError } from '@/lib/validator';
import useCommonStore from '@/stores/useCommonStore';
import { useTemporaryIdeaStore } from '@/stores/useTemporaryIdeaStore';
import useUserStore from '@/stores/useUserStore';
import { ListFormSchema } from '@/types/common';
import { ListBody } from '@/types/List';
import { zodResolver } from '@hookform/resolvers/zod';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import z from 'zod';

const defaultListInfo: z.infer<typeof ListFormSchema> = {
  title: '',
  externalLink: '',
  categoryID: 0,
};

const TemporaryCreateListPage: React.FC = () => {
  const navigateTo = useStrictNavigationNext();

  const { setIsLoading } = useCommonStore();
  const { me } = useUserStore();
  const { idea, clearIfMatchLocalStorage } = useTemporaryIdeaStore();

  const { withAuth } = useAuthWrapper();
  const { checkAuthAndRedirect } = useAuthCheck();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { createList, isCreateListLoading } = useCreateList({
    userCode: me.userCode,
  });
  const { mutate: createIdea, isPending: createIdeaLoading } = useCreateIdea();

  const { openDrawer: openCategoryDrawer, closeDrawer: closeCategoryDrawer } =
    useDrawer(DrawerIds.CATEGORY_DRAWER_ID);
  const { openDrawer: openCancelDrawer, closeDrawer: closeCancelDrawer } =
    useDrawer(DrawerIds.CANCEL_LIST_FORM_CONFIRM_DRAWER_ID);

  const listForm = useForm<z.infer<typeof ListFormSchema>>({
    resolver: zodResolver(ListFormSchema),
    defaultValues: {
      title: defaultListInfo.title,
      externalLink: defaultListInfo.externalLink,
      categoryID: defaultListInfo.categoryID,
    },
  });

  const titleTextarea = useAutoResizeTextarea({
    minHeight: 56,
    focusMinHeight: 83,
  });

  const onDismiss = () => {
    if (listForm.formState.isDirty) {
      openCancelDrawer();
    } else {
      navigateTo.backward();
    }
  };

  const onSubmit = (data: z.infer<typeof ListFormSchema>) => {
    onCreateNewList(data);
  };

  const onSubmitFailed = useFormErrorHandler<z.infer<typeof ListFormSchema>>({
    resolver: resolveListFormError,
  });

  const onCreateNewList = withAuth((listData: ListBody) => {
    closeCategoryDrawer();
    createList(listData, {
      onSuccess: (data) => {
        if (!data) {
          throw new Error('Failed to create list');
        }
        if (idea) {
          createIdea(
            { ...idea, listID: data.id },
            {
              onSuccess: () => {
                // removeLocalStorage(LocalStorageKey.LIST_DRAFT);
                clearIfMatchLocalStorage();
                navigateTo.viewList(me.userCode, data.id.toString());
              },
              onError: (error: Error) => {
                toast({
                  title: error.message,
                  variant: MessageType.ERROR,
                });
                setIsLoading(false);
              },
            }
          );
        }
      },
    });
  });

  const [radioChoice, setRadioChoice] = useState<IChoice[]>([]);

  const onCategoryChange = (category: string) => {
    listForm.setValue('categoryID', Number(category));
  };

  useEffect(() => {
    if (!idea) {
      navigateTo.backward();
      return;
    }
    checkAuthAndRedirect();
    listForm.setFocus('title');
  }, []);

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
    if (
      isCreateListLoading ||
      categoriesLoading ||
      listForm.formState.isSubmitting ||
      createIdeaLoading
    ) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [
    isCreateListLoading,
    categoriesLoading,
    listForm.formState.isSubmitting,
    createIdeaLoading,
  ]);

  useEffect(() => {
    // Close drawers when the component is unmounted
    return () => {
      closeCategoryDrawer();
      closeCancelDrawer();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <EditModeHeader
        onClose={() => onDismiss()}
        title={t`Create Idea List`}
        disabled={listForm.watch('title') === ''}
        onSave={() => openCategoryDrawer()}
        saveButtonText={t`Next`}
      />
      <div className="mt-14 border-b border-note-gray-06 bg-gray-note-05 p-4 text-sm text-black-gray-03">
        <Trans>Give it a fun title! Like: My weekend musts</Trans>
      </div>
      <form
        onSubmit={() => {
          void listForm.handleSubmit(onSubmit, onSubmitFailed)();
        }}
        className="relative m-4 flex flex-1 flex-col rounded-2xl bg-white md:max-w-mobile-max"
      >
        <Controller
          name="title"
          control={listForm.control}
          render={({ field }) => {
            return (
              <div className="flex flex-col items-center justify-center">
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
                <div className="mt-2 w-11/12 text-xs text-black-gray-03">
                  <Trans>Don’t worry, you can edit more details later!</Trans>
                </div>
              </div>
            );
          }}
        />
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
    </div>
  );
};

export default TemporaryCreateListPage;
