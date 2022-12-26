import { Height } from '@mui/icons-material';
import { Card, CardContent, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { BarChartComp } from './barchart';
import { DepartmentChart } from './departmentChart';
import { Piechart } from './pieChart';

export const AnalyticsReportDashBoard = () => {
  return (
    <>
      <Box sx={{ display: 'flex', height: '300px' }}>
        {' '}
        <Card>
          <Piechart />
        </Card>
        <Card sx={{ height: '100%', width: '80%' }}>
          <BarChartComp />
        </Card>
      </Box>
      <Box sx={{ m: '10px' }}>
        <Card sx={{ height: '400px' }}>
          <Typography textAlign={'center'} fontWeight='bold'>
            Department
          </Typography>
          {/* <CardContent> */}
          <DepartmentChart />
          {/* </CardContent> */}
        </Card>
      </Box>
    </>
  );
};
