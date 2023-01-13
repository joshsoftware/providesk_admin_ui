import {
  Card,
  CardContent,
  Chip,
  Divider,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import SpatialAudioOffRoundedIcon from '@mui/icons-material/SpatialAudioOffRounded';
import SpatialTrackingRoundedIcon from '@mui/icons-material/SpatialTrackingRounded';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { STATUS } from 'modules/dashboard/constant';
import { ticketStatusColours } from 'modules/details/constants';
import { dateDifferenceInDays } from 'apis/utils/date.utils';
import { Ticket as TicketType } from '../types';
import ROUTE from 'routes/constants';
import { useNavigate } from 'react-router-dom';

export const Ticket = ({
  ticket,
  overdue,
  leftTime,
}: {
  ticket: TicketType;
  overdue?: boolean;
  leftTime?: boolean;
}) => {
  const navigate = useNavigate();
  const onCardClick = (id) => {
    navigate(`${ROUTE.DASHBOARD}/${id}`);
  };
  const days = dateDifferenceInDays(ticket?.eta!);
  return (
    <Card
      variant='outlined'
      sx={{ cursor: 'pointer' }}
      onClick={() => onCardClick(ticket?.id)}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box display={'flex'} alignItems={'center'} gap={3}>
          <Typography variant='h6' mb={0}>
            #{ticket?.id + ' '} {ticket?.title}
          </Typography>
          <Chip
            label={STATUS[ticket?.status]}
            sx={{
              backgroundColor: ticketStatusColours[ticket?.status],
              color: STATUS[ticket?.status] === 'Rejected' ? '#FFF' : 'inherit',
              ml: 'auto',
            }}
          />
        </Box>
        <Stepper>
          <Step active>
            <StepLabel StepIconComponent={SpatialAudioOffRoundedIcon}>
              <Typography color={'secondary'}>{ticket?.requester}</Typography>
            </StepLabel>
          </Step>
          <Step active>
            <StepLabel StepIconComponent={SpatialTrackingRoundedIcon}>
              <Typography color={'primary'}>{ticket?.resolver}</Typography>
            </StepLabel>
          </Step>
        </Stepper>

        <Divider />
        <Box display={'flex'} alignItems={'center'} gap={1}>
          {days > 0 && (
            <>
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
      </CardContent>
    </Card>
  );
};
