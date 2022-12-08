import {
  Timeline,
  TimelineDot,
  TimelineConnector,
  TimelineSeparator,
  TimelineItem,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import { Box, Chip, Paper, Typography } from '@mui/material';

import { getLastDaysFrom } from 'apis/utils/date.utils';
import { ticketStatusColours } from '../constants';
import { ITicketActivity } from '../type';
import { ImageS3Tag } from './ImageTag';

export const TimelineComponent = ({ activities }: any) => {
  return (
    <Timeline>
      {activities?.map((item, index) => {
        return (
          <TimelineItem key={item.created_at}>
            <TimelineOppositeContent sx={{ flex: '0 1 25%' }}>
              <TimelineLeft date={item.created_at} index={index} />
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot
                sx={{
                  backgroundColor:
                    ticketStatusColours[item?.current_ticket_status],
                }}
              />
              <TimelineConnector></TimelineConnector>
            </TimelineSeparator>
            <TimelineContent>
              <TimeLineDescription activity={item} />
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );
};

const TimelineLeft = ({ date, index }: { date: string; index: number }) => {
  return <Typography variant='body2'>{getLastDaysFrom(date)}</Typography>;
};

const TimeLineDescription = ({ activity }: { activity: ITicketActivity }) => {
  return (
    <Box
      component={Paper}
      elevation={0}
      variant='outlined'
      display={'grid'}
      gap={1}
      px={3}
      py={2}
    >
      <Typography variant='body1'>{activity?.get_description}</Typography>
      {activity.reason_for_update && (
        <Box>
          <Typography
            component='span'
            variant='body2'
            fontWeight={'fontWeightBold'}
          >
            Comment:{' '}
          </Typography>
          <Typography component='span' variant='body2'>
            {activity?.reason_for_update}
          </Typography>
        </Box>
      )}
      <Box>
        <Chip
          label={activity?.current_ticket_status}
          size='small'
          sx={{
            backgroundColor:
              ticketStatusColours[activity?.current_ticket_status],
            fontSize: 12,
            textTransform: 'capitalize',
            borderRadius: 1,
          }}
        />
      </Box>
      {activity?.asset_url?.length > 0 ? (
        <Box display={'flex'} flexWrap={'wrap'} gap={2} pt={2}>
          {activity?.asset_url?.map((item) => (
            <ImageS3Tag path={item as string} />
          ))}
        </Box>
      ) : null}
    </Box>
  );
};
