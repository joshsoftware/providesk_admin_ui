import {
  Timeline,
  TimelineDot,
  TimelineConnector,
  TimelineSeparator,
  TimelineItem,
  TimelineContent,
  TimelineOppositeContent,
} from '@mui/lab';
import { Box, Chip, Paper } from '@mui/material';
import { ticketStatusColours } from '../constants';

export const TimelineComponent = ({ activities }: any) => {
  return (
    <>
      <Timeline>
        {activities?.map((item) => {
          return (
            <Box key={item.created_at}>
              <TimelineItem>
                <TimelineOppositeContent>
                  <TimelineLeft date={item.created_at} />{' '}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot />
                  <TimelineConnector></TimelineConnector>
                </TimelineSeparator>
                <TimelineContent>
                  <TimeLineDescription activity={item} />
                </TimelineContent>
              </TimelineItem>
            </Box>
          );
        })}
      </Timeline>
    </>
  );
};

const TimelineLeft = ({ date }: { date: string }) => {
  return (
    <div
      style={{
        margin: '0.3rem 0',
        minWidth: '10vw',
        maxWidth: '100%',
        textAlign: 'right',
      }}
    >
      {new Date(date).toUTCString().slice(0, 22)}
    </div>
  );
};

const TimeLineDescription = ({ activity }: { activity: any }) => {
  return (
    <Paper elevation={8} style={{ width: '40vw', maxWidth: '100%' }}>
      <div className='p-2 m-2'>
        <p>{activity?.description}</p>
        <Chip
          label={activity?.current_ticket_status}
          style={{
            backgroundColor:
              ticketStatusColours[activity.current_ticket_status] || 'default',
            color: '#ffffff',
          }}
        />
      </div>
    </Paper>
  );
};
