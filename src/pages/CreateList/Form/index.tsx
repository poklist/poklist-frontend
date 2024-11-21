import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import IconClose from '@/components/ui/icons/CloseIcon';
import IconTextarea from '@/components/ui/icons/TextareaIcon';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
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
  callback: (list: { title: string; content: string }) => void;
}

export const ListForm: React.FC<IListFormProps> = ({ callback }) => {
  const [isTextareaFocus, setIsTextareaFocus] = useState(false);

  const listForm = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { title: '', content: '' },
  });

  const [openDrawer, setOpenDrawer] = useState(false);

  const [errorDrawer, setErrorDrawer] = useState({
    title: '',
    content: '',
  });

  const onSubmitFailed = (value: FieldErrors<{ title: string; content: string }>) => {
    // TODO 目前解法
    switch (Object.keys(value)[0]) {
      case 'title': {
        if (Object.values(value)[0].type === 'too_small') {
          setErrorDrawer({
            title: t`欸，標題不能留空喔！`,
            content: t`名單都得有個標題，趕快填一下吧！`,
          });
        }
        if (Object.values(value)[0].type === 'too_big') {
          setErrorDrawer({
            title: t`名單標題字數太長啦！`,
            content: t`標題過長，請將字數縮短至 ${TITLE_MAX_LENGTH} 個字元以內。`,
          });
        }
        setOpenDrawer(true);
        break;
      }
      case 'content': {
        if (Object.values(value)[0].type === 'too_big') {
          setErrorDrawer({
            title: t`標題描述內容超出限制了！`,
            content: t`字數有點爆表，請減到 ${DESC_MAX_LENGTH} 個字元以內。`,
          });
        }
        setOpenDrawer(true);
        break;
      }
      default: {
        return;
      }
    }
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    callback(data);
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
    <>
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
                    className={cn(`flex justify-center items-center`, {
                      'before:h-8 before:w-0.5 before:bg-black-text-01 before:z-10':
                        listForm.getValues('title') === '',
                    })}
                  >
                    <Input
                      placeholder={t`輸入名單標題`}
                      className="border-none text-center relative w-min"
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
                    <div className="flex gap-2 items-start">
                      <IconTextarea className="" />
                      <Textarea
                        placeholder={t`描述標題`}
                        className={cn(`border-none p-0 resize-none`, {
                          'min-h-6 h-6 line-clamp-1': !isTextareaFocus,
                        })}
                        {...field}
                        onFocus={() => setIsTextareaFocus(true)}
                        onBlur={() => setIsTextareaFocus(false)}
                      />
                    </div>
                    {isTextareaFocus && (
                      <div className="text-black-tint-04 flex justify-end mt-2">
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
            className="border-t-gray-main-03 border-t fixed flex px-4 py-2 w-dvw justify-between left-0 z-10"
          >
            <div className="flex items-center gap-2">
              <Button aria-label="Previous" className="p-0 h-auto rounded-full bg-inherit">
                <IconClose />
              </Button>
              <Trans>建立名單</Trans>
            </div>
            <Button type="submit">
              <Trans>下一步</Trans>
            </Button>
          </div>
        </form>
      </Form>
      <Drawer open={openDrawer} onOpenChange={setOpenDrawer}>
        <DrawerContent className="bottom-0 bg-white shadow">
          <div className="flex justify-end">
            <DrawerClose
              aria-label="Close"
              className="h-6 w-6 rounded-full bg-black-text-01 text-center leading-6 text-white mb-3 focus-visible:outline-none"
            >
              <span aria-hidden>×</span>
            </DrawerClose>
          </div>
          <DrawerHeader className="relative w-full items-center">
            <DrawerTitle>{errorDrawer.title}</DrawerTitle>
            <DrawerDescription>{errorDrawer.content}</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
};
