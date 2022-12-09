import { useState, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';
import {
  Box,
  Typography,
  Modal,
  Chip,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from '@mui/material';
import { EditRounded } from '@mui/icons-material';

import { useTicketDetails } from './details.hook';
import Loader from 'modules/Auth/components/Loader';
import { TimelineComponent } from './components/Timeline';
import { UpdateTicketForm } from './components/EditTicketForm';
import { ticketStatusColours } from './constants';
import { ImageS3Tag } from './components/ImageTag';
import { Button } from 'modules/shared/Button';
import { STATUS } from 'modules/dashboard/constant';

const Ticket = lazy(() => import('modules/Ticket'));

function Details() {
  const id: number = parseInt(useParams().id as string);
  const {
    ticket: ticketDetails,
    activities,
    isLoading: isFetchingTicketDetails,
  } = useTicketDetails(id);

  const [ticket, setTicket] = useState(ticketDetails);
  const [openProgressTicket, setOpenProgressTicket] = useState(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);

  useEffect(() => {
    setTicket(ticketDetails);
  }, [ticketDetails]);

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Box display={'flex'} gap={3}>
          <Typography variant='h5' textTransform={'capitalize'}>
            {ticket?.title}
          </Typography>
          <Chip
            label={STATUS[ticket?.status]}
            size='small'
            sx={{
              backgroundColor: ticketStatusColours[ticket?.status],
              fontSize: 12,
              textTransform: 'capitalize',
              borderRadius: 1,
            }}
          />
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant='text'
            startIcon={<EditRounded sx={{ color: 'primary.main' }} />}
            sx={{ color: 'grey.900' }}
            onClick={() => {
              setOpenEdit(true);
            }}
          >
            Edit Ticket
          </Button>
          <Button
            variant='text'
            startIcon={<EditRounded sx={{ color: 'primary.main' }} />}
            sx={{ color: 'grey.900' }}
            onClick={() => setOpenProgressTicket(true)}
          >
            Update Ticket
          </Button>
        </Box>
      </Box>
      <Box display={'flex'} flexDirection={{ sm: 'row', xs: 'column' }} gap={3}>
        <Loader isLoading={isFetchingTicketDetails} />
        <Box
          component={Paper}
          alignSelf={'flex-start'}
          flex={1}
          maxWidth={'50%'}
        >
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Description</TableCell>
                  <TableCell>{ticket?.description}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Department</TableCell>
                  <TableCell>{ticket?.department}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Category</TableCell>
                  <TableCell>{ticket?.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Ticket Type</TableCell>
                  <TableCell>{ticket?.ticket_type}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Created by</TableCell>
                  <TableCell>{ticket?.requester}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Assigned to</TableCell>
                  <TableCell>{ticket?.resolver}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Previous Comment</TableCell>
                  <TableCell>{ticket?.reason_for_update || '_'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>ETA</TableCell>
                  <TableCell>
                    {ticket?.eta ? moment(ticket?.eta).format('ll') : '_'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>
                    {ticket?.asset_url ? (
                      <Box display={'flex'} flexWrap={'wrap'} gap={2}>
                        {ticket?.asset_url?.map((item) => (
                          <ImageS3Tag path={item} />
                        ))}
                      </Box>
                    ) : null}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Modal
            open={openProgressTicket}
            onClose={() => setOpenProgressTicket(false)}
            sx={{ overflow: 'scroll' }}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <UpdateTicketForm
              ticket={ticketDetails}
              id={id}
              setOpenEdit={setOpenProgressTicket}
            />
          </Modal>
          {openEdit && (
            <Suspense fallback={<Loader isLoading={true} />}>
              <Ticket
                open={openEdit}
                setOpen={setOpenEdit}
                isEdit={true}
                data={ticketDetails}
              />
            </Suspense>
          )}
        </Box>
        <Box component={Paper} flex={1}>
          <TimelineComponent activities={activities} />
        </Box>
      </Box>
    </Box>
  );
}

export default Details;
