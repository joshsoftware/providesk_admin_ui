import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import API_CONSTANTS from 'hooks/constants';
import { IEditTicketParams, IReopenTicketParams } from './type';
import { ICreateTicketError } from 'modules/Ticket/type';
import {
  getDetailsTicket,
  putEditTicket,
  putReopenTicket,
} from './details.service';

export const useEditTicket = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, ticket_details, setOpenEdit }: IEditTicketParams) =>
      putEditTicket({ id, ticket_details }),
    {
      onSuccess: (res, params) => {
        toast.success(res?.data?.message || 'Ticked updated successfully.');
        params.setOpenEdit(false);
        queryClient.invalidateQueries([API_CONSTANTS.DETAILS_SPECEFIC]);
      },
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateTicketError;
        toast.error(error?.errors || 'Failed to update ticket.');
      },
    }
  );
};

export const useReopenTicket = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, ticket_result, setOpenEdit }: IReopenTicketParams) =>
      putReopenTicket({ id, ticket_result }),
    {
      onSuccess: (res, params) => {
        toast.success(res?.data?.message || 'Ticked reopened successfully.');
        params.setOpenEdit(false);
        queryClient.invalidateQueries([API_CONSTANTS.DETAILS_SPECEFIC]);
      },
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateTicketError;
        console.log(err);
        toast.error(error?.errors || 'Failed to reopen ticket.');
      },
    }
  );
};

export const useTicketDetails = (id: number) => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.DETAILS_SPECEFIC, id],
    () => getDetailsTicket(id),
    {
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateTicketError;
        toast.error(error?.message || 'Failed to fetch ticket details');
      },
    }
  );
  return {
    ticket: data?.data?.data?.ticket,
    activities: data?.data?.data?.activites,
    isLoading,
  };
};
