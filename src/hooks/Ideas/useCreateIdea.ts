import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { fileToBase64 } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useState } from 'react';

export interface ICreateIdeaRequest {
  listID: number;
  title: string;
  description: string;
  externalLink?: string;
  coverImage?: File | null;
}

export interface ICreateIdeaResponse {
  id: number;
  title: string;
  description: string;
  coverImage: string;
  externalLink: string;
  listID: number;
}

const useCreateIdea = (): {
  createIdeaLoading: boolean;
  ideaData: ICreateIdeaRequest;
  setIdeaData: React.Dispatch<React.SetStateAction<ICreateIdeaRequest>>;
  resetIdeaData: () => void;
  fetchCreateIdea: (
    ideaFormData: Omit<ICreateIdeaRequest, 'listID'>
  ) => Promise<ICreateIdeaResponse | undefined>;
} => {
  const { setShowingAlert } = useCommonStore();
  const [createIdeaLoading, setCreateIdeaLoading] = useState(false);
  const [ideaData, setIdeaData] = useState<ICreateIdeaRequest>({
    listID: 0,
    title: '',
    description: '',
    externalLink: '',
    coverImage: null,
  });

  const resetIdeaData = () => {
    setIdeaData({
      listID: 0,
      title: '',
      description: '',
      externalLink: '',
      coverImage: null,
    });
  };

  const fetchCreateIdea = async (
    ideaFormData: Omit<ICreateIdeaRequest, 'listID'>
  ) => {
    setCreateIdeaLoading(true);
    setIdeaData({ ...ideaData, ...ideaFormData });
    const _params = {
      listID: Number(ideaData.listID),
      title: ideaFormData.title,
      description: ideaFormData.description,
      externalLink: ideaFormData.externalLink,
      coverImage: ideaFormData.coverImage
        ? await fileToBase64(ideaFormData.coverImage)
        : null, // BASE64
    };

    try {
      const response = await axios.post<IResponse<ICreateIdeaResponse>>(
        ApiPath.ideas,
        _params
      );
      if (response.data.content) {
        resetIdeaData();
        setCreateIdeaLoading(false);
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setCreateIdeaLoading(false);
    }
  };

  return {
    createIdeaLoading,
    ideaData,
    setIdeaData,
    resetIdeaData,
    fetchCreateIdea,
  };
};
export default useCreateIdea;
