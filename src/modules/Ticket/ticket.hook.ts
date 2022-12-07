import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { getUsersList, postCreateTicket } from './ticket.service';
import { ICreateTicketPayload, ICreateTicketError } from './type';

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
