import API_CONSTANTS from 'hooks/constants';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { getOverdueTicket } from './reports.service';
import { OverdueReponce } from './types';

export const useOverDue = () => {
  const { data, isLoading } = useQuery(
    API_CONSTANTS.OVERDUE_TICKET_LIST,
    () => getOverdueTicket(),
    {
      onError: (error) => {
        toast.error('Failed to fetch');
      },
    }
  );
  return { data: data?.data, isLoading };
};
