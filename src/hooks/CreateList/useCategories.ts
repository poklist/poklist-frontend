import ApiPath from '@/config/apiPath';
import axios from '@/lib/axios';
import useCommonStore from '@/stores/useCommonStore';
import { AxiosResponse } from 'axios';
import { useState } from 'react';

export interface ICategory {
  id: number;
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
      // const data = [
      //   {
      //     id: 2,
      //     name: 'lifestyle',
      //   },
      //   {
      //     id: 1,
      //     name: 'others',
      //   },
      //   {
      //     id: 3,
      //     name: 'food',
      //   },
      //   {
      //     id: 4,
      //     name: 'culture',
      //   },
      //   {
      //     id: 5,
      //     name: 'traveling',
      //   },
      //   {
      //     id: 6,
      //     name: 'entertainment',
      //   },
      //   {
      //     id: 7,
      //     name: 'technology',
      //   },
      //   {
      //     id: 8,
      //     name: 'growth',
      //   },
      //   {
      //     id: 9,
      //     name: 'health',
      //   },
      // ];
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
