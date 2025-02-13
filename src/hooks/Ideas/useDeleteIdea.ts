import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

const useDeleteIdea = () => {
  const { setShowingAlert } = useCommonStore();
  const [isDeleteIdeaLoading, setIsDeleteIdeaLoading] = useState(false);

  const fetchDeleteIdea = async (params: number) => {
    setIsDeleteIdeaLoading(true);
    try {
      const response: AxiosResponse<IResponse<unknown>> = await axios.delete(
        `${ApiPath.ideas}/${params}`
      );
      if (response.data.content) {
        setIsDeleteIdeaLoading(false);
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
    } finally {
      setIsDeleteIdeaLoading(false);
    }
  };

  return { isDeleteIdeaLoading, fetchDeleteIdea };
};

export default useDeleteIdea;
