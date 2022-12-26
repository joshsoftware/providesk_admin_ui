import { Box } from '@mui/system';
import { ticketStatusColours } from 'modules/details/constants';
import { useState } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export const Piechart = () => {
  const data = [
    { name: 'for_approval', value: 200 },
    { name: 'reopen', value: 300 },
    { name: 'assigned', value: 500 },
    { name: 'inprogress', value: 333 },
    { name: 'closed', value: 33 },
    { name: 'resolved', value: 122 },
    { name: 'on_hold', value: 333 },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  const COLORS = Object.keys(ticketStatusColours)?.map(
    (item) => ticketStatusColours[item]
  );
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  return (
    <Box>
      {' '}
      <PieChart width={350} height={300}>
        <Pie
          data={data}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          cx={150}
          cy={150}
          innerRadius={60}
          outerRadius={80}
          fill='#8884d8'
          paddingAngle={5}
          dataKey='value'
          // label={(props) => <Label props={props} data={data} />}
          onMouseEnter={onPieEnter}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Box>
  );
};

const Label = ({ props, data }) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, value, index } = props;
  console.log('handling label?', midAngle, innerRadius, outerRadius);
  const RADIAN = Math.PI / 180;
  // eslint-disable-next-line
  const radius = 25 + innerRadius + (outerRadius - innerRadius);
  // eslint-disable-next-line
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  // eslint-disable-next-line
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='#8884d8'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
    >
      {data[index].name} ({value})
    </text>
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
      <text x={cx} y={cy} dy={8} textAnchor='middle' fill={fill}>
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
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill='none'
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill='#333'
      >{`${value}`}</text>
    </g>
  );
};
