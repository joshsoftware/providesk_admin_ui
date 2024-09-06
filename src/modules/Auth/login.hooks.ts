// Login hooks
import { useMutation } from 'react-query';
import { login } from './login.services';

export const useLogin = () => {
  const { mutate, isLoading, data } = useMutation(login);

  return { mutate, isLoading, data };
};
