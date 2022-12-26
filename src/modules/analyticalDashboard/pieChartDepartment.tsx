import { List, ListItem } from '@mui/material';
import { Box } from '@mui/system';
import { ticketStatusColours } from 'modules/details/constants';
import React, { PureComponent, useState } from 'react';
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChartData } from './type';

const COLORS = [
  '#FF33CC',
  '##FF3366',
  '#FF6633',
  '#FFCC33',
  '#66FF33',
  '#FF33AA',
];
const COLORSInnerPieChart = Object.keys(ticketStatusColours)?.map(
  (item) => ticketStatusColours[item]
);
const RADIAN = Math.PI / 180;
const RenderCustomizedLabel = ({ props, data }) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, value } =
    props;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <>
      <text
        x={x}
        y={y}
        fill='black'
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${value}`}
      </text>
    </>
  );
};

export const PieChartDepartment = ({
  data1,
  setDepartmentId,
  data2,
}: {
  data1: ChartData[];
  setDepartmentId(a: number);
  data2: ChartData[];
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  console.log(data2, 'data');
  const onPieEnter = (a, index) => {
    console.log(a, 'value');
    setDepartmentId(a.id);
    setActiveIndex(index);
  };
  return (
    <ResponsiveContainer width='90%' height='90%'>
      <PieChart width={550} height={550}>
        <Tooltip />
        <Legend layout='vertical' verticalAlign='middle' align='right' />
        <Pie
          data={data2}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          outerRadius={75}
          fill='#8884d8'
          labelLine={false}
          label={(props) => (
            <RenderCustomizedLabel props={props} data={data2} />
          )}
        >
          {data1.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORSInnerPieChart[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Pie
          data={data1}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={110}
          outerRadius={130}
          fill='#82ca9d'
          onClick={onPieEnter}

          //   label={(props) => (
          //     <RenderCustomizedLabel props={props} data={data1} />
          //   )}
        >
          {' '}
          {data1.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* <circle cx={cx - 20} cy={cy + 92} r={2} fill={fill} stroke='none' /> */}
      <text x={cx} y={cy + 90} dy={8} textAnchor='middle' fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      {/* <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      /> */}

      <text
        x={ex + (cos >= 0 ? 1 : -1) * 0.1}
        y={ey}
        textAnchor={textAnchor}
        fill='#333'
      >{`${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 0.1}
        y={ey + 20}
        textAnchor={textAnchor}
        fill='#333'
      >{`${payload.name}`}</text>
    </g>
  );
};
