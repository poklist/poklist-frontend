import ImageUploader from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IEditIdeaRequest } from '@/hooks/Ideas/useEditIdea';
import { IIdeaInfo } from '@/hooks/Ideas/useGetIdea';
import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { zodResolver } from '@hookform/resolvers/zod';
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
});

interface IIdeaFormProps {
  previousIdeaInfo?: IIdeaInfo;
  dismissCallback: (isFormNotEdited: boolean) => void;
  completedCallback: (editedIdeaData: Omit<IEditIdeaRequest, 'id'>) => void;
}

const IdeaFormComponent: React.FC<IIdeaFormProps> = ({
  previousIdeaInfo,
  dismissCallback,
  completedCallback,
}) => {
  const { setShowErrorDrawer, setShowingAlert, setIsLoading } = useCommonStore();

  const [isTextareaFocus, setIsTextareaFocus] = useState(false);
  const [isFormModified, setIsFormModified] = useState(false);

  const ideaForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: previousIdeaInfo?.title,
      description: previousIdeaInfo?.description,
      externalLink: previousIdeaInfo?.externalLink,
      coverImage: previousIdeaInfo?.coverImage,
    },
  });

  useEffect(() => {
    const subscription = ideaForm.watch(fields => {
      const isModified =
        fields.title !== previousIdeaInfo?.title ||
        fields.description !== previousIdeaInfo?.description ||
        fields.externalLink !== previousIdeaInfo?.externalLink ||
        fields.coverImage !== previousIdeaInfo?.coverImage;
      setIsFormModified(isModified);
    });
    return () => subscription.unsubscribe();
  }, [ideaForm.watch(), previousIdeaInfo]);

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
        content: t`Title is saved, but your idea edits will be lost! Are you sure you want to cancel? `,
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
            content: t`Every idea needs a title, so fill it in! `,
          });
        }
        if (value.title?.type === 'too_big') {
          setShowErrorDrawer(true, {
            title: t`Idea title is too long! `,
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
    ideaForm.setValue('coverImage', file);
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
    footerPosition();
  }, []);

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
    <form
      onSubmit={ideaForm.handleSubmit(onSubmit, onSubmitFailed)}
      className="flex flex-col gap-6"
    >
      <div
        className={cn(`flex items-center`, {
          'before:h-8 before:w-0.5 before:bg-black-text-01 before:z-10':
            ideaForm.watch('title') === '',
        })}
      >
        <Input
          placeholder={t`What’s your Idea?`}
          className="border-none relative text-h1 placeholder:text-h1 px-0"
          {...ideaForm.register('title')}
        />
      </div>
      <div className="flex gap-2 items-start">
        <IconTextarea className="" />
        <Textarea
          placeholder={t`Describe what this Idea is about`}
          className={cn(`border-none p-0 resize-none`, {
            'min-h-6 h-6 line-clamp-1': !isTextareaFocus,
          })}
          {...ideaForm.register('description')}
          onFocus={() => setIsTextareaFocus(true)}
          onBlur={() => setIsTextareaFocus(false)}
        />
      </div>
      {isTextareaFocus && (
        <div className="text-black-tint-04 flex justify-end mt-2">
          {ideaForm.watch('description').length}/{DESC_MAX_LENGTH}
        </div>
      )}
      <div className="flex gap-2 items-center">
        <IconExteriorLink className="" />
        <Input
          {...ideaForm.register('externalLink')}
          placeholder={t`Link a page`}
          className="border-none w-full p-0 h-6"
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
          render={({ field }) => <ImageUploader file={field.value} callback={onCoverImageChange} />}
        />
      </div>
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
          <Trans>Edit Idea</Trans>
        </div>
        <Button disabled={!isFormModified} type="submit" variant="black" shape="rounded8px">
          <Trans>Next</Trans>
        </Button>
      </div>
    </form>
  );
};
export default IdeaFormComponent;