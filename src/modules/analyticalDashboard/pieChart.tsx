import { Box } from '@mui/system';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

export const Piechart = () => {
  const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  return (
    <Box>
      {' '}
      <PieChart width={800} height={400}>
        <Pie
          data={data}
          cx={120}
          cy={200}
          innerRadius={60}
          outerRadius={80}
          fill='#8884d8'
          paddingAngle={5}
          dataKey='value'
          label={(props) => <Label props={props} data={data} />}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Pie
          data={data}
          cx={420}
          cy={200}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          fill='#8884d8'
          paddingAngle={5}
          dataKey='name'
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
