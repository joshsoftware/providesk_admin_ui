import { Card, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useAnalyticalReports } from './analyticalDashBoard.hook';
import { BarChartComp } from './barchart';
import { DepartmentChart } from './departmentChart';
import { Piechart } from './pieChart';
import { AnalyticalReportType } from './type';

export const AnalyticsReportDashBoard = () => {
  const {
    data,
    isLoading,
  }: { data: AnalyticalReportType; isLoading: boolean } =
    useAnalyticalReports();

  return (
    <>
      <Box sx={{ display: 'flex', height: '300px' }}>
        {' '}
        {data && (
          <>
            <Card>
              <Piechart data={data?.status_wise_organization_tickets} />
            </Card>
            <Card sx={{ height: '100%', width: '80%' }}>
              <BarChartComp datat={data.month_and_status_wise_tickets} />
            </Card>
          </>
        )}
      </Box>
      <Box sx={{ m: '10px' }}>
        <Card sx={{ height: '400px' }}>
          <Typography textAlign={'center'} fontWeight='bold'>
            Department
          </Typography>
          {/* todo */}
          {/* <CardContent> */}
          <DepartmentChart />
          {/* </CardContent> */}
        </Card>
      </Box>
    </>
  );
};
