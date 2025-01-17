import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { useState } from 'react';

const useDeleteIdea = () => {
  const { setShowingAlert } = useCommonStore();
  const [isDeleteIdeaLoading, setIsDeleteIdeaLoading] = useState(false);

  const fetchDeleteIdea = async (params: number) => {
    setIsDeleteIdeaLoading(true);
    try {
      const response = await axios.delete(`${ApiPath.ideas}/${params}`);
      if (response) {
        setIsDeleteIdeaLoading(false);
        return response.data;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setIsDeleteIdeaLoading(false);
    }
  };

  return { isDeleteIdeaLoading, fetchDeleteIdea };
};

export default useDeleteIdea;
