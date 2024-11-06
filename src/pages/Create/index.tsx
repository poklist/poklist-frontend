import useCommonStore from '@/stores/useCommonStore';

interface CreatePageProps {
  // Add any props you need for the page
}

const CreatePage: React.FC<CreatePageProps> = () => {
  // Render the page here
  const { setShowingAlert } = useCommonStore();
  // setShowingAlert(true, { message: '已刪除靈感!' });

  return (
    // Your component code here
    <>
      <button onClick={() => setShowingAlert(true, { message: '已刪除靈感!' })}>
        Delete Sense
      </button>
    </>
  );
};

export default CreatePage;
