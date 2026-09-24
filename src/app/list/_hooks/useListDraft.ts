import { useDrawer } from '@/components/Drawer/useDrawer';
import { DrawerIds } from '@/constants/Drawer';
import { LocalStorageKey } from '@/enums/index.enum';
import useAutoResizeTextarea from '@/hooks/ui/useAutoResizeTextarea';
import useIdle from '@/hooks/useIdle';
import { getLocalStorage, setLocalStorage } from '@/lib/utils';
import { ListFormSchema } from '@/types/common';
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import z from 'zod';

interface UseListDraftOptions {
  listForm: UseFormReturn<z.infer<typeof ListFormSchema>>;
  isCreate: boolean;
  mounted: boolean;
  titleTextarea: ReturnType<typeof useAutoResizeTextarea>;
  descriptionTextarea: ReturnType<typeof useAutoResizeTextarea>;
}

export const useListDraft = ({
  listForm,
  isCreate,
  mounted,
  titleTextarea,
  descriptionTextarea,
}: UseListDraftOptions) => {
  const { openDrawer: openDraftDrawer, closeDrawer: closeDraftDrawer } =
    useDrawer(DrawerIds.LIST_DRAFT_DRAWER_ID);
  const { isIdle, stop, reset } = useIdle({
    timeout: 2000,
    watch: listForm.watch,
  });

  const onRestoreDraft = () => {
    const listDraft = getLocalStorage(
      LocalStorageKey.LIST_DRAFT,
      ListFormSchema
    );
    if (!listDraft) return;
    listForm.setValue('title', listDraft.title || '', {
      shouldDirty: listDraft.title !== '',
    });
    listForm.setValue('description', listDraft.description || '');
    listForm.setValue('coverImage', listDraft.coverImage || '');
    listForm.setValue('externalLink', listDraft.externalLink || '');
    listForm.setValue('categoryID', listDraft.categoryID || 0);
    closeDraftDrawer();
    setTimeout(() => {
      titleTextarea.bind.onChange();
      descriptionTextarea.bind.onChange();
      listForm.setFocus('title');
    }, 0);
  };

  useEffect(() => {
    if (!mounted || !isCreate) return;
    const draft = getLocalStorage(LocalStorageKey.LIST_DRAFT, ListFormSchema);
    if (draft) openDraftDrawer();
  }, [mounted, isCreate]);

  useEffect(() => {
    if (!(isIdle && listForm.formState.isDirty) || !isCreate) {
      return;
    }
    setLocalStorage(
      LocalStorageKey.LIST_DRAFT,
      listForm.getValues(),
      ListFormSchema
    );
    reset();
  }, [isIdle, listForm.formState.isDirty, isCreate]);

  return { onRestoreDraft, closeDraftDrawer, stop };
};
