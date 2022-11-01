export interface IComplaintDetails {
  id: string | number;
  title: string;
  description: string;
  ticket_number: number | null | string;
  status: string;
  priority: string;
  ticket_type: string;
  resolved_at: null;
  created_at: string;
  updated_at: string;
  category: string;
  department: string;
  resolver: string;
  requester: string;
  permited_events: string[];
}

export interface GetRequestsListResponse {
  message: string;
  data: IComplaintDetails[];
}

export interface IFetchComplaintListRequest {
  status?: string;
  department?: string;
  title?: string;
  page: number;
  perPage: number;
}
