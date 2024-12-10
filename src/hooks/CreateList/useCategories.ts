import ApiPath from '@/config/apiPath';
import { Categories } from '@/enums/CreateList/index.enum';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

export interface ICategory {
  id: Categories;
  name: string;
}

const useCategories = (): {
  categoriesLoading: boolean;
  categories: ICategory[];
  fetchGetCategories: () => Promise<void>;
} => {
  const { setShowingAlert } = useCommonStore();
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const fetchGetCategories = async () => {
    setCategoriesLoading(true);
    try {
      setCategoriesLoading(true);
      const response: AxiosResponse<ICategory[]> = await axios.get<ICategory[]>(ApiPath.categories);
      const { data } = response;
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
