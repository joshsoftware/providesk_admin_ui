import { get } from 'apis/apiHelper';
import { resolve } from 'path';
import { OverdueReponce } from './types';

export const getOverdueTicket: () => Promise<OverdueReponce> = () => {
  return get({ path: '/tickets/timeline' });
};

export function mockAPICall<Res>(resolveData): Promise<Res> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(resolveData);
    }, 1500);
  });
}
