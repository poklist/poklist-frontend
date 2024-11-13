import { DrawerComponent, useDrawer } from '@/components/Drawer';
import { RadioComponent } from '@/components/Radio';
import { Button } from '@/components/ui/button';
import { RadioType } from '@/enums/Style/index.enum';
import useCommonStore from '@/stores/useCommonStore';
import { t, Trans } from '@lingui/macro';
import { useState } from 'react';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const { setShowingAlert } = useCommonStore();
  const { openDrawer } = useDrawer();

  const listTagOptions = [
    {
      value: 'lifestyle',
      label: t`生活風格`,
    },
    {
      value: 'foodie',
      label: t`美食`,
    },
    {
      value: 'culture',
      label: t`文化`,
    },
    {
      value: 'travel',
      label: t`旅遊`,
    },
    {
      value: 'funny',
      label: t`娛樂`,
    },
    {
      value: 'technology',
      label: t`數位科技`,
    },
    {
      value: 'improve',
      label: t`個人成長`,
    },
    {
      value: 'health',
      label: t`健康與健身`,
    },
    {
      value: 'other',
      label: t`其他`,
    },
  ];

  const [defaultValue, setDefaultValue] = useState<string>();

  const atRadioChange = (value: string) => {
    setDefaultValue(value);
  };

  return (
    // Your component code here
    <>
      <button onClick={() => setShowingAlert(true, { message: t`欸，標題不能留空喔！` })}>
        Delete Sense
      </button>
      <Trans>欸，標題不能留空喔！</Trans>
      <div onClick={() => openDrawer()} className="border">
        Open drawer
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
          <div className="mt-6 mb-10">
            <RadioComponent
              defaultValue={defaultValue}
              choices={listTagOptions}
              onChange={value => atRadioChange(value)}
              type={RadioType.BUTTON}
              className="flex gap-2 flex-wrap"
            />
          </div>
        }
        footer={
          <div className="flex justify-end">
            <Button className="w-fit px-3 text-white">
              <Trans>下一步</Trans>
            </Button>
          </div>
        }
      />
    </>
  );
};

export default CreatePage;
