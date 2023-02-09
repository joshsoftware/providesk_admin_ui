import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import Loader from 'modules/Auth/components/Loader';
import { MaskLoader } from 'modules/shared/MaskLoader';
import { useOverDue } from '../reports.hook';
import { Ticket } from './Ticket';

export const Overdue = () => {
  const { isLoading: isLoadingOverdueList, data: overDueList } = useOverDue();

  return (
    <Box display='flex' flexDirection='column' flex='1' gap={3} p={3}>
      {isLoadingOverdueList ? (
        <Loader isLoading={isLoadingOverdueList} />
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={4} display='flex' flexDirection='column' gap={3}>
            <Typography variant='h5'>Overdues</Typography>
            <Card variant='outlined'>
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                {overDueList?.overdue?.length! > 0 ? (
                  overDueList?.overdue?.map((item) => (
                    <Ticket ticket={item} overdue={true} />
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center', my: 4 }}>
                    No data
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} display='flex' flexDirection='column' gap={3}>
            <Typography variant='h5'>Overdues in 2 days</Typography>
            <Card variant='outlined'>
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                {overDueList?.overdue_in_two_days?.length! > 0 ? (
                  overDueList?.overdue_in_two_days?.map((item) => (
                    <Ticket ticket={item} leftTime={true} />
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center', my: 4 }}>
                    No data
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} display='flex' flexDirection='column' gap={3}>
            <Typography variant='h5'>Overdues in some days</Typography>
            <Card variant='outlined'>
              <CardContent
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                {overDueList?.overdue_after_two_days?.length! > 0 ? (
                  overDueList?.overdue_after_two_days?.map((item) => (
                    <Ticket ticket={item} leftTime={true} />
                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center', my: 4 }}>
                    No data
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};
