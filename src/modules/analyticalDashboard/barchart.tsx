import { ticketStatusColours } from 'modules/details/constants';
import React, { PureComponent } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const data = [
  //   { name: 'for_approval', value: 200 },
  //   { name: 'reopen', value: 300 },
  //   { name: 'assigned', value: 500 },
  //   { name: 'inprogress', value: 333 },
  //   { name: 'closed', value: 33 },
  //   { name: 'resolved', value: 122 },
  //   { name: 'on_hold', value: 333 },

  {
    name: 'January',
    for_approval: 4000,
    reopen: 2400,
    assigned: 2400,
    inprogress: 22,
    closed: 200,
    resolved: 123,
    on_hold: 1245,
  },
  {
    name: 'Feb',
    for_approval: 400,
    reopen: 200,
    assigned: 1400,
    inprogress: 122,
    closed: 2002,
    resolved: 1223,
    on_hold: 129,
  },
  {
    name: 'March',
    for_approval: 400,
    reopen: 1240,
    assigned: 2400,
    inprogress: 3322,
    closed: 2880,
    resolved: 3223,
    on_hold: 1225,
  },
  {
    name: 'April',
    for_approval: 4010,
    reopen: 2402,
    assigned: 2200,
    inprogress: 3322,
    closed: 2002,
    resolved: 1223,
    on_hold: 2224,
  },
  {
    name: 'May',
    for_approval: 140,
    reopen: 242,
    assigned: 3400,
    inprogress: 2222,
    closed: 1200,
    resolved: 1223,
    on_hold: 1205,
  },
  {
    name: 'June',
    for_approval: 4100,
    reopen: 2420,
    assigned: 3400,
    inprogress: 4422,
    closed: 2008,
    resolved: 123,
    on_hold: 145,
  },
  {
    name: 'July',
    for_approval: 1000,
    reopen: 2402,
    assigned: 2200,
    inprogress: 3422,
    closed: 2300,
    resolved: 3123,
    on_hold: 245,
  },
  {
    name: 'Augest',
    for_approval: 4000,
    reopen: 2400,
    assigned: 2400,
    inprogress: 22,
    closed: 200,
    resolved: 123,
    on_hold: 1245,
  },
  {
    name: 'September',
    for_approval: 5400,
    reopen: 3400,
    assigned: 400,
    inprogress: 222,
    closed: 20,
    resolved: 123,
    on_hold: 145,
  },
  {
    name: 'October',
    for_approval: 1400,
    reopen: 240,
    assigned: 2800,
    inprogress: 1222,
    closed: 2011,
    resolved: 1223,
    on_hold: 145,
  },
  {
    name: 'November',
    for_approval: 400,
    reopen: 2400,
    assigned: 1400,
    inprogress: 1222,
    closed: 2200,
    resolved: 223,
    on_hold: 5245,
  },
  {
    name: 'December',
    for_approval: 1000,
    reopen: 240,
    assigned: 2400,
    inprogress: 2222,
    closed: 20,
    resolved: 1223,
    on_hold: 1145,
  },
];

export const BarChartComp = () => {
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray='3 3' />
        <XAxis dataKey='name' />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey='for_approval'
          stackId='a'
          fill={ticketStatusColours['for_approval']}
        />
        <Bar
          dataKey='reopen'
          stackId='a'
          fill={ticketStatusColours['reopen']}
        />
        <Bar
          dataKey='assigned'
          stackId='a'
          fill={ticketStatusColours['assigned']}
        />
        <Bar
          dataKey='inprogress'
          stackId='a'
          fill={ticketStatusColours['inprogress']}
        />
        <Bar
          dataKey='closed'
          stackId='a'
          fill={ticketStatusColours['closed']}
        />
        <Bar
          dataKey='resolved'
          stackId='a'
          fill={ticketStatusColours['resolved']}
        />
        <Bar
          dataKey='on_hold'
          stackId='a'
          fill={ticketStatusColours['on_hold']}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
