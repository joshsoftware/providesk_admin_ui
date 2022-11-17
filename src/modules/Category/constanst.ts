import { PriorityType } from './type';

export const prioritiesList: PriorityType[] = [
  { id: 0, value: 'Regular' },
  { id: 1, value: 'High' },
  { id: 2, value: 'Medium' },
  { id: 3, value: 'Low' },
];

export const categoryValidationRegex = /^[-()., A-Za-z0-9\n]*$/i;
