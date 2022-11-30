import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useTicketDetails } from './details.hook';
import Loader from 'modules/Auth/components/Loader';
import { TimelineComponent } from './components/Timeline';
import { EditTicketForm } from './components/EditTicketForm';

import {
  Box,
  Divider,
  Grid,
  Typography,
  Modal,
  Chip,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { ticketStatusColours } from './constants';

function Details() {
  const id: number = parseInt(useParams().id as string);
  const {
    ticket: ticketDetails,
    activities,
    isLoading: isFetchingTicketDetails,
  } = useTicketDetails(id);

  const [ticket, setTicket] = useState(ticketDetails);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setTicket(ticketDetails);
  }, [ticketDetails]);

  return (
    <div>
      <Grid container>
        <Loader isLoading={isFetchingTicketDetails} />
        <Grid item xs={12} md={4} p={5}>
          <Divider>
            <Typography variant='h5' component='div'>
              Ticket Details
            </Typography>
          </Divider>
          <Box>
            <div>
              <IconButton
                aria-label='edit'
                size='large'
                onClick={() => setOpenEdit(true)}
              >
                <EditIcon fontSize='inherit' />
              </IconButton>
            </div>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Title</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.title}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.description}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Department</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.department}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.category}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Ticket Type</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.ticket_type}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Created by</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.requester}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Assigned to</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.resolver}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      <Chip label={ticket?.status} style={{backgroundColor:ticketStatusColours[ticket?.status]}}/>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>
                      Previous Comment
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.reason_for_approval || '_'}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Modal
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            sx={{ overflow: 'scroll' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <EditTicketForm
              ticket={ticketDetails}
              id={id}
              setOpenEdit={setOpenEdit}
            />
          </Modal>
        </Grid>
        <Grid
          item
          xs={12}
          md={8}
          p={5}
          style={{ maxHeight: '85vh', overflow: 'auto' }}
        >
          <Divider>
            <Typography variant='h5' component='div'>
              Ticket History
            </Typography>
          </Divider>

          <TimelineComponent activities={activities} />
        </Grid>
      </Grid>
    </div>
  );
}

export default Details;
