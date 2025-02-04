import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useState } from 'react';

const useDeleteList = () => {
  const { setShowingAlert } = useCommonStore();
  const [deleteListLoading, setDeleteListLoading] = useState(false);

  const fetchDeleteList = async (params: number) => {
    setDeleteListLoading(true);
    try {
      const response = await axios.delete<IResponse<null>>(
        `${ApiPath.lists}/${params}`
      );
      if (response.data.content) {
        setDeleteListLoading(false);
        return response.data.content;
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
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
