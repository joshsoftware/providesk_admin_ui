import { get, post } from 'apis/apiHelper';
import {
  IFetchComplaintListRequest,
  GetRequestsListResponse,
  IComplaintDetails,
  BulkUpdatePayload,
} from 'modules/dashboard/types';

export const getRequestList = (
  path: string,
  params: IFetchComplaintListRequest
) => {
  return get({ path, queryParams: params });
};

export const postBulkUpdate = (payload: BulkUpdatePayload) => {
  return post({
    path: '/tickets/bulk_update_ticket_progress',
    requestParams: payload,
  });
};
