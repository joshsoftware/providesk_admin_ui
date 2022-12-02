import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Card, CardContent, Chip, List, ListItem, Typography } from '@mui/material';
import { Box } from '@mui/system';
import KeyboardDoubleArrowRightRounded from '@mui/icons-material/KeyboardDoubleArrowRightRounded';

import { IComplaintDetails } from 'modules/dashboard/types';
import ROUTE from 'routes/constants';
import { ticketStatusColours } from 'modules/details/constants';
import { DateFormate } from 'apis/utils/date.utils';
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
    reason_for_update
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
      label: 'Assigned To',
      value: resolver,
    },
    {
      label: "Last Comment",
      value: reason_for_update || "_"
    },
    {
      label: 'Last Updated Time',
      value: DateFormate(updated_at) || '_'
    },
  ];

  return (
    <Card variant="outlined" onClick={onCardClick} className='complaint-card' sx={{ '&:hover': { borderColor: ticketStatusColours[status] } }}>
      <CardContent sx={{ pb: '0.5rem !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Typography variant='subtitle1' className='flex-1'>
            {title}
          </Typography>
          <Chip label={status.charAt(0).toUpperCase() + status.slice(1)} className='text-truncate' size='small' sx={{ fontSize: '0.75rem', fontWeight: '700', color: 'common.white', px: '0.5rem' }} style={{ backgroundColor: ticketStatusColours[status] }} />
        </Box>
        <List className='card-list'>
          {complaintConfig.map((config) => (
            <ListItem sx={{ gap: '1rem', p: '0.5rem' }} className='card-list-item'>
              <Typography variant='body2' sx={{ mr: 'auto' }}>{config.label}</Typography>
              <Typography variant='body2' sx={{ fontWeight: '700' }} className='text-truncate'>{config.value}</Typography>
            </ListItem>
          ))}
        </List>
        <Box className="bottom-bar" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem', backgroundColor: ticketStatusColours[status] }}>
          <Typography sx={{ fontSize: "0.875rem", lineHeight: '1.25rem', fontWeight: '600', color: 'common.white', mb: '0' }}>See More</Typography>
          <KeyboardDoubleArrowRightRounded sx={{ fontSize: '1.25rem', color: 'common.white' }} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default React.memo(ComplaintCard);