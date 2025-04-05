import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

export interface IEditIdeaRequest {
  id: number;
  title: string;
  description: string;
  externalLink?: string;
  coverImage?: string | null;
}

export interface IEditIdeaResponse {
  listID: number;
  id: number;
  title: string;
  description: string;
  externalLink: string;
  coverImage: string;
}

const useEditIdea = () => {
  const { setShowingAlert } = useCommonStore();
  const [isEditIdeaLoading, setIsEditIdeaLoading] = useState(false);

  const fetchEditIdea = async (params: IEditIdeaRequest) => {
    setIsEditIdeaLoading(true);
    const _params = {
      ...params,
      coverImage: params.coverImage,
    };
    try {
      const response: AxiosResponse<IResponse<IEditIdeaResponse>> =
        await axios.put(`${ApiPath.ideas}/${params.id}`, _params);
      if (response.data.content) {
        setIsEditIdeaLoading(false);
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setIsEditIdeaLoading(false);
    }
  };

  return { isEditIdeaLoading, fetchEditIdea };
};

export default useEditIdea;
