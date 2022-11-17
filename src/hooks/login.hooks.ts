// Login hooks
import { useMutation, useQuery } from 'react-query';
import { login } from 'services/login.services';

export const useLogin = () => {
  const { mutate, isLoading, data } = useMutation(login);

  return { mutate, isLoading, data };
};
