import {
  Card,
  CardContent,
  CardHeader,
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
    <Box sx={{}}>
      {isLoadingOverdueList ? (
        <Loader isLoading={isLoadingOverdueList} />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={4} sx={{ my: 2 }}>
            <Card>
              <CardHeader title='Overdues' />

              <CardContent>
                {overDueList?.overdue?.length! > 0 ? (
                  overDueList?.overdue?.map((item) => (
                    <Ticket ticket={item} overdue={true} />
                  ))
                ) : (
                  <Typography
                    sx={{ justifyItems: 'center', textAlign: 'center', my: 4 }}
                    variant='h5'
                  >
                    {' '}
                    No data
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} sx={{ my: 2 }}>
            <Card>
              <CardHeader title='Overdues in 2 days' />

              <CardContent>
                {overDueList?.overdue_in_two_days?.length! > 0 ? (
                  overDueList?.overdue_in_two_days?.map((item) => (
                    <Ticket ticket={item} leftTime={true} />
                  ))
                ) : (
                  <Typography
                    sx={{ justifyItems: 'center', textAlign: 'center', my: 4 }}
                    variant='h5'
                  >
                    {' '}
                    No data
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={4} sx={{ my: 2 }}>
            <Card>
              <CardHeader title='Overdues in some days' />

              <CardContent>
                {overDueList?.overdue_after_two_days?.length! > 0 ? (
                  overDueList?.overdue_after_two_days?.map((item) => (
                    <Ticket ticket={item} leftTime={true} />
                  ))
                ) : (
                  <Typography
                    sx={{ justifyItems: 'center', textAlign: 'center', my: 4 }}
                    variant='h5'
                  >
                    {' '}
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
