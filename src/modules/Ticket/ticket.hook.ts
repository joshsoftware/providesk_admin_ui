import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import {
  getUsersList,
  postCreateTicket,
  putEditTicket,
} from './ticket.service';
import {
  ICreateTicketPayload,
  ICreateTicketError,
  IEditTicketParams,
} from './type';

import API_CONSTANTS from 'hooks/constants';
import { useNavigate } from 'react-router-dom';
import ROUTE from 'routes/constants';

export const useCreateTicket = () => {
  const navigate = useNavigate();
  const { mutate, data, isLoading, error } = useMutation(
    (payload: ICreateTicketPayload) => postCreateTicket(payload),
    {
      onSuccess: (res) => {
        toast.success(res?.data?.message || 'Ticket created successfully.');
        navigate(ROUTE.HOME);
      },
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateTicketError;
        toast.error(error?.errors || 'Failed to create ticket.');
      },
    }
  );
  return { mutate, data: data?.data?.data?.users, isLoading };
};

//org_id parameter to fetch employees with unassigned departments
export const useUsers = (dept_id, org_id?) => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.USER_LIST, dept_id],
    () => getUsersList(dept_id, org_id),
    {
      enabled: Boolean(dept_id),
      onError: (err: AxiosError) => {
        let error = err?.response?.data as ICreateTicketError;
        toast.error(
          error?.errors ||
            error?.message ||
            'Failed to fetch department employees list.'
        );
      },
    }
  );
  return { data: data?.data?.data?.users, isLoading };
};

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
