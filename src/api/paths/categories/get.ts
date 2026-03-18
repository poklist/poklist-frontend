import axios from '@/api/axios';
import { categoriesContract } from '@/api/contracts/categories';
import { categoriesSchema } from '@/api/schemas/categories';
import { initContract } from '@ts-rest/core';
import { initQueryClient } from '@ts-rest/react-query';
import { z } from 'zod';

export const categoriesApi = initContract().router({
  get: categoriesContract.getCategoriesResponse,
});

type GetCategoryResponse = z.infer<typeof categoriesSchema.getResponse>;

export const getCategories = initQueryClient(categoriesApi, {
  baseUrl: '',
  api: async ({ path, method, headers, body }) => {
    const response = await axios<GetCategoryResponse>({
      url: path,
      method: method,
      headers: headers,
      data: body,
    });

    // 2. 將 Axios 的 headers 轉換為原生的 Headers 物件
    const nativeHeaders = new Headers();
    Object.entries(response.headers).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        nativeHeaders.append(key, String(value));
      }
    });

    return {
      status: response.status,
      body: response.data,
      headers: nativeHeaders,
    };
  },
});
