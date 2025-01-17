import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

const useDeleteList = () => {
  const { setShowingAlert } = useCommonStore();
  const [deleteListLoading, setDeleteListLoading] = useState(false);

  const fetchDeleteList = async (params: number) => {
    setDeleteListLoading(true);
    try {
      const response: AxiosResponse<unknown> = await axios.delete(`${ApiPath.lists}/${params}`);
      if (response) {
        setDeleteListLoading(false);
        return response.data;
      }
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setDeleteListLoading(false);
    }
  };
  return {
    deleteListLoading,
    fetchDeleteList,
  };
};

export default useDeleteList;
