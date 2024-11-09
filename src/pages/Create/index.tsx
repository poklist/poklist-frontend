// import { Drawer, useDrawer } from '@/components/ui/Drawer';
import useCommonStore from '@/stores/useCommonStore';
import { t } from '@lingui/macro';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const { setShowingAlert } = useCommonStore();
  // const { openDrawer } = useDrawer();

  return (
    // Your component code here
    <>
      <button onClick={() => setShowingAlert(true, { message: t`欸，標題不能留空喔！` })}>
        Delete Sense
      </button>
      {/* <div onClick={() => openDrawer()} className="border">
        Open drawer
      </div>
      <Drawer
        isShowClose={true}
        header={<>一次寫一個靈感！</>}
        content={
          <>
            <>靈感來了？一個一個丟進Poklist！</>
            <>在Poklist，一次寫一個靈感。送出後繼續下一個！靈感不斷，超EASY！</>
          </>
        }
        footer={<div className="">繼續編輯</div>}
      /> */}
    </>
  );
};

export default CreatePage;
