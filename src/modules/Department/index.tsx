import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, TextField, Typography } from '@mui/material';

import { useCreateDepartment } from './department.hook';
import { useDepartMentList } from 'modules/details/details.hook';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';

function createData(name: string, calories: number) {
  return { name, calories };
}
export const DepartMent = () => {
  // todo
  const [department, setDepartment] = React.useState<string>('');

  const rows = [
    createData('Frozen yoghurt', 159),
    createData('Ice cream sandwich', 237),
    createData('Eclair', 262),
    createData('Cupcake', 305),
    createData('Gingerbread', 356),
  ];
  const { data, isLoading } = useDepartMentList();
  const { mutate, isLoading: isLoadingpatch } = useCreateDepartment();
  const saveDepatrment = React.useCallback(() => {
    const payload = { name: department, organization_id: 1 };

    mutate(payload);
  }, [mutate, department]);

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          m: 1,
        }}
      >
        <Box sx={{ m: 5, display: 'flex', alignItems: 'center' }}>
          <TextField
            label='Add new Department'
            value={department}
            type='text'
            required={true}
            variant='standard'
            color='secondary'
            onChange={(e) => setDepartment(e.target.value)}
          />
          <Button
            isLoading={isLoadingpatch}
            onClick={() => {
              saveDepatrment();
            }}
            className='btn btn-success mx-3'
            style={{ height: '40px' }}
            disabled={department.length < 6}
          >
            Save
          </Button>
        </Box>
        <Box sx={{ width: '600px', maxHeight: '60vh', overflowY: 'scroll' }}>
          {isLoading ? (
            <Loader isLoading={isLoading} />
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 250 }} aria-label='simple table'>
                <TableHead>
                  <TableRow>
                    <TableCell className='fw-bold'>Id</TableCell>
                    <TableCell className='fw-bold'>Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.map((row) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component='th' scope='row'>
                        <Typography>{row.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{row.name}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>
    </>
  );
};
