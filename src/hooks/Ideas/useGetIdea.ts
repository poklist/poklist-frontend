import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { base64ToFile } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

interface IIdeaResponse {
  listID: number;
  id: number;
  title: string;
  description: string;
  externalLink: string;
  coverImage: string;
}

export interface IIdeaInfo {
  listID: number;
  id: number;
  title: string;
  description: string;
  externalLink: string;
  coverImage: File | null;
}
export const useGetIdea = () => {
  const { setShowingAlert } = useCommonStore();
  const [isIdeaInfoLoading, setIsIdeaInfoLoading] = useState(false);
  const [ideaInfo, setIdeaInfo] = useState<IIdeaInfo>();

  const fetchIdeaInfo = async (params: string) => {
    setIsIdeaInfoLoading(true);
    try {
      const response: AxiosResponse<IIdeaResponse> = await axios.get(`${ApiPath.ideas}/${params}`);
      if (response) {
        const coverImage =
          response.data.coverImage.length > 0 ? await base64ToFile(response.data.coverImage) : null;
        const _ideaInfo = { ...response.data, coverImage };
        setIdeaInfo(_ideaInfo);
        setIsIdeaInfoLoading(false);
        return _ideaInfo;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setIsIdeaInfoLoading(false);
    }
  };

  return { ideaInfo, isIdeaInfoLoading, fetchIdeaInfo };
};

export default useGetIdea;
