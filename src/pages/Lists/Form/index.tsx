import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useRef, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';

const TITLE_MAX_LENGTH = 60;
const DESC_MAX_LENGTH = 250;
const FormSchema = z.object({
  title: z.string().min(1).max(TITLE_MAX_LENGTH),
  content: z.string().max(DESC_MAX_LENGTH),
});

interface IListFormProps {
  checkEmptyCallback: () => boolean;
  completedCallback: (list: { title: string; content: string }) => void;
}

export const ListForm: React.FC<IListFormProps> = ({
  checkEmptyCallback,
  completedCallback,
}) => {
  const [isTextareaFocus, setIsTextareaFocus] = useState(false);

  const listForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: '', content: '' },
  });

  const { setShowErrorDrawer } = useCommonStore();

  const onDismiss = () => {
    if (
      listForm.getValues('title') !== '' ||
      listForm.getValues('content') !== '' ||
      checkEmptyCallback()
    )
      setShowErrorDrawer(true, {
        title: t`Your edits will be lost if you cancel! `,
        content: t`If you cancel, everything you’ve entered will be lost. `,
      });
  };

  const onSubmitFailed = (
    value: FieldErrors<{ title: string; content: string }>
  ) => {
    // TODO 目前解法
    switch (Object.keys(value)[0]) {
      case 'title': {
        if (Object.values(value)[0].type === 'too_small') {
          setShowErrorDrawer(true, {
            title: t`Hey, the title can’t be left empty! `,
            content: t`Every list needs a title, so fill it in! `,
          });
        }
        if (Object.values(value)[0].type === 'too_big') {
          setShowErrorDrawer(true, {
            title: t`List title is too long! `,
            content: t`Please keep it under ${TITLE_MAX_LENGTH} characters. `,
          });
        }

        break;
      }
      case 'content': {
        if (Object.values(value)[0].type === 'too_big') {
          setShowErrorDrawer(true, {
            title: t`Description is too long! `,
            content: t`Please keep it under ${DESC_MAX_LENGTH} characters. `,
          });
        }

        break;
      }
      default: {
        return;
      }
    }
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

  return (
    <Form {...listForm}>
      <form
        onSubmit={listForm.handleSubmit(onSubmit, onSubmitFailed)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={listForm.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div
                  className={cn(`flex items-center justify-center`, {
                    'before:z-10 before:h-8 before:w-0.5 before:bg-black-text-01':
                      listForm.getValues('title') === '',
                  })}
                >
                  <Input
                    placeholder={t`輸入名單標題`}
                    className="relative w-min border-none text-center"
                    {...field}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={listForm.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  <div className="flex items-start gap-2">
                    <IconTextarea className="" />
                    <Textarea
                      placeholder={t`描述標題`}
                      className={cn(`resize-none border-none p-0`, {
                        'line-clamp-1 h-6 min-h-6': !isTextareaFocus,
                      })}
                      {...field}
                      onFocus={() => setIsTextareaFocus(true)}
                      onBlur={() => setIsTextareaFocus(false)}
                    />
                  </div>
                  {isTextareaFocus && (
                    <div className="mt-2 flex justify-end text-black-tint-04">
                      {listForm.getValues('content').length}/{DESC_MAX_LENGTH}
                    </div>
                  )}
                </>
              </FormControl>
            </FormItem>
          )}
        />
        <div
          ref={submitFooterRef}
          className="fixed left-0 z-10 flex w-dvw justify-between border-t border-t-gray-main-03 px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onDismiss()}
              aria-label="Previous"
              className="h-auto rounded-full bg-inherit p-0"
            >
              <IconClose />
            </Button>
            <Trans>Create List</Trans>
          </div>
          <Button
            disabled={listForm.getValues('title') === ''}
            type="submit"
            variant="black"
            shape="rounded8px"
          >
            <Trans>Next</Trans>
          </Button>
        </div>
      </form>
    </Form>
  );
};
