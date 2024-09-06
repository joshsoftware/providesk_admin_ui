import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { postCreateDepartment } from './department.service';
import API_CONSTANTS from 'hooks/constants';
import { ICreateDepartmentError } from './type';

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: any) => postCreateDepartment({ payload }), {
    onSuccess: (res) => {
      queryClient.invalidateQueries(API_CONSTANTS.DEPARTMENT_LIST);
      toast.success(res?.data?.message || 'Department created successfully.');
      toast.info('Please assign department head for the department.', {
        autoClose: false,
      });
    },
    onError: (err: AxiosError) => {
      let error = err?.response?.data as ICreateDepartmentError;
      toast.error(error?.message || 'Failed to create department.');
    },
  });
};
