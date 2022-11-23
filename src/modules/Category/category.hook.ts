import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import { ICreateCategoryError } from './type';
import API_CONSTANTS from 'hooks/constants';
import { ICreateDepartmentError } from 'modules/Department/type';
import {
  getCategoriesList,
  getDepartmentList,
  postCreateCategory,
} from './category.service';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: any) => postCreateCategory({ payload }), {
    onSuccess: (res) => {
      queryClient.invalidateQueries([API_CONSTANTS.CATEGORY_LIST]);
      toast.success(res?.data?.message || 'Category created successfuly');
    },
    onError: (err: AxiosError) => {
      let error = err?.response?.data as ICreateCategoryError;
      toast.error(
        error?.errors || error?.message || 'Failed to create category.'
      );
    },
  });
};

export const useDepartments = (id) => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.DEPARTMENT_LIST, id],
    () => getDepartmentList(id),
    {
      enabled: Boolean(id),
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateDepartmentError;
        toast.error(
          error?.errors || error?.message || 'Failed to fetch departments list.'
        );
      },
    }
  );
  return { data: data?.data?.data?.departments, isLoading };
};

export const useCategories = (dept_id) => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.CATEGORY_LIST, dept_id],
    () => getCategoriesList(dept_id),
    {
      enabled: Boolean(dept_id),
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateCategoryError;
        toast.error(
          error?.errors || error?.message || 'Failed to fetch categories list.'
        );
      },
    }
  );
  return { data: data?.data?.data?.categories, isLoading };
};
