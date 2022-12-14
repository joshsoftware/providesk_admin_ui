import axios, { AxiosRequestHeaders } from 'axios';

import ROUTE from 'routes/constants';
import { API_BASE_URL } from 'shared/appConstants';
import {
  loadLocalStorage,
  removeLocalStorageState,
} from 'shared/localStorageHelpers';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': true,
    Accept: 'application/vnd.providesk; version=1',
    'Content-Type': 'application/json',
  },
});

// adds token to requests
axiosInstance.interceptors.request.use((config) => {
  let headers = config.headers as AxiosRequestHeaders;
  let token = loadLocalStorage('userAuth');
  if (token) {
    headers['Authorization'] = token.auth_token;
  }
  return config;
});

// redirects user to login if user is unauthorized or if the token has expired
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 440 && error.response.data) {
      window.location.href = '/';
      removeLocalStorageState('userAuth');
      removeLocalStorageState('userProfile');
    }
    if (error.response.status === 401) {
      window.location.href = ROUTE.UNAUTHORIZED;
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);
