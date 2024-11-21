import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import React from 'react';

interface ITextArea {
  showIcon?: boolean;
  showLimit?: boolean;
}

export const TextareaComponent: React.FC<ITextArea> = ({ showIcon, showLimit }) => {
  return <Textarea className={cn(`border-none`, { '': showIcon })}></Textarea>;
};
