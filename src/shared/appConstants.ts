import { REACT_APP_API_BASE_URL, REACT_APP_GOOGLE_CLIENT_ID } from "../env";

export const GOOGLE_CLIENT_ID = REACT_APP_GOOGLE_CLIENT_ID || '';
export const API_BASE_URL = REACT_APP_API_BASE_URL;

export const LOCAL_STORAGE_KEYS = {
  USER_PROFILE: 'userProfile',
  USER_AUTH: 'userAuth',
};
