import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

import { postCreateOrganization } from './organization.service';
import { CreateOrganizationErrorType } from './type';

export const useCreateOrganization = () => {
  return useMutation((payload: any) => postCreateOrganization({ payload }), {
    onSuccess: (res) => {
      toast.success(res?.data?.message || 'Organization created successfully.');
    },
    onError: (err: AxiosError) => {
      let error = err?.response?.data as CreateOrganizationErrorType;
      toast.error(
        error.errors || error.message || 'Failed to create organization.'
      );
    },
  });
};
