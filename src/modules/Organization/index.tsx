import React, { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { useCreateOrganization, useGetOrganization } from './organization.hook';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';

import {
  Box,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { AddBoxRounded, AddRounded } from '@mui/icons-material';

export const Organization = () => {
  const [organization, setOrganization] = useState<string>('');
  const [domain, setDomain] = useState<string>('');
  const [domainsList, setDomainsList] = useState<string[]>([]);

  const { mutate, isLoading: creatingOrganization } = useCreateOrganization();

  const handleAddDomain = useCallback(() => {
    const DomainRegEx = /[a-z0-9]*[.][a-z]*/;
    if (DomainRegEx.test(domain)) {
      setDomainsList([...domainsList, domain]);
      setDomain('');
    } else {
      toast.warning("Domain Name should be of type 'domain.xyz'");
    }
  }, [domain]);

  const handleDomainDelete = useCallback(
    (index) => {
      const modifiedDomains = [
        ...domainsList.slice(0, index),
        ...domainsList.slice(index + 1),
      ];
      setDomainsList(modifiedDomains);
    },
    [domainsList]
  );

  const createOrganization = useCallback(() => {
    let valid = /^[ A-Za-z0-9 ]*$/;
    if (!valid.test(organization)) {
      toast.warning(
        "Special charecter's are not allowed in organization name."
      );
    } else {
      let payload = {
        organization: {
          name: organization,
          domain: domainsList,
        },
      };
      mutate(payload);
      setOrganization('');
      setDomainsList([]);
      setOpen(false);
    }
  }, [organization, domainsList]);

  const [open, setOpen] = React.useState(false);

  const handleCreateOrganizationDialogOpen = () => {
    setOpen(true);
  };

  const handleCreateOrganizationDialogClose = () => {
    setOpen(false);
  };
  const { data: organizationList, isLoading: isLoadingOrganizationList } =
    useGetOrganization();

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', flex: '1', p: '1.5rem' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5'>Organizations</Typography>
        <Button
          variant='text'
          onClick={handleCreateOrganizationDialogOpen}
          startIcon={<AddRounded sx={{ color: 'primary.main' }} />}
          sx={{ color: 'grey.900', ml: 'auto' }}
        >
          Create Organization
        </Button>
        <Dialog
          open={open}
          onClose={handleCreateOrganizationDialogClose}
          fullWidth
          maxWidth='xs'
        >
          <DialogTitle>Create Organization</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'grid', gap: 3, pt: 3 }}>
              <TextField
                label='Organization'
                value={organization}
                type='text'
                required={true}
                onChange={(e) => setOrganization(e.target.value)}
                size='small'
                fullWidth
              />
              <FormControl size='small' fullWidth variant='outlined'>
                <OutlinedInput
                  placeholder='domain.com'
                  value={domain}
                  type='text'
                  required={true}
                  endAdornment={
                    <InputAdornment position='end'>
                      <AddBoxRounded
                        fontSize='small'
                        color='primary'
                        aria-label='add new domain'
                        onClick={handleAddDomain}
                        className='cursor-pointer'
                      ></AddBoxRounded>
                    </InputAdornment>
                  }
                  onChange={(e) => setDomain(e.target.value)}
                />
              </FormControl>
              <Box>
                <Typography variant='body2' sx={{ mb: 1 }}>
                  Domains List:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {domainsList.map((domain, index) => {
                    return (
                      <Chip
                        label={domain}
                        variant='outlined'
                        key={domain + index}
                        onDelete={() => handleDomainDelete(index)}
                        sx={{ fontSize: '0.875rem' }}
                      />
                    );
                  })}
                  {domainsList.length === 0 && (
                    <small>
                      Add domains to{' '}
                      {organization.length > 0 ? organization : 'Organization'}
                    </small>
                  )}
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              variant='text'
              onClick={handleCreateOrganizationDialogClose}
            >
              Cancel
            </Button>
            <Button
              onClick={createOrganization}
              isLoading={creatingOrganization}
              disabled={
                organization.length < 2 ||
                domainsList.length < 1 ||
                creatingOrganization
              }
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Card>
        <CardContent>
          <Loader isLoading={creatingOrganization} />
          <Table size='small'>
            <TableHead sx={{ backgroundColor: 'grey.100' }}>
              <TableRow>
                <TableCell sx={{ color: 'primary.dark', fontWeight: '500' }}>
                  Id
                </TableCell>
                <TableCell sx={{ color: 'primary.dark', fontWeight: '500' }}>
                  Name
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoadingOrganizationList ? (
                <Loader isLoading={isLoadingOrganizationList} />
              ) : (
                organizationList?.map((row, index) => (
                  <TableRow
                    key={row.name}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell>
                      <Typography>{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{row.name}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {organizationList?.length === 0 && (
            <Typography variant='h6' sx={{ textAlign: 'center' }}>
              No Data
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
