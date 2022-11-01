import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import CardActionArea from '@mui/material/CardActionArea';

import { IComplaintDetails } from 'modules/dashboard/types';
import ROUTE from 'routes/constants';

interface Props {
  details: IComplaintDetails;
}

const ComplaintCard: React.FC<Props> = (props) => {
  const { details } = props;
  const {
    id,
    title,
    description,
    ticket_number,
    status,
    priority,
    ticket_type,
    resolved_at,
    created_at,
    updated_at,
    category,
    department,
    resolver,
    requester,
    permited_events,
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
      label: 'Raised by',
      value: requester,
    },
    {
      label: 'Raised Time',
      value: created_at,
    },
    {
      label: 'Assigned To',
      value: resolver,
    },
    {
      label: 'Department',
      value: department,
    },
    { label: 'Last Updated Time', value: updated_at },
  ];

  return (
    <Card sx={{ minWidth: 300, cursor: 'pointer' }} onClick={onCardClick}>
      <CardActionArea>
        <CardContent>
          <Stack
            direction='row'
            spacing={1}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 2,
            }}
          >
            <Chip label={id} />
            <Chip label={status} color='primary' />
          </Stack>
          <Typography
            sx={{ fontSize: 16, fontWeight: 'bold', maxWidth: 300 }}
            color='text.dark'
            gutterBottom
          >
            {title}
          </Typography>
          <TableContainer>
            <Table>
              <TableBody>
                {complaintConfig.map((config) => (
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>
                      {config.label}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {config.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default React.memo(ComplaintCard);
