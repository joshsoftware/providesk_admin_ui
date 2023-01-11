import { StringifyOptions } from 'querystring';

export interface IComplaintDetails {
  id: number;
  title: string;
  description: string;
  ticket_number: null | number;
  status: string;
  priority: string;
  ticket_type: string;
  resolved_at: null | string;
  created_at: string;
  updated_at: string;
  category: string;
  department: string;
  resolver: string;
  requester: string;
  permited_events: string[];
  reason_for_update: string;
  eta?: string;
  permited_transitions: string[];
  requester_email: string;
}

export interface GetRequestsListResponse {
  message: string;
  data: IComplaintDetails[];
}

export interface IFetchComplaintListRequest {
  status?: string;
  department?: string;
  title?: string;
  page?: number;
  perPage?: number;
  type?: string;
  category?: string;
  assig_to_me?: boolean;
  created_by_me?: boolean;
}

export interface BulkUpdatePayload {
  ticket: {
    ticket_ids: number[];
    status: string;
    department_id: string;
    category_id: string;
    resolver_id: string;
  };
}
export interface BulkUpload {
  department_id: string;
  category_id: string;
  resolver_id: string;
  status: string;
}
export interface PayloadBulkUpload {
  ticket: {
    ticket_ids: number[];
    status: string;
    department_id: number | string;
    category_id: number | string;
    resolver_id: number | string;
  };
}
