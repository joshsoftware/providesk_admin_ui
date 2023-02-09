import { AxiosError } from 'axios';
import API_CONSTANTS from 'hooks/constants';
import { useQuery } from 'react-query';
import { toast } from 'react-toastify';
import { getAnalyticalReports } from './analyticalDashBoard.service';

export const useAnalyticalReports = () => {
  const { data, isLoading } = useQuery(
    [API_CONSTANTS.ANALYTICAL_REPORTS],
    () => getAnalyticalReports(),
    {
      onError: (err: AxiosError) => {
        let error = err?.response?.data;
        toast.error('Failed to fetch reports.');
        // console.log(err);
      },
    }
  );

  return { data: data?.data?.data, isLoading };
};
