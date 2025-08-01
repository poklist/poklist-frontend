import useTimeout from '@/hooks/useTimeout';
import { useState } from 'react';

const DELAY = 1500;

const useClipboard = (): {
  isSupport: boolean;
  text: string | null;
  isCopied: boolean;
  copy: (text: string) => Promise<void>;
} => {
  const [isSupport] = useState(false);

  const [text, setText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const timeout = useTimeout(() => setIsCopied(false), DELAY);

  const copy = async (text: string) => {
    if (isSupport) {
      await navigator.clipboard.writeText(text);
    } else {
      const _textarea = document.createElement('textarea');
      _textarea.value = text ?? '';
      _textarea.style.position = 'absolute';
      _textarea.style.opacity = '0';
      document.body.appendChild(_textarea);
      _textarea.select();
      document.execCommand('copy');
      _textarea.remove();
    }
    setText(text);
    setIsCopied(true);
    timeout.start();
  };

  return {
    isSupport,
    text,
    isCopied,
    copy,
  };
};
export default useClipboard;
