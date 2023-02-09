import { UserContext } from 'App';
import API_CONSTANTS from 'hooks/constants';
import {
  BulkUpload,
  IFetchComplaintListRequest,
  PayloadBulkUpload,
  SelectedTicket,
} from 'modules/dashboard/types';
import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { ROLES } from 'routes/roleConstants';

import { getRequestList, postBulkUpdate } from './dashboard.services';

export const useGetRequestsList = (queryParams: IFetchComplaintListRequest) => {
  let path = '/tickets';
  const { userAuth } = useContext(UserContext);

  let params = {
    type: queryParams?.type !== '' ? queryParams?.type : undefined,
    category_id:
      queryParams?.category !== '' ? queryParams?.category : undefined,
    status: queryParams?.status !== '' ? queryParams.status : undefined,
    department_id:
      userAuth.role === ROLES.DEPARTMENT_HEAD
        ? undefined
        : queryParams?.department !== ''
        ? queryParams.department
        : undefined,
    assigned_to_me: queryParams?.assig_to_me === true ? true : undefined,
    created_by_me: queryParams?.created_by_me === true ? true : undefined,
  };
  const { data, isLoading, isFetching } = useQuery(
    [API_CONSTANTS.COMPLAINT_LIST, params],
    () => getRequestList(path, params),
    {
      onError: (e) => {
        toast.error('Failed to fetch list');
      },
    }
  );
  return {
    data: data?.data?.data,
    isLoading: isLoading || isFetching,
  };
};

export const usePostBulkUpdate = (SuccessCallbackFunction: () => void) => {
  const queryClient = useQueryClient();
  return useMutation((payload: PayloadBulkUpload) => postBulkUpdate(payload), {
    onSuccess: () => {
      queryClient.invalidateQueries([API_CONSTANTS.COMPLAINT_LIST]);
      SuccessCallbackFunction();
    },
    onError: () => {
      toast.error('Failed to update Tickets');
      SuccessCallbackFunction();
    },
  });
};
