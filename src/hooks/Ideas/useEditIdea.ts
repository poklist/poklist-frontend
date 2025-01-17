import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { fileToBase64 } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

export interface IEditIdeaRequest {
  id: number;
  title: string;
  description: string;
  externalLink?: string;
  coverImage?: File | null;
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
      coverImage: params.coverImage ? await fileToBase64(params.coverImage) : null,
    };
    try {
      const response: AxiosResponse<IEditIdeaResponse> = await axios.put(
        `${ApiPath.ideas}/${params.id}`,
        _params,
      );
      if (response) {
        setIsEditIdeaLoading(false);
        return response.data;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setIsEditIdeaLoading(false);
    }
  };

  return { isEditIdeaLoading, fetchEditIdea };
};

export default useEditIdea;
