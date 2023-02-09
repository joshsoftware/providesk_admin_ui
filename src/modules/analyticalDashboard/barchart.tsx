import { STATUS } from 'modules/dashboard/constant';
import { ticketStatusColours } from 'modules/details/constants';
import React, { PureComponent, useMemo } from 'react';
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
import { dataToBarChart } from './util';

//dumy data Todo
const data = [
  {
    name: 'January',
    for_approval: 400,
    reopen: 240,
    assigned: 240,
    inprogress: 22,
    closed: 20,
    resolved: 123,
    on_hold: 145,
  },
  {
    name: 'Feb',
    for_approval: 400,
    reopen: 200,
    assigned: 140,
    inprogress: 122,
    closed: 200,
    resolved: 123,
    on_hold: 129,
  },
  {
    name: 'March',
    for_approval: 400,
    reopen: 124,
    assigned: 240,
    inprogress: 322,
    closed: 288,
    resolved: 223,
    on_hold: 122,
  },
  {
    name: 'April',
    for_approval: 400,
    reopen: 240,
    assigned: 200,
    inprogress: 332,
    closed: 200,
    resolved: 123,
    on_hold: 224,
  },
  {
    name: 'May',
    for_approval: 140,
    reopen: 242,
    assigned: 340,
    inprogress: 222,
    closed: 120,
    resolved: 123,
    on_hold: 105,
  },
  {
    name: 'June',
    for_approval: 210,
    reopen: 242,
    assigned: 340,
    inprogress: 442,
    closed: 208,
    resolved: 123,
    on_hold: 145,
  },
  {
    name: 'July',
    for_approval: 100,
    reopen: 242,
    assigned: 220,
    inprogress: 342,
    closed: 230,
    resolved: 323,
    on_hold: 245,
  },
  {
    name: 'Augest',
    for_approval: 400,
    reopen: 240,
    assigned: 240,
    inprogress: 22,
    closed: 200,
    resolved: 123,
    on_hold: 125,
  },
  {
    name: 'September',
    for_approval: 540,
    reopen: 340,
    assigned: 400,
    inprogress: 222,
    closed: 20,
    resolved: 123,
    on_hold: 145,
  },
  {
    name: 'October',
    for_approval: 140,
    reopen: 240,
    assigned: 280,
    inprogress: 122,
    closed: 211,
    resolved: 122,
    on_hold: 145,
  },
  {
    name: 'November',
    for_approval: 400,
    reopen: 240,
    assigned: 400,
    inprogress: 122,
    closed: 220,
    resolved: 223,
    on_hold: 245,
  },
  {
    name: 'December',
    for_approval: 100,
    reopen: 240,
    assigned: 200,
    inprogress: 222,
    closed: 20,
    resolved: 123,
    on_hold: 145,
  },
];
const BarChartComp = ({ datat }) => {
  let dataForGraph = useMemo(() => dataToBarChart(datat), [datat]);
  return (
    <ResponsiveContainer width='100%' height='100%'>
      <BarChart
        width={500}
        height={300}
        data={dataForGraph}
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
          dataKey={STATUS['assigned']}
          stackId='a'
          fill={ticketStatusColours['assigned']}
        />
        <Bar
          dataKey={STATUS['for_approval']}
          stackId='a'
          fill={ticketStatusColours['for_approval']}
        />

        <Bar
          dataKey={STATUS['inprogress']}
          stackId='a'
          fill={ticketStatusColours['inprogress']}
        />

        <Bar
          dataKey={STATUS['resolved']}
          stackId='a'
          fill={ticketStatusColours['resolved']}
        />
        <Bar
          dataKey={STATUS['closed']}
          stackId='a'
          fill={ticketStatusColours['closed']}
        />
        <Bar
          dataKey={STATUS['on_hold']}
          stackId='a'
          fill={ticketStatusColours['on_hold']}
        />
        <Bar
          dataKey={STATUS['reopen']}
          stackId='a'
          fill={ticketStatusColours['reopen']}
        />
        <Bar
          dataKey={STATUS['rejected']}
          stackId='a'
          fill={ticketStatusColours['rejected']}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default React.memo(BarChartComp);
