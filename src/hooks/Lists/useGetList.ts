import ApiPath from '@/config/apiPath';
import { Categories } from '@/enums/Lists/index.enum';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
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

const useGetList = (): {
  isListInfoLoading: boolean;
  listInfo: IListInfo | undefined;
  setListInfo: React.Dispatch<React.SetStateAction<IListInfo | undefined>>;
  fetchGetListInfo: (listId: string) => Promise<IListInfo | undefined>;
} => {
  const { setShowingAlert } = useCommonStore();
  const [isListInfoLoading, setIsListInfoLoading] = useState(false);
  const [listInfo, setListInfo] = useState<IListInfo>();

  const fetchGetListInfo = async (listId: string) => {
    setIsListInfoLoading(true);
    try {
      const response = await axios.get<IResponse<IListInfo>>(
        `${ApiPath.lists}/${listId}`
      );
      if (response.data.content) {
        setListInfo(response.data.content);
        setListLoading(false);
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setIsListInfoLoading(false);
    }
  };

  return { isListInfoLoading, listInfo, setListInfo, fetchGetListInfo };
};
export default useGetList;

interface IListOwnerInfo {
  id: number; // listID??
  displayName: string;
  userCode: string;
  profileImage: string; // BASE64
}
