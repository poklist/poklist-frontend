import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

const useCategories = (): {
  categoriesLoading: boolean;
  categories: { label: string; value: string }[];
  fetchGetCategories: () => Promise<void>;
} => {
  const { setShowingAlert } = useCommonStore();
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);

  const fetchGetCategories = async () => {
    setCategoriesLoading(true);
    try {
      setCategoriesLoading(true);
      const response: AxiosResponse = await axios.get(ApiPath.categories);
      const { data } = response;
      console.log(data);
      setCategories(data);
    } catch (error) {
      setShowingAlert(true, { message: JSON.parse(String(error)) });
    } finally {
      setCategoriesLoading(false);
    }
  };
  return {
    categoriesLoading,
    categories,
    fetchGetCategories,
  };
};
export default useCategories;
