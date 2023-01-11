import { useState } from 'react';
import { PieChartDepartment } from './pieChartDepartment';
import { ChartData } from './type';

//todo dummy data
const data1 = [
  { name: 'Admin', value: 400, id: 1 },
  { name: 'Finance', value: 300, id: 2 },
  { name: 'HR', value: 300, id: 3 },
  { name: 'Marketing', value: 200, id: 4 },
  { name: 'Sales', value: 200, id: 5 },
  { name: 'Tag', value: 200, id: 6 },
];
const data2 = {
  1: [
    { name: 'for_approval', value: 10 },
    { name: 'reopen', value: 30 },
    { name: 'assigned', value: 50 },
    { name: 'inprogress', value: 33 },
    { name: 'closed', value: 33 },
    { name: 'resolved', value: 12 },
    { name: 'on_hold', value: 33 },
  ],
  2: [
    { name: 'for_approval', value: 12 },
    { name: 'reopen', value: 10 },
    { name: 'assigned', value: 9 },
    { name: 'inprogress', value: 9 },
    { name: 'closed', value: 3 },
    { name: 'resolved', value: 2 },
    { name: 'on_hold', value: 13 },
  ],
  3: [
    { name: 'for_approval', value: 0 },
    { name: 'reopen', value: 10 },
    { name: 'assigned', value: 5 },
    { name: 'inprogress', value: 13 },
    { name: 'closed', value: 3 },
    { name: 'resolved', value: 20 },
    { name: 'on_hold', value: 8 },
  ],
  4: [
    { name: 'for_approval', value: 6 },
    { name: 'reopen', value: 10 },
    { name: 'assigned', value: 4 },
    { name: 'inprogress', value: 13 },
    { name: 'closed', value: 2 },
    { name: 'resolved', value: 2 },
    { name: 'on_hold', value: 3 },
  ],
  5: [
    { name: 'for_approval', value: 0 },
    { name: 'reopen', value: 13 },
    { name: 'assigned', value: 5 },
    { name: 'inprogress', value: 13 },
    { name: 'closed', value: 3 },
    { name: 'resolved', value: 12 },
    { name: 'on_hold', value: 33 },
  ],
  6: [
    { name: 'for_approval', value: 200 },
    { name: 'reopen', value: 30 },
    { name: 'assigned', value: 50 },
    { name: 'inprogress', value: 33 },
    { name: 'closed', value: 33 },
    { name: 'resolved', value: 12 },
    { name: 'on_hold', value: 33 },
  ],
};

export const DepartmentChart = () => {
  const [departmentId, setDepartmentId] = useState<number>(1);
  return (
    <>
      <PieChartDepartment
        data1={data1}
        setDepartmentId={setDepartmentId}
        data2={data2[departmentId]}
      />
    </>
  );
};
