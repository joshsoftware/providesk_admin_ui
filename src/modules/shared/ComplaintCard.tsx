import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import KeyboardDoubleArrowRightRounded from '@mui/icons-material/KeyboardDoubleArrowRightRounded';

import { IComplaintDetails } from 'modules/dashboard/types';
import ROUTE from 'routes/constants';
import { ticketStatusColours } from 'modules/details/constants';
import { DateFormate } from 'apis/utils/date.utils';
import { STATUS } from 'modules/dashboard/constant';
import moment from 'moment';
interface Props {
  details: IComplaintDetails;
}

const ComplaintCard: React.FC<Props> = (props) => {
  const { details } = props;
  const {
    id,
    title,
    status,
    created_at,
    updated_at,
    category,
    department,
    resolver,
    requester,
    reason_for_update,
    eta,
    ticket_number,
  } = details;

  const navigate = useNavigate();

  // navigate to the details page of specific complaint
  const onCardClick = () => {
    navigate(`${ROUTE.DASHBOARD}/${id}`);
  };

  const complaintConfig = [
    {
      label: 'Department',
      value: department,
    },
    {
      label: 'Category',
      value: category,
    },
    {
      label: 'Raised by',
      value: requester,
    },
    {
      label: 'Raised Time',
      value: DateFormate(created_at),
    },
    {
      label: 'Resolver',
      value: resolver,
    },
    {
      label: 'ETA',
      value: eta ? moment(new Date(eta)).format('ll') : '_',
    },
    {
      label: 'Last Comment',
      value: reason_for_update || '_',
    },
    {
      label: 'Last Updated Time',
      value: DateFormate(updated_at) || '_',
    },
  ];

  return (
    <Card
      variant='outlined'
      onClick={onCardClick}
      className='complaint-card'
      sx={{ '&:hover': { borderColor: 'primary.main' } }}
    >
      <CardContent sx={{ pb: '0.5rem !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Typography variant='subtitle1' flex={1} textTransform='capitalize'>
            {ticket_number}
          </Typography>
          <Typography variant='subtitle1' flex={1} textTransform='capitalize'>
            {title}
          </Typography>
          <Chip
            label={STATUS[status]}
            className='text-truncate'
            sx={{
              backgroundColor: ticketStatusColours[status],
              color: STATUS[status] === 'Rejected' ? '#FFF' : 'inherit',
            }}
          />
        </Box>
        <List className='card-list'>
          {complaintConfig.map((config) => (
            <ListItem
              sx={{ gap: '1rem', p: '0.5rem' }}
              className='card-list-item'
            >
              <Typography variant='body2' sx={{ mr: 'auto' }}>
                {config.label}
              </Typography>
              <Typography
                variant='body2'
                sx={{ fontWeight: '700' }}
                className='text-truncate'
              >
                {config.value}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Box
          className='bottom-bar'
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.25rem',
            backgroundColor: 'primary.main',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1.25rem',
              fontWeight: '500',
              color: 'common.white',
              mb: '0',
            }}
          >
            See More
          </Typography>
          <KeyboardDoubleArrowRightRounded
            sx={{ fontSize: '1.25rem', color: 'common.white' }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(ComplaintCard);
