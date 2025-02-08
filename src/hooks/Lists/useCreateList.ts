import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { fileToBase64 } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useState } from 'react';

interface IListOwnerInfo {
  id: number;
  displayName: string;
  userCode: string;
  profileImage: string;
}

export interface ICreateListRequest {
  title: string;
  description: string;
  externalLink: string;
  coverImage: File | null;
  categoryID: number;
}

export interface ICreateListResponse {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  ideas: null;
  ideaTotalCount: number;
  owner: IListOwnerInfo;
}

const useCreateList = (): {
  createListLoading: boolean;
  listData: ICreateListRequest;
  setListData: React.Dispatch<React.SetStateAction<ICreateListRequest>>;
  fetchCreateList: (
    listForm: ICreateListRequest
  ) => Promise<ICreateListResponse | undefined>;
} => {
  const { setShowingAlert } = useCommonStore();

  const [listData, setListData] = useState<ICreateListRequest>({
    title: '',
    description: '',
    externalLink: '',
    coverImage: null,
    categoryID: 0,
  });

  const resetListData = () => {
    setListData({
      title: '',
      description: '',
      externalLink: '',
      coverImage: null,
      categoryID: 0,
    });
  };

  const [createListLoading, setCreateListLoading] = useState(false);

  const fetchCreateList = async (listForm: ICreateListRequest) => {
    setCreateListLoading(true);
    setListData(listForm);
    const _params = {
      title: listForm.title,
      description: listForm.description,
      externalLink: listForm.externalLink,
      coverImage: listForm.coverImage
        ? await fileToBase64(listForm.coverImage)
        : null,
      categoryID: listForm.categoryID,
    };

    try {
      const response = await axios.post<IResponse<ICreateListResponse>>(
        ApiPath.lists,
        _params
      );
      if (response.data.content) {
        resetListData();
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setCreateListLoading(false);
    }
  };

  return {
    createListLoading,
    listData,
    setListData,
    fetchCreateList,
  };
};
export default useCreateList;
