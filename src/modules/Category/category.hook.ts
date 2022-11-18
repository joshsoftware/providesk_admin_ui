import { AxiosError } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import API_CONSTANTS from 'hooks/constants';
import { ICreateDepartmentError } from 'modules/Department/type';
import {
  getCategoriesList,
  getDepartmentList,
  postCreateCategory,
} from './category.service';
import { ICreateCategoryError } from './type';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: any) => postCreateCategory({ payload }), {
    onSuccess: () => {
      queryClient.invalidateQueries([API_CONSTANTS.CATEGORY_LIST]);
      toast.success('Category created successfuly');
    },
    onError: (err: AxiosError) => {
      let error = err?.response?.data as ICreateCategoryError;
      toast.error(
        error?.errors || error?.message || 'Failed to create department.'
      );
    },
  });
};

export const useDepartments = (id) => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.DEPARTMENT_LIST, id],
    () => getDepartmentList(id),
    {
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateDepartmentError;
        toast.error(error?.message || 'Failed to fetch departments list.');
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
