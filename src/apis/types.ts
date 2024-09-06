export interface getPayload {
  path: string;
  queryParams?: object;
  responseType?: any; // in case we need change the response type
}

export interface postPayload {
  path: string;
  requestParams?: object;
  queryParams?: object;
}

export interface putPayload {
  path: string;
  payloadParams?: object;
}

export interface deletePayload {
  path: string;
  queryParams?: object;
}
