import {
  Box,
  Checkbox,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DateFormate } from 'apis/utils/date.utils';
import { UserContext } from 'App';
import { ticketStatusColours } from 'modules/details/constants';
import ComplaintCard from 'modules/shared/ComplaintCard';
import moment from 'moment';
import { Component, ReactElement, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ROUTE from 'routes/constants';
import { STATUS } from './constant';

export const CardsView = ({
  data,
  tableview,
  setSeletedTicketForBulkUpdate,
  selectedTicketForBulkUpdate,
}) => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const role = userContext?.userAuth?.role;
  const email = userContext?.userProfile?.email;

  // navigate to the details page of specific complaint
  const onCardClick = (id) => {
    navigate(`${ROUTE.DASHBOARD}/${id}`);
  };
  const TableColumn: {
    label: string;
    key: string;
    Component?: (a: any) => ReactElement | string;
  }[] = [
    {
      label: '',
      key: 'all',
      Component: (ticket) => {
        const { id, permited_transitions, requester_email, status } = ticket;

        return (
          <>
            {' '}
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
              />
            )}
          </>
        );
      },
    },
    {
      label: 'Status',
      key: 'status',
      Component: (value) => (
        <Chip
          label={STATUS[value]}
          className='text-truncate'
          sx={{
            backgroundColor: ticketStatusColours[value],
            color: STATUS[value] === 'Rejected' ? '#FFF' : 'inherit',
          }}
        />
      ),
    },
    {
      label: 'Ticket ID',
      key: 'ticket_number',
      Component: (value) => (
        <Typography variant='body2' flex={1} sx={{ fontWeight: '700' }}>
          {value}
        </Typography>
      ),
    },
    {
      label: 'Department',
      key: 'department',
    },
    {
      label: 'Category',
      key: 'category',
    },
    {
      label: 'Raised by',
      key: 'requester',
    },
    {
      label: 'Raised Time',
      key: 'created_at',
      Component: (value) => DateFormate(value),
    },
    {
      label: 'Resolver',
      key: 'resolver',
    },
    {
      label: 'ETA',
      key: 'eta',
      Component: (eta) => (eta ? moment(new Date(eta)).format('ll') : '_'),
    },
    {
      label: 'Last Comment',
      key: 'reason_for_update',
      Component: (value) => value || '_',
    },
    {
      label: 'Last Updated Time',
      key: 'updated_at',
      Component: (value) => DateFormate(value),
    },
  ];
  const handleChecked = useCallback(
    (obj: {
      checked: boolean;
      id: number;
      status: string;
      permited_transitions: string[];
    }) => {
      const { checked, id, status, permited_transitions } = obj;
      if (
        ((selectedTicketForBulkUpdate.status &&
          selectedTicketForBulkUpdate.status === status) ||
          selectedTicketForBulkUpdate.status === '') &&
        checked === true
      ) {
        setSeletedTicketForBulkUpdate((st) => ({
          ...st,
          id: [...st.id, id],
          status,
          permited_transitions,
        }));
        return;
      } else if (checked === true)
        toast.error('Group update all tickets should be in same status!!');
      else if (selectedTicketForBulkUpdate.id.length === 1) {
        setSeletedTicketForBulkUpdate((st) => ({
          id: [],
          status: '',
          permited_transitions: [],
        }));
        return;
      }
      setSeletedTicketForBulkUpdate((st) => ({
        ...st,
        id: st.id.filter((item) => item != id),
      }));
    },
    [selectedTicketForBulkUpdate, setSeletedTicketForBulkUpdate]
  );

  return (
    <>
      {!tableview ? (
        <Box
          sx={{ display: 'grid', gap: '1rem' }}
          className='complaint-card-grid'
        >
          {data?.map((complaint) => (
            <ComplaintCard
              details={complaint}
              role={role}
              setSeletedTicketForBulkUpdate={setSeletedTicketForBulkUpdate!}
              selectedTicketForBulkUpdate={selectedTicketForBulkUpdate}
              handleChecked={handleChecked}
              email={email}
            />
          ))}
        </Box>
      ) : (
        <Paper>
          <TableContainer>
            <Table stickyHeader aria-label='sticky table'>
              <TableHead>
                <TableRow>
                  {TableColumn.map((column) => (
                    <TableCell key={column.key}>{column.label}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((itemData) => (
                  <TableRow
                    key={itemData?.id}
                    hover
                    // onClick={() => onCardClick(itemData?.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {TableColumn?.map((item) => (
                      <TableCell
                        key={item.key}
                        onClick={() => {
                          item.key !== 'all' && onCardClick(itemData?.id);
                        }}
                      >
                        {item.Component
                          ? item.Component(
                              item.key === 'all' ? itemData : itemData[item.key]
                            )
                          : itemData[item.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </>
  );
};
