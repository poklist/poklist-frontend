import { publishQuery } from '@/api/query/publish';
import { SignupDrawerVariant } from '@/components/Drawer/SignupDrawer';
import { useDrawer } from '@/components/Drawer/useDrawer';
import { useFakePage } from '@/components/FakePage/useFakePage';
import {
  Button,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import IconAddCircle from '@/components/ui/icons/AddCircleIcon';
import IconAdd from '@/components/ui/icons/AddIcon';
import IconLeftArrowThin from '@/components/ui/icons/LeftArrowThinIcon';
import IconRightArrowSave from '@/components/ui/icons/RightArrowSaveIcon';
import { DrawerIds } from '@/constants/Drawer';
import { LocalStorageKey } from '@/enums/index.enum';
import { usePostNewIdea } from '@/hooks/api/ideas/usePostNewIdea';
import publishKeys from '@/hooks/api/publish/keys';
import { useCheckCreateQuota } from '@/hooks/queries/publish/useCheckCreateQuota';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { useAuthWrapper } from '@/hooks/useAuth';
import useStrictNavigationAdapter from '@/hooks/useStrictNavigateNext';
import { cn, removeLocalStorage } from '@/lib/utils';
import useAuthStore from '@/stores/useAuthStore';
import useUserStore from '@/stores/useUserStore';
import { Trans } from '@lingui/macro';
import { useState } from 'react';

const ListSelectorFakePage: React.FC = () => {
  const { me } = useUserStore();
  const { isLoggedIn } = useAuthStore();
  const navigateTo = useStrictNavigationAdapter();

  const { isOpen, closeFakePage, payload } = useFakePage();
  const open = isOpen('listSelector');
  const { openDrawer } = useDrawer(DrawerIds.SIGNUP_DRAWER_ID);

  const { withAuth } = useAuthWrapper();

  const { mutate: createIdea } = usePostNewIdea({
    onSuccess: () => {
      navigateTo.viewList(me?.userCode, selectedList);
      onClosePage();
      removeLocalStorage(LocalStorageKey.IDEA_DRAFT);
    },
  });

  const lists = payload?.lists ?? [];

  const { canStillCreate, checkCanCreate, checkCanCreateList } =
    useCheckCreateQuota();

  const ideaLimitResults = publishQuery.getIdeasLimits.useQueries({
    queries: lists.map((list) => ({
      queryKey: publishKeys.ideasLimits(list.id),
      query: { listID: list.id },
      enabled: isLoggedIn,
    })),
  });

  const canAddIdeaMap = new Map<string, boolean>(
    lists.map((list, i) => {
      const content = ideaLimitResults[i]?.data?.body.content;
      const canAdd = content ? canStillCreate(content) : true;
      return [list.id, canAdd];
    })
  );

  const [selectedList, setSelectedList] = useState('');

  const onCreateIdea = useAsyncAction(
    withAuth(async () => {
      if (!(await checkCanCreate(selectedList))) {
        openDrawer({
          isCloseable: true,
          variant: SignupDrawerVariant.IDEA_FULL,
        });
        return;
      }

      if (payload) {
        createIdea({
          body: {
            ...payload?.ideaForm,
            listID: selectedList,
            externalLink: payload.ideaForm.externalLink ?? '',
          },
        });
      }
    })
  );

  const onCreateNewList = useAsyncAction(async () => {
    if (!(await checkCanCreateList())) {
      openDrawer({ isCloseable: true, variant: SignupDrawerVariant.LIST_FULL });
      return;
    }
    if (payload?.ideaForm) {
      closeFakePage();
      navigateTo.temporaryCreateList(payload.ideaForm);
    }
  });

  const onClosePage = () => {
    setSelectedList('');
    closeFakePage();
  };

  return (
    <Dialog open={open} onOpenChange={onClosePage}>
      <DialogContent
        // For console warning
        aria-describedby={undefined}
        className="flex h-dvh w-full items-center border-0 bg-transparent p-0"
      >
        <div className="z-10 flex h-full w-full flex-col items-center bg-white pt-14 md:max-w-mobile-max">
          <div className="fixed top-0 z-10 flex h-14 w-full justify-between overflow-hidden border-b border-b-note-gray-06 bg-white px-4 py-2">
            <div className="flex flex-1 items-center gap-1 font-bold">
              <div
                onClick={() => onClosePage()}
                aria-label="Previous"
                className="flex h-10 w-10 flex-none items-center justify-center"
              >
                <IconLeftArrowThin width={7.5} height={15} color="black" />
              </div>
              <div
                onClick={() => setSelectedList('')}
                className="w-full flex-1"
              >
                <Trans>Save Idea</Trans>
              </div>
            </div>
          </div>
          <div className="w-full bg-white text-black-gray-03">
            <div
              onClick={() => setSelectedList('')}
              className="w-full border-b border-note-gray-06 bg-gray-note-05 p-4"
            >
              <Trans>Select a list to save this idea</Trans>
            </div>
            <div className="max-h-[calc(100dvh-113px)] overflow-y-auto">
              {!payload?.lists || payload.lists?.length <= 0 ? (
                <div className="p-4">
                  <Trans>
                    Looks like you haven’t made a list yet. Let’s create one
                    now!
                  </Trans>
                </div>
              ) : (
                payload.lists?.map((list) => {
                  const canAdd = canAddIdeaMap.get(list.id) ?? true;
                  return (
                    <div
                      onClick={() => {
                        if (canAdd) {
                          setSelectedList(list.id);
                        } else {
                          openDrawer({
                            isCloseable: true,
                            variant: SignupDrawerVariant.IDEA_FULL,
                          });
                        }
                      }}
                      className="flex max-h-14 w-full items-center justify-between border-b border-note-gray-06 bg-white p-4 font-semibold text-black-text-01"
                      key={list.id}
                    >
                      <div
                        className={cn(`line-clamp-1 max-h-14 overflow-hidden`, {
                          'text-black-tint-04':
                            selectedList !== list.id && selectedList !== '',
                          // ||
                          // !canAdd,
                        })}
                      >
                        {list.title}
                      </div>
                      {canAdd ? (
                        selectedList === list.id ? (
                          <div
                            onClick={() => {
                              if (canAdd) {
                                onCreateIdea();
                              } else {
                                openDrawer({
                                  isCloseable: true,
                                  variant: SignupDrawerVariant.IDEA_FULL,
                                });
                              }
                            }}
                            className="flex min-w-16 items-center gap-0.5 rounded-lg bg-black-text-01 px-2 py-1.5 font-semibold leading-snug text-white"
                          >
                            <Trans>Save</Trans>
                            <IconRightArrowSave
                              width={14}
                              height={12}
                              className="min-w-3.5"
                            />
                          </div>
                        ) : (
                          <IconAddCircle
                            width={18}
                            height={18}
                            className="min-w-[18px]"
                          />
                        )
                      ) : (
                        <></>
                      )}
                    </div>
                  );
                })
              )}
              <div className="my-4 px-4">
                <div className="" onClick={() => setSelectedList('')}>
                  <Button
                    disabled={selectedList !== ''}
                    onClick={() => onCreateNewList()}
                    variant={ButtonVariant.BLACK}
                    size={ButtonSize.H40}
                    shape={ButtonShape.ROUNDED_8PX}
                    className="flex justify-start gap-2 px-5"
                  >
                    <IconAdd width={12} height={12} className="text-white" />
                    <Trans>Create a new list</Trans>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ListSelectorFakePage;
