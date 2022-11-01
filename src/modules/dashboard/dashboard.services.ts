import { get } from 'apis/apiHelper';
import {
  IFetchComplaintListRequest,
  GetRequestsListResponse,
  IComplaintDetails,
} from 'modules/dashboard/types';

export const getRequestList = (
  queryParams: IFetchComplaintListRequest
): Promise<GetRequestsListResponse> => {
  const data: IComplaintDetails[] = [
    {
      id: 4,
      title: 'Issue regarding laptop----',
      description: 'RAM and Monitor Issue',
      ticket_number: null,
      status: 'assigned',
      priority: 'Medium',
      ticket_type: 'request',
      resolved_at: null,
      created_at: '2022-09-29T09:23:55.093Z',
      updated_at: '2022-09-29T09:23:55.093Z',
      category: 'Loan',
      department: 'Finance',
      resolver: 'Nandini Jhanwar',
      requester: 'Nandini Jhanwar',
      permited_events: ['start', 'approve', 'reject'],
    },
    {
      id: 3,
      title: 'Issue regarding laptop',
      description: 'RAM and Monitor Issue',
      ticket_number: null,
      status: 'assigned',
      priority: 'Medium',
      ticket_type: 'request',
      resolved_at: null,
      created_at: '2022-09-29T05:51:05.837Z',
      updated_at: '2022-09-29T05:51:05.837Z',
      category: 'Loan',
      department: 'Finance',
      resolver: 'Nandini Jhanwar',
      requester: 'Nandini Jhanwar',
      permited_events: ['start', 'approve', 'reject'],
    },
    {
      id: 2,
      title: 'Issue regarding laptop',
      description: 'RAM and Monitor Issue',
      ticket_number: null,
      status: 'assigned',
      priority: 'Medium',
      ticket_type: 'request',
      resolved_at: null,
      created_at: '2022-09-29T05:51:01.658Z',
      updated_at: '2022-09-29T05:51:01.658Z',
      category: 'Loan',
      department: 'Finance',
      resolver: 'Nandini Jhanwar',
      requester: 'Nandini Jhanwar',
      permited_events: ['start', 'approve', 'reject'],
    },
    {
      id: 1,
      title: 'Issue regarding laptop',
      description: 'RAM and Monitor Issue',
      ticket_number: null,
      status: 'assigned',
      priority: 'Medium',
      ticket_type: 'request',
      resolved_at: null,
      created_at: '2022-09-28T13:10:34.834Z',
      updated_at: '2022-09-28T13:10:34.834Z',
      category: 'Loan',
      department: 'Finance',
      resolver: 'Nandini Jhanwar',
      requester: 'Nandini Jhanwar',
      permited_events: ['start', 'approve', 'reject'],
    },
  ];
  return Promise.resolve({ message: 'success', data: data });
  // return get({ path: '/complaints', ...queryParams });
};
