import { axiosInstance } from './apiConfigInitializer';

import { deletePayload, getPayload, postPayload, putPayload } from './types';

export const get = async (payload: getPayload) => {
  const { path, queryParams = null, responseType = 'json' } = payload;
  const response = await axiosInstance.get(path, {
    params: queryParams,
    responseType,
  });
  return response;
};

/**
 * post will be used to as generic helper method to make async n/w post request
 * @param payload
 */
export const post = async (payload: postPayload) => {
  const { path, requestParams, queryParams = {} } = payload;
  const response = await axiosInstance.post(path, requestParams, {
    params: queryParams,
  });
  return response;
};

/**
 * put will be used to as generic helper method to make async n/w put requests
 * @param payload
 */
export const put = async (payload: putPayload) => {
  const { path, payloadParams } = payload;
  const response = await axiosInstance.put(path, payloadParams);
  return response;
};

export const deleteCall = async (payload: deletePayload) => {
  const { path, queryParams = null } = payload;
  const response = await axiosInstance.delete(path, { params: queryParams });
  return response;
};
