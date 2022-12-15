import { get } from 'apis/apiHelper';
import { resolve } from 'path';
import { OverdueReponce } from './types';

export const getOverdueTicket: () => Promise<OverdueReponce> = () => {
  const data: OverdueReponce = {
    data: {
      Overdue: [
        {
          id: 187,
          title: 'a',
          description: 'a',
          ticket_number: 'Request-187',
          status: 'assigned',
          priority: 'High',
          ticket_type: 'Request',
          resolved_at: null,
          resolver_id: 2,
          requester_id: 3,
          department_id: 4,
          department: 'Admin',
          requester: 'ayush',
          category_id: 21,
          created_at: '2022-12-08T20:54:55.490+05:30',
          updated_at: '2022-12-13T17:01:45.897+05:30',
          organization_id: null,
          reason_for_update: null,
          asset_url: [],
          eta: '2022-12-13',
          asked_for_update_at: null,
          resolver: 'ayush',
        },
      ],
      Overduein2days: [
        {
          id: 187,
          requester: 'ayush',
          resolver: 'ayush',
          title: 'a',
          description: 'a',
          ticket_number: 'Request-187',
          status: 'assigned',
          priority: 'High',
          ticket_type: 'Request',
          resolved_at: null,
          resolver_id: 2,
          requester_id: 3,
          department_id: 4,
          category_id: 21,
          created_at: '2022-12-08T20:54:55.490+05:30',
          updated_at: '2022-12-13T17:01:45.897+05:30',
          organization_id: null,
          reason_for_update: null,
          asset_url: [],
          eta: '2022-12-15',
          asked_for_update_at: null,
        },
        {
          id: 188,
          requester: 'ayush',
          title: 'Ticket testing',
          resolver: 'ayush',
          description: 'Ticket testing',
          ticket_number: 'Request-188',
          status: 'assigned',
          priority: 'High',
          ticket_type: 'Request',
          resolved_at: null,
          resolver_id: 41,
          requester_id: 6,
          department_id: 1,
          category_id: 3,
          created_at: '2022-12-13T14:07:33.591+05:30',
          updated_at: '2022-12-13T17:02:11.562+05:30',
          organization_id: 1,
          reason_for_update: null,
          asset_url: [],
          eta: '2022-12-15',
          asked_for_update_at: null,
        },
        {
          id: 189,
          requester: 'ayush',
          resolver: 'ayush',
          title: 'Ticket testing',
          description: 'Ticket testing',
          ticket_number: 'Request-189',
          status: 'assigned',
          priority: 'High',
          ticket_type: 'Request',
          resolved_at: null,
          resolver_id: 41,
          requester_id: 6,
          department_id: 1,
          category_id: 3,
          created_at: '2022-12-13T14:11:44.158+05:30',
          updated_at: '2022-12-13T17:03:54.305+05:30',
          organization_id: 1,
          reason_for_update: null,
          asset_url: [],
          eta: '2022-12-14',
          asked_for_update_at: null,
        },
      ],
      Overdueaftertwodays: [
        {
          id: 185,
          title: 'Ticket testing',
          description: 'Ticket testing',
          ticket_number: 'Request-185',
          status: 'for_approval',
          priority: 'High',
          ticket_type: 'Request',
          requester: 'ayush',
          resolved_at: null,
          resolver_id: 41,
          requester_id: 16,
          department_id: 1,
          resolver: 'ayush',
          category_id: 3,
          created_at: '2022-12-06T16:12:50.252+05:30',
          updated_at: '2022-12-13T17:08:21.699+05:30',
          organization_id: 1,
          reason_for_update: 'Reopen: Not satisfied with your service',
          asset_url: ['update', 'update', 'url added', 'reopen'],
          eta: '2023-01-02',
          asked_for_update_at: '2022-12-13T12:03:46.735+05:30',
        },
      ],
    },
  };
  return mockAPICall<OverdueReponce>(data);
  return get({ path: '/tickets/timeline' });
};

export function mockAPICall<Res>(resolveData): Promise<Res> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(resolveData);
    }, 1500);
  });
}
