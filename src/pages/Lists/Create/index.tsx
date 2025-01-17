import { DrawerComponent, useDrawer } from '@/components/Drawer';
import ImageUploader from '@/components/ImageUploader';
import { IChoice, RadioComponent } from '@/components/Radio';
import { Button } from '@/components/ui/button';
import IconExteriorLink from '@/components/ui/icons/ExteriorLinkIcon';
import { Input } from '@/components/ui/input';
import { RadioType } from '@/enums/Style/index.enum';
import useCategories from '@/hooks/Lists/useCategories';
import useCreateList from '@/hooks/Lists/useCreateList';
import { ListForm } from '@/pages/Lists/Form';
import { Header } from '@/pages/Lists/Header';
import { CategoriesI18n } from '@/pages/Lists/i18n';
import useCommonStore from '@/stores/useCommonStore';
import { i18n } from '@lingui/core';
import { t, Trans } from '@lingui/macro';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const { setIsLoading } = useCommonStore();
  const navigate = useNavigate();
  const { openDrawer, closeDrawer } = useDrawer();

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

  const [radioChoice, setRadioChoice] = useState<IChoice[]>([]);

  useEffect(() => {
    const _radioChoice = categories.map(_category => {
      const { id: value } = { id: String(_category.id) };
      const label = i18n._(CategoriesI18n[_category.id]);
      return { value, label };
    });
    setRadioChoice(_radioChoice);
  }, [categories]);

  const onCreateList = async () => {
    closeDrawer();
    const response = await fetchPostCreateList();
    if (response) {
      navigate(`/list/manage/${response.id}`);
    }
  };

  return (
    // Your component code here
    <>
      <Header title={<Trans>List Title</Trans>} />
      <div className="mt-6 flex flex-col gap-6 mx-4">
        <ListForm completedCallback={onOpenCategoryDrawer} checkEmptyCallback={isListDataEmpty} />
        <div className="flex gap-2 items-center">
          <IconExteriorLink className="" />
          <Input
            value={listData.externalLink}
            onChange={e => setListData({ ...listData, externalLink: e.target.value })}
            placeholder={t`Link a page`}
            className="border-none w-full p-0 h-6"
          />
        </div>
        <div className="flex justify-center items-center sm:justify-start">
          <ImageUploader file={listData.coverImage} callback={onCoverImageChange} />
        </div>
      </div>
      <DrawerComponent
        isShowClose={false}
        header={
          <div className="mb-1 font-bold w-fit text-black-text-01">
            <Trans>List Topic</Trans>
          </div>
        }
        subHeader={<Trans>Choose a topic that vibes with your List. </Trans>}
        content={
          !categoriesLoading && (
            <div className="mt-6 mb-10">
              <RadioComponent
                defaultValue={String(listData.categoryID)}
                choices={radioChoice}
                onChange={value => setListData({ ...listData, categoryID: Number(value) })}
                type={RadioType.BUTTON}
                className="flex gap-2 flex-wrap"
              />
            </div>
          )
        }
        footer={
          <div className="flex justify-end">
            <Button onClick={() => onCreateList()} variant="black" shape="rounded8px">
              <Trans>Next</Trans>
            </Button>
          </div>
        }
      />
    </>
  );
};

export default CreatePage;
