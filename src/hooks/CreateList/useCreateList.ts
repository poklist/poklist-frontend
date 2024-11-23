import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { ICreateListRequest } from '@/types/CreateList';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

const useCreateList = (): {
  createListLoading: boolean;
  listData: ICreateListRequest;
  setListData: React.Dispatch<React.SetStateAction<ICreateListRequest>>;
  fetchPostCreateList: () => Promise<void>;
} => {
  const { setShowingAlert } = useCommonStore();

  const [listData, setListData] = useState<ICreateListRequest>({
    title: '',
    description: '',
    externalLink: '',
    coverImage: null,
    categoryID: '',
  });

  const resetListData = () => {
    setListData({
      title: '',
      description: '',
      externalLink: '',
      coverImage: null,
      categoryID: '',
    });
  };

  const [createListLoading, setCreateListLoading] = useState(false);

  const fetchPostCreateList = async () => {
    setCreateListLoading(true);
    try {
      const response: AxiosResponse = await axios.post(ApiPath.createList, listData);
      console.log(response);
      // if success
      resetListData();
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setCreateListLoading(false);
    }
  };

  return {
    createListLoading,
    listData,
    setListData,
    fetchPostCreateList,
  };
};
export default useCreateList;
