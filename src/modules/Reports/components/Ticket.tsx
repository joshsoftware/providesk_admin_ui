import { Chip, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import SpatialAudioOffRoundedIcon from '@mui/icons-material/SpatialAudioOffRounded';
import SpatialTrackingRoundedIcon from '@mui/icons-material/SpatialTrackingRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { STATUS } from 'modules/dashboard/constant';
import { ticketStatusColours } from 'modules/details/constants';
import { dateDifferenceInDays } from 'apis/utils/date.utils';
import { Ticket as TicketType } from '../types';

export const Ticket = ({
  ticket,
  overdue,
  leftTime,
}: {
  ticket: TicketType;
  overdue?: boolean;
  leftTime?: boolean;
}) => {
  console.log(ticket, 'ticket');
  const days = dateDifferenceInDays(ticket?.eta!);
  return (
    <Paper elevation={3} sx={{ m: 2 }}>
      <Box m={2}>
        <Typography variant='h5'>
          #{ticket?.id + ' '} {ticket?.title}
        </Typography>
        <Box display={'flex'} sx={{ justifyContent: 'space-between', m: 2 }}>
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <SpatialAudioOffRoundedIcon />
            <Typography>{ticket?.resolver}</Typography>
          </Box>
          <Box display={'flex'} sx={{ alignItems: 'center' }}>
            <SpatialTrackingRoundedIcon color='primary' />
            <Typography>{ticket?.resolver}</Typography>
          </Box>
        </Box>
        <Box
          display={'flex'}
          sx={{
            justifyContent: 'space-between',
          }}
        >
          <Box display={'flex'} sx={{ my: 1 }}>
            {days > 0 && (
              <>
                {' '}
                <HourglassBottomRoundedIcon fontSize='small' color='error' />
                <Typography>late by {days}</Typography>
              </>
            )}
            {days == 0 && (
              <>
                <HourglassBottomRoundedIcon fontSize='small' color='primary' />
                <Typography>last day</Typography>
              </>
            )}
            {days < 0 && (
              <>
                <AccessTimeIcon fontSize='small' color='success' />
                <Typography>{-1 * days} days left</Typography>
              </>
            )}
          </Box>
          <Chip
            label={STATUS[ticket?.status]}
            sx={{
              backgroundColor: ticketStatusColours[ticket?.status],
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
};
