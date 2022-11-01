import { useQuery } from 'react-query';
import { toast } from 'react-toastify';

import API_CONSTANTS from 'hooks/constants';
import {
  getCategoryList,
  getDepartmentList,
  getDetailsTicket,
} from './details.service';

export const useDetails = (id: number) => {
  const { data, isLoading, refetch } = useQuery(
    [API_CONSTANTS.DETAILS_SPECEFIC, id],
    () => getDetailsTicket(id),
    {
      onError: (err) => {
        toast.error('Unable to Fetch data');
      },
    }
  );
  return { data: data?.data, isLoading };
};

export const useDepartMentList = () => {
  const { data, isLoading } = useQuery(
    API_CONSTANTS.DEPARTMENT_LIST,
    () => getDepartmentList(),
    {
      onError: () => {
        toast.error('unable to fetch department list');
      },
    }
  );
  return { data: data?.data?.departments || [], isLoading };
};
export const useCatagory = () => {
  return useQuery(API_CONSTANTS.CATEGORY_LIST, () => getCategoryList(), {
    onError: () => {
      toast.error('unable to fetch department list');
    },
  });
  // return { data, isLoading };
};
