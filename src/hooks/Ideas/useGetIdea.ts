import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import { base64ToFile } from '@/lib/utils';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

interface IIdeaResponse {
  listID: number;
  id: number;
  title: string;
  description: string;
  externalLink: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
  owner: IIdeaOwnerInfo;
}

export interface IIdeaInfo {
  listID: number;
  id: number;
  title: string;
  description: string;
  externalLink: string;
  coverImage: File | null;
  createdAt: string;
  updatedAt: string;
  owner: IIdeaOwnerInfo;
}

export interface IIdeaOwnerInfo {
  id: number;
  displayName: string;
  userCode: string;
  profileImage: string; // BASE64
}

export const useGetIdea = () => {
  const { setShowingAlert } = useCommonStore();
  const [isIdeaInfoLoading, setIsIdeaInfoLoading] = useState(false);
  const [ideaInfo, setIdeaInfo] = useState<IIdeaInfo>();

  const fetchIdeaInfo = async (params: string) => {
    setIsIdeaInfoLoading(true);
    try {
      const response: AxiosResponse<IResponse<IIdeaResponse>> = await axios.get(
        `${ApiPath.ideas}/${params}`
      );
      if (response.data.content) {
        const coverImage =
          response.data.content.coverImage.length > 0
            ? await base64ToFile(response.data.content.coverImage)
            : null;
        const _ideaInfo = { ...response.data.content, coverImage };
        setIdeaInfo(_ideaInfo);
        setIsIdeaInfoLoading(false);
        return _ideaInfo;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setIsIdeaInfoLoading(false);
    }
  };

  return { ideaInfo, isIdeaInfoLoading, fetchIdeaInfo };
};

export default useGetIdea;
