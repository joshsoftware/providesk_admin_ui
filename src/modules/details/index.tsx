import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useTicketDetails } from './details.hook';
import Loader from 'modules/Auth/components/Loader';
import { TimelineComponent } from './components/Timeline';
import { EditTicketForm } from './components/EditTicketForm';
import BackButtonIcon from '@mui/icons-material/KeyboardBackspaceSharp';
import ROUTE from 'routes/constants';

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

import { ImageS3Tag } from './components/ImageTag';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';

function Details() {
  const id: number = parseInt(useParams().id as string);
  const { userAuth } = useContext(UserContext);
  const {
    ticket: ticketDetails,
    activities,
    isLoading: isFetchingTicketDetails,
  } = useTicketDetails(id);

  const navigate = useNavigate();
  const [ticket, setTicket] = useState(ticketDetails);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    setTicket(ticketDetails);
  }, [ticketDetails]);

  const handleBackClick = () => {
    navigate(ROUTE.HOME);
  };

  return (
    <div>
      <Grid container>
        <Loader isLoading={isFetchingTicketDetails} />
        <Grid item xs={12} md={4} p={5}>
          <BackButtonIcon
            onClick={handleBackClick}
            style={{ color: 'grey', cursor: 'pointer', marginRight: '8px' }}
          />
          <Divider>
            <Typography variant='h5' component='div'>
              Ticket Details
            </Typography>
          </Divider>
          <Box>
            {
              (userAuth.role !== ROLES.EMPLOYEE || ticket?.status === 'resolved') &&
              <div>
                <IconButton
                  aria-label='edit'
                  size='large'
                  onClick={() => setOpenEdit(true)}
                >
                  <EditIcon fontSize='inherit' />
                </IconButton>
              </div>
            }
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
                      <Chip
                        label={ticket?.status}
                        style={{
                          backgroundColor: ticketStatusColours[ticket?.status],
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ color: '#63686b' }}>
                      Previous Comment
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {ticket?.reason_for_update || '_'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Image</TableCell>
                    <TableCell>
                      <Box
                        display='flex'
                        sx={{ width: '300px', overflowX: 'scroll' }}
                      >
                        {ticket?.asset_url?.map((item) => (
                          <ImageS3Tag path={item} />
                        ))}
                      </Box>
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
