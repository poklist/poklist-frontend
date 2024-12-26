import { cn } from '@/lib/utils';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/themes';
import React from 'react';

const Dialog = ({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) => (
  <DialogPrimitive.Root {...props} />
);
Dialog.displayName = 'Dialog';

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col border bg-background px-4 py-6',
        className
      )}
      {...props}
    >
      <VisuallyHidden>
        <DialogPrimitive.Title></DialogPrimitive.Title>
      </VisuallyHidden>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));

const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;
const DialogTitle = DialogPrimitive.Title;
const DialogDescription = DialogPrimitive.Description;

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
};
