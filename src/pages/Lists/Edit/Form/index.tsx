import { DrawerComponent, useDrawer } from '@/components/Drawer';
import ImageUploader from '@/components/ImageUploader';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioType } from '@/enums/Style/index.enum';
import useCategories from '@/hooks/Lists/useCategories';
import { ICreateListRequest } from '@/hooks/Lists/useCreateList';
import { IEditListRequest } from '@/hooks/Lists/useEditList';
import { cn } from '@/lib/utils';
import { CategoriesI18n } from '@/pages/Lists/i18n';
import useCommonStore from '@/stores/useCommonStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';

const TITLE_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 250;

const FormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  description: z.string().max(DESC_MAX_LENGTH),
  externalLink: z.string().url().or(z.literal('')),
  coverImage: z.instanceof(File).nullable(),
  categoryID: z.number().nonnegative(),
});

interface IListFormProps {
  defaultListInfo?: ICreateListRequest;
  dismissCallback: (isFormEmpty: boolean) => void;
  completedCallback: (ideaFormData: Omit<IEditListRequest, 'listID'>) => void;
}

const ListForm: React.FC<IListFormProps> = ({
  defaultListInfo,
  dismissCallback,
  completedCallback,
}) => {
  const { setShowErrorDrawer, setShowingAlert, setIsLoading } = useCommonStore();
  const { openDrawer, closeDrawer } = useDrawer();
  const { categoriesLoading, categories, fetchGetCategories } = useCategories();
  const onOpenCategoryDrawer = () => {
    openDrawer();
  };

  const onCloseCategoryDrawer = () => {
    closeDrawer();
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

  useEffect(() => {
    const subscription = listForm.watch(fields => {
      const isModified =
        fields.title !== defaultListInfo?.title ||
        fields.description !== defaultListInfo?.description ||
        fields.externalLink !== defaultListInfo?.externalLink ||
        fields.coverImage !== defaultListInfo?.coverImage ||
        fields.categoryID !== defaultListInfo?.categoryID;
      setIsFormModified(isModified);
    });
    return () => subscription.unsubscribe();
  }, [listForm.watch(), defaultListInfo]);

  const isFieldNotEmpty = (value: string | number | File | null | undefined) => {
    if (value === '' || value === 0 || value === null || value === undefined) return false;
    if (value instanceof File && value.size === 0) return false;
    return true;
  };

  const onDismiss = () => {
    let isFormEmpty = true;
    if (isFormModified) {
      setShowErrorDrawer(true, {
        title: t`Your edits will be lost if you cancel! `,
        content: t`If you cancel, everything you’ve entered will be lost. `,
      });
      isFormEmpty = false;
    }
    dismissCallback(isFormEmpty);
  };

  const onSubmitFailed = (
    value: FieldErrors<{
      title: string;
      description: string;
      externalLink?: string | undefined;
      coverImage?: File | null | undefined;
    }>,
  ) => {
    const errorKey = Object.keys(value)[0];
    // TODO 目前解法
    switch (errorKey) {
      case 'title': {
        if (value.title?.type === 'too_small') {
          setShowErrorDrawer(true, {
            title: t`Hey, the title can’t be left empty! `,
            content: t`Every list needs a title, so fill it in! `,
          });
        }
        if (value.title?.type === 'too_big') {
          setShowErrorDrawer(true, {
            title: t`List title is too long! `,
            content: t`Please keep it under ${TITLE_MAX_LENGTH} characters. `,
          });
        }

        break;
      }
      case 'description': {
        if (value.description?.type === 'too_big') {
          setShowErrorDrawer(true, {
            title: t`Description is too long! `,
            content: t`Please keep it under ${DESC_MAX_LENGTH} characters. `,
          });
        }

        break;
      }
      case 'externalLink': {
        setShowingAlert(true, { message: value.externalLink?.message || 'Invalid url' });
        break;
      }

      default: {
        return;
      }
    }
  };

  const onCoverImageChange = (file: File | null) => {
    listForm.setValue('coverImage', file);
  };

  const onCategoryChange = (category: string) => {
    listForm.setValue('categoryID', Number(category));
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    completedCallback(data);
  };

  const submitFooterRef = useRef<HTMLDivElement>(null);

  const footerPosition = () => {
    if (submitFooterRef.current && window.visualViewport) {
      submitFooterRef.current.style.top = `${window.visualViewport.height - submitFooterRef.current.offsetHeight}px`;
    }
  };
  useEffect(() => {
    fetchGetCategories();
    footerPosition();
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
    } else if (!defaultListInfo) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [categoriesLoading, setIsLoading]);

  const [radioChoice, setRadioChoice] = useState<IChoice[]>([]);

  useEffect(() => {
    const _radioChoice = categories.map(_category => {
      const { id: value } = { id: String(_category.id) };
      const label = i18n._(CategoriesI18n[_category.id]);
      return { value, label };
    });
    setRadioChoice(_radioChoice);
  }, [categories]);
  return (
    <form
      onSubmit={listForm.handleSubmit(onSubmit, onSubmitFailed)}
      className="flex flex-col gap-6"
    >
      <div
        className={cn(`flex items-center`, {
          'before:h-8 before:w-0.5 before:bg-black-text-01 before:z-10':
            listForm.watch('title') === '',
        })}
      >
        <Input
          placeholder={t`What’s your Idea?`}
          className="border-none relative text-h1 placeholder:text-h1"
          {...listForm.register('title')}
        />
      </div>
      <div className="flex gap-2 items-start">
        <IconTextarea className="" />
        <Textarea
          placeholder={t`Describe what this Idea is about`}
          className={cn(`border-none p-0 resize-none`, {
            'min-h-6 h-6 line-clamp-1': !isTextareaFocus,
          })}
          {...listForm.register('description')}
          onFocus={() => setIsTextareaFocus(true)}
          onBlur={() => setIsTextareaFocus(false)}
        />
      </div>
      {isTextareaFocus && (
        <div className="text-black-tint-04 flex justify-end mt-2">
          {listForm.watch('description').length}/{DESC_MAX_LENGTH}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <IconExteriorLink className="" />
        <Input
          {...listForm.register('externalLink')}
          placeholder={t`Link a page`}
          className="border-none w-full p-0 h-6"
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
          render={({ field }) => <ImageUploader file={field.value} callback={onCoverImageChange} />}
        />
      </div>
      <div
        onClick={() => onOpenCategoryDrawer()}
        className="inline-flex items-center justify-center whitespace-nowrap font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none bg-black text-white disabled:bg-gray-main-03 disabled:text-black-tint-04 rounded-lg h-10 text-h2 cursor-pointer"
      >
        <Trans>Edit List Topic</Trans>
      </div>
      <DrawerComponent
        isShowClose={false}
        header={
          <div className="mb-1 font-bold w-fit text-black-text-01">
            <Trans>List Topic</Trans>
          </div>
        }
        subHeader={<Trans>Choose a topic that vibes with your List. </Trans>}
        content={
          !categoriesLoading && (
            <div className="mt-6 mb-10">
              <Controller
                name="categoryID"
                control={listForm.control}
                render={({ field }) => (
                  <RadioComponent
                    defaultValue={String(field.value)}
                    choices={radioChoice}
                    onChange={onCategoryChange}
                    type={RadioType.BUTTON}
                    className="flex gap-2 flex-wrap"
                  />
                )}
              />
            </div>
          )
        }
        footer={
          <div className="flex justify-end">
            <Button onClick={() => onCloseCategoryDrawer()} variant="black" shape="rounded8px">
              <Trans>Next</Trans>
            </Button>
          </div>
        }
      />
      <div
        ref={submitFooterRef}
        className="border-t-gray-main-03 border-t fixed flex px-4 py-2 w-dvw justify-between left-0 z-10"
      >
        <div className="flex items-center gap-2">
          <div
            onClick={() => onDismiss()}
            aria-label="Previous"
            className="p-0 h-auto rounded-full bg-inherit"
          >
            <IconClose />
          </div>
          <Trans>Edit List Title</Trans>
        </div>
        <Button disabled={!isFormModified} type="submit" variant="black" shape="rounded8px">
          <Trans>Next</Trans>
        </Button>
      </div>
    </form>
  );
};
export default ListForm;
