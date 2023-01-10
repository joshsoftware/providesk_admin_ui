import {
  Box,
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
import { ticketStatusColours } from 'modules/details/constants';
import ComplaintCard from 'modules/shared/ComplaintCard';
import moment from 'moment';
import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import ROUTE from 'routes/constants';
import { STATUS } from './constant';

export const CardsView = ({ data, tableview }) => {
  const navigate = useNavigate();

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
  return (
    <>
      {!tableview ? (
        <Box
          sx={{ display: 'grid', gap: '1rem' }}
          className='complaint-card-grid'
        >
          {data?.map((complaint) => (
            <ComplaintCard details={complaint} />
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
                    onClick={() => onCardClick(itemData?.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {TableColumn?.map((item) => (
                      <TableCell key={item.key}>
                        {item.Component
                          ? item.Component(itemData[item.key])
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
