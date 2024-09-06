import { AxiosError } from 'axios';
import API_CONSTANTS from 'hooks/constants';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';

import {
  getOrganization,
  postCreateOrganization,
} from './organization.service';
import { CreateOrganizationErrorType, GetOrganizationErrorType } from './type';

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  return useMutation((payload: any) => postCreateOrganization({ payload }), {
    onSuccess: (res) => {
      toast.success(res?.data?.message || 'Organization created successfully.');
      queryClient.invalidateQueries(API_CONSTANTS.ORGANZIATION_LIST);
    },
    onError: (err: AxiosError) => {
      let error = err?.response?.data as CreateOrganizationErrorType;
      toast.error(
        error.errors || error.message || 'Failed to create organization.'
      );
    },
  });
};

export const useGetOrganization = () => {
  const { data, isLoading } = useQuery(
    API_CONSTANTS.ORGANZIATION_LIST,
    () => getOrganization(),
    {
      onError: (err: AxiosError) => {
        let error = err?.response?.data as GetOrganizationErrorType;
        toast.error(
          error.errors || error.message || 'Failed to fetch Organization list'
        );
      },
    }
  );
  return { data: data?.data?.data?.organizations, isLoading };
};
