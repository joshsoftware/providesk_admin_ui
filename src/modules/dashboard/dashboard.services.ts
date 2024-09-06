import { get } from 'apis/apiHelper';
import {
  IFetchComplaintListRequest,
  GetRequestsListResponse,
  IComplaintDetails,
} from 'modules/dashboard/types';



export const getRequestList = (path:string,params: IFetchComplaintListRequest) => {

  return get({ path,queryParams:params });
};
