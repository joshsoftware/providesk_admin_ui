import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  Checkbox,
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
import { toast } from 'react-toastify';

interface Props {
  details: IComplaintDetails;
  selectedTicketForBulkUpdate: {
    id: number[];
    status: string;
    permited_transitions: string[];
  };
  email: string;
  handleChecked: (a: any) => void;
  setSeletedTicketForBulkUpdate: (a: any) => void;
  role: string;
}

const ComplaintCard: React.FC<Props> = ({
  details,
  setSeletedTicketForBulkUpdate,
  selectedTicketForBulkUpdate,
  handleChecked,
  email,
  role,
}) => {
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
    permited_transitions,
    requester_email,
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
      className='complaint-card'
      sx={{ '&:hover': { borderColor: 'primary.main' } }}
    >
      <CardContent sx={{ pb: '0.5rem !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
          {role !== 'employee' && (
            <Checkbox
              checked={selectedTicketForBulkUpdate.id.indexOf(id) !== -1}
              onChange={(e) => {
                if (requester_email === email) {
                  toast.error('You can not update own ticket status');
                  return;
                }
                handleChecked({
                  checked: e.target.checked,
                  id,
                  status,
                  permited_transitions,
                });
              }}
              sx={{ padding: '0' }}
            />
          )}
          <Box
            flex={1}
            display={'flex'}
            flexDirection={'column'}
            overflow={'hidden'}
          >
            <Typography
              variant='subtitle1'
              flex={1}
              textTransform='capitalize'
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
            >
              {ticket_number}
            </Typography>
            <Typography
              variant='body2'
              flex={1}
              textTransform='capitalize'
              overflow={'hidden'}
              textOverflow={'ellipsis'}
              whiteSpace={'nowrap'}
            >
              {title}
            </Typography>
          </Box>
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
          onClick={onCardClick}
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
