import { useEffect } from 'react';

// Updates the height of a <textarea> when the value changes.
const useAutosizeTextArea = (
  textAreaRef: React.RefObject<HTMLTextAreaElement>,
  value: string
) => {
  useEffect(() => {
    if (textAreaRef.current) {
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = '0px';
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      textAreaRef.current.style.height = scrollHeight + 'px';
    }
  }, [textAreaRef, value]);

  useEffect(() => {
    if (textAreaRef.current) {
      // Set cursor position to the end
      textAreaRef.current.selectionStart = textAreaRef.current.value.length;
      textAreaRef.current.selectionEnd = textAreaRef.current.value.length;
    }
  }, [textAreaRef]);
};

export default useAutosizeTextArea;
