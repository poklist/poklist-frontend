// DEPRECATED

import ApiPath from '@/config/apiPath';
import { Category } from '@/enums/Lists/index.enum';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { IResponse } from '@/types/response';
import { useState } from 'react';

export interface ICategory {
  id: Category;
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
      const response = await axios.get<IResponse<ICategory[]>>(
        ApiPath.categories
      );
      if (response.data.content) {
        setCategories(response.data.content);
      }
    } catch (error) {
      setShowingAlert(true, { message: String(error) });
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
