import ApiPath from '@/config/apiPath';
import {
  ICreateListRequest,
  ICreateListResponse,
} from '@/hooks/Lists/useCreateList';
import axios from '@/lib/axios';
import { base64ToFile, fileToBase64 } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useState } from 'react';
import useGetList, { IIdeaPreviewInfo } from './useGetList';

export interface IEditListRequest extends ICreateListRequest {
  listID: number;
}

const useEditList = () => {
  const { setShowingAlert } = useCommonStore();
  const { fetchGetListInfo } = useGetList();

  const [editListLoading, setEditListLoading] = useState(false);
  const [listInfo, setListInfo] = useState<IEditListRequest>();

  const initialListInfo = async (listID: string) => {
    setEditListLoading(true);
    const response = await fetchGetListInfo(listID);
    if (response) {
      const coverImage =
        response.coverImage.length > 0
          ? await base64ToFile(response.coverImage)
          : null;
      setListInfo({
        listID: response.id,
        title: response.title,
        description: response.description,
        externalLink: response.externalLink,
        coverImage,
        categoryID: response.categoryID,
      });
    }
    setEditListLoading(false);
  };

  const fetchEditList = async (
    editListRequest: Omit<IEditListRequest, 'listID'>
  ) => {
    if (!listInfo) {
      return;
    }
    setEditListLoading(true);
    const _params = {
      listID: listInfo.listID,
      title: editListRequest.title,
      description: editListRequest.description,
      externalLink: editListRequest.externalLink,
      coverImage: editListRequest.coverImage
        ? await fileToBase64(editListRequest.coverImage)
        : null,
      categoryID: editListRequest.categoryID,
    };
    try {
      const response = await axios.put<IResponse<ICreateListResponse>>(
        `${ApiPath.lists}/${listInfo?.listID}`,
        _params
      );
      if (response.data.content) {
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setEditListLoading(false);
    }
  };

  const fetchReorderIdea = async (
    listId: string,
    ideaList: IIdeaPreviewInfo[]
  ) => {
    setEditListLoading(true);
    const _params: { ideaOrder: number[] } = { ideaOrder: [] };
    ideaList.forEach((idea) => {
      _params.ideaOrder.push(Number(idea.id));
    });
    try {
      const response = await axios.post<IResponse<unknown>>(
        `${ApiPath.lists}/${listId}/reorder`,
        _params
      );
      if (response.data.content) {
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setEditListLoading(false);
    }
  };

  return {
    editListLoading,
    listInfo,
    setListInfo,
    initialListInfo,
    fetchEditList,
    fetchReorderIdea,
  };
};

export default useEditList;
