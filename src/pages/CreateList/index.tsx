import { DrawerComponent, useDrawer } from '@/components/Drawer';
import ImageUploader from '@/components/ImageUploader';
import { RadioComponent } from '@/components/Radio';
import { Button } from '@/components/ui/button';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import { Input } from '@/components/ui/input';
import { RadioType } from '@/enums/Style/index.enum';
import useCategories from '@/hooks/CreateList/useCategories';
import useCreateList from '@/hooks/CreateList/useCreateList';
import { Header } from '@/pages/CreateList/Header';
import useCommonStore from '@/stores/useCommonStore';
import { t, Trans } from '@lingui/macro';
import React, { useEffect } from 'react';
import { ListForm } from './Form';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const { setIsLoading } = useCommonStore();
  const { openDrawer } = useDrawer();

  const { createListLoading, listData, setListData, fetchPostCreateList } = useCreateList();

  const onCoverImageChange = (file: File | null) => {
    setListData({ ...listData, coverImage: file });
  };

  const onOpenCategoryDrawer = (list: { title: string; content: string }) => {
    setListData({ ...listData, title: list.title, description: list.content });
    openDrawer();
  };

  const { categoriesLoading, categories, fetchGetCategories } = useCategories();

  const isListDataEmpty = () => {
    if (listData.title !== '') {
      return false;
    }
    if (listData.description !== '') {
      return false;
    }
    if (listData.externalLink !== '') {
      return false;
    }
    if (listData.coverImage === null) {
      return false;
    }

    return true;
  };

  useEffect(() => {
    fetchGetCategories();
  }, []);

  useEffect(() => {
    if (categoriesLoading) {
      setIsLoading(true);
    } else if (createListLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [categoriesLoading, createListLoading, setIsLoading]);

  return (
    // Your component code here
    <>
      <Header title={<Trans>名單標題</Trans>} />
      <div className="mt-6 flex flex-col gap-6 mx-4">
        <ListForm completedCallback={onOpenCategoryDrawer} checkEmptyCallback={isListDataEmpty} />
        <div className="flex gap-2 items-center">
          <IconExteriorLink className="" />
          <Input
            value={listData.externalLink}
            onChange={e => setListData({ ...listData, externalLink: e.target.value })}
            placeholder={t`連結網頁`}
            className="border-none w-full p-0 h-6"
          />
        </div>
        <div className="flex justify-center items-center">
          <ImageUploader file={listData.coverImage} callback={onCoverImageChange} />
        </div>
      </div>
      <DrawerComponent
        isShowClose={false}
        header={
          <div className="mb-1 font-bold w-fit text-black-text-01">
            <Trans>名單分類</Trans>
          </div>
        }
        subHeader={
          <div className=" text-black-text-01">
            <Trans>選擇一項接近此份名單的分類</Trans>
          </div>
        }
        content={
          !categoriesLoading && (
            <div className="mt-6 mb-10">
              <RadioComponent
                defaultValue={listData.categoryID}
                choices={categories}
                onChange={value => setListData({ ...listData, categoryID: value })}
                type={RadioType.BUTTON}
                className="flex gap-2 flex-wrap"
              />
            </div>
          )
        }
        footer={
          <div className="flex justify-end">
            <Button onClick={() => fetchPostCreateList()} className="w-fit px-3 text-white">
              <Trans>下一步</Trans>
            </Button>
          </div>
        }
      />
    </>
  );
};

export default CreatePage;
