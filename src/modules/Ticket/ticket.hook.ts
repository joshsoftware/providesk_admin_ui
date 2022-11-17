import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { getUsersList, postCreateTicket } from './ticket.service';
import { ICreateTicketPayload, ICreateTicketError } from './type';

import API_CONSTANTS from 'hooks/constants';

//todo - while ticket listing api integration (dashboard)
//1. inavalidate ticket query on successful ticket creation

export const useCreateTicket = () => {
  const { mutate, data, isLoading, error } = useMutation(
    (payload: ICreateTicketPayload) => postCreateTicket(payload),
    {
      onSuccess: (res) => {
        toast.success(res?.data?.message);
      },
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateTicketError;
        toast.error(error?.errors || 'Failed to create ticket.');
      },
    }
  );
  return { mutate, data: data?.data?.data?.users, isLoading };
};

export const useUsers = (dept_id) => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.USER_LIST, dept_id],
    () => getUsersList(dept_id),
    {
      enabled: !!dept_id,
      onError: () => {
        toast.error('Failed to fetch department employees list.');
      },
    }
  );
  return { data: data?.data?.data?.users, isLoading };
};
