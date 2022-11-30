import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import { useCreateOrganization } from './organization.hook';
import { Button } from 'modules/shared/Button';
import Loader from 'modules/Auth/components/Loader';

import {
  Box,
  Chip,
  Divider,
  FormControl,
  Input,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';

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
    }
  }, [organization, domainsList]);

  return (
    <>
      <div
        style={{
          margin: '3rem 0',
          display: 'flex',
          height: '80vh',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Loader isLoading={creatingOrganization} />
        <Box
          style={{
            border: '1px solid #dddddd',
            borderRadius: '0.3rem',
            padding: '2rem',
          }}
        >
          <Typography variant='h5' component='div' sx={{ textAlign: 'center' }}>
            Create Organization
          </Typography>

          <div
            style={{
              margin: '1rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              sx={{ m: 2, width: 240 }}
              label='Organization'
              value={organization}
              type='text'
              required={true}
              variant='standard'
              onChange={(e) => setOrganization(e.target.value)}
            />
            <div
              style={{ width: '100%', margin: '0 0.5rem', padding: '0.5rem' }}
            >
              <Typography>Domains List: </Typography>
              <FormControl sx={{ width: '100%' }} variant='standard'>
                <Paper
                  sx={{ p: 2, width: '100%' }}
                  style={{ margin: '1rem 0' }}
                >
                  {domainsList.map((domain, index) => {
                    return (
                      <Chip
                        sx={{ m: 2 }}
                        label={domain}
                        variant='outlined'
                        key={domain + index}
                        onDelete={() => handleDomainDelete(index)}
                      />
                    );
                  })}
                  {domainsList.length === 0 && (
                    <small>
                      Add domains to{' '}
                      {organization.length > 0 ? organization : 'Organization'}
                    </small>
                  )}
                </Paper>
                <Input
                  sx={{ margin: '1rem 0' }}
                  placeholder='domain.com'
                  value={domain}
                  type='text'
                  required={true}
                  endAdornment={
                    <InputAdornment position='end'>
                      <AddBoxIcon
                        fontSize='large'
                        color='primary'
                        aria-label='add new domain'
                        onClick={handleAddDomain}
                      ></AddBoxIcon>
                    </InputAdornment>
                  }
                  onChange={(e) => setDomain(e.target.value)}
                />
              </FormControl>
            </div>

            <Button
              onClick={createOrganization}
              isLoading={creatingOrganization}
              style={{ height: '40px', margin: '1rem 0' }}
              disabled={
                organization.length < 2 ||
                domainsList.length < 1 ||
                creatingOrganization
              }
            >
              Create
            </Button>
          </div>
        </Box>
        <br />
      </div>
    </>
  );
};
