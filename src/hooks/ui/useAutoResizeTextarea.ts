import { useCallback, useRef, useState } from 'react';

type Options = {
  minHeight?: number; // 未 Focus 時
  focusMinHeight?: number; // focus 時
};

const useAutoResizeTextarea = (options?: Options) => {
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const [isFocus, setIsFocus] = useState(false);

  const adjustHeight = useCallback((minHeight: number) => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.max(el.scrollHeight, minHeight)}px`;
  }, []);

  const onFocus = useCallback(() => {
    setIsFocus(true);
    adjustHeight(options?.focusMinHeight ?? 83);
  }, [adjustHeight, options?.focusMinHeight]);

  const onBlur = useCallback(() => {
    setIsFocus(false);
    adjustHeight(options?.minHeight ?? 56);
  }, [adjustHeight, options?.minHeight]);

  const onChange = useCallback(() => {
    adjustHeight(options?.minHeight ?? 56);
  }, [adjustHeight, options?.minHeight]);

  return {
    ref,
    isFocus,
    bind: {
      onFocus,
      onBlur,
      onChange,
    },
  };
};

export default useAutoResizeTextarea;
