import ApiPath from '@/config/apiPath';
import { Categories } from '@/enums/Lists/index.enum';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

export interface IListInfo {
  id: number; // listID
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  categoryID: Categories;
  likeCount: number;
  createAt: string; // ISO 8601
  updateAt: string; // ISO 8601
  ideas: IIdeaPreviewInfo[];
  ideasTotalCount: number;
  owner: IListOwnerInfo;
}

export interface IIdeaPreviewInfo {
  id: string;
  title: string;
  description: string;
  coverImage: string;
}

const useGetListInfo = (): {
  listLoading: boolean;
  listInfo: IListInfo | undefined;
  setListInfo: React.Dispatch<React.SetStateAction<IListInfo | undefined>>;
  fetchGetListInfo: (listId: string) => Promise<IListInfo | undefined>;
} => {
  const { setShowingAlert } = useCommonStore();
  const [listLoading, setListLoading] = useState(false);
  const [listInfo, setListInfo] = useState<IListInfo>();

  const fetchGetListInfo = async (listId: string) => {
    setListLoading(true);
    try {
      const response: AxiosResponse<IListInfo> = await axios.get(`${ApiPath.lists}/${listId}`);
      if (response) {
        setListInfo(response.data);
        setListLoading(false);
        return response.data;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setListLoading(false);
    }
  };

  return { listLoading, listInfo, setListInfo, fetchGetListInfo };
};
export default useGetListInfo;

interface IListOwnerInfo {
  id: number; // listID??
  displayName: string;
  userCode: string;
  profileImage: string; // BASE64
}
