import ApiPath from '@/config/apiPath';
import {
  ICreateListRequest,
  ICreateListResponse,
} from '@/hooks/Lists/useCreateList';
import axios from '@/lib/axios';
import { fileToBase64 } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useState } from 'react';
import { IIdeaPreviewInfo } from './useGetList';

export interface IEditListRequest extends ICreateListRequest {
  listID: number;
}

const useEditList = () => {
  const { setShowingAlert } = useCommonStore();

  const [editListLoading, setEditListLoading] = useState(false);

  const fetchEditList = async (
    listID: number,
    editListRequest: ICreateListRequest
  ) => {
    setEditListLoading(true);
    const _params = {
      listID,
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
        `${ApiPath.lists}/${_params.listID}`,
        _params
      );
      if (response.data.content) {
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setEditListLoading(false);
    }
  };

  const fetchReorderIdea = async (
    listID: string,
    ideaList: IIdeaPreviewInfo[]
  ) => {
    setEditListLoading(true);
    const _params: { ideaOrder: number[] } = { ideaOrder: [] };
    ideaList.forEach((idea) => {
      _params.ideaOrder.push(Number(idea.id));
    });
    try {
      const response = await axios.post<IResponse<unknown>>(
        `${ApiPath.lists}/${listID}/reorder`,
        _params
      );
      if (response.data.content) {
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setEditListLoading(false);
    }
  };

  return {
    editListLoading,
    fetchEditList,
    fetchReorderIdea,
  };
};

export default useEditList;
