import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';

import Loader from './components/Loader';
import { userProfileType } from './auth.types';
import { useLogin } from './login.hooks';
import { saveToLocalStorage } from 'shared/localStorageHelpers';
import ROUTE from 'routes/constants';
import { LOCAL_STORAGE_KEYS } from 'shared/appConstants';
import { UserContext } from 'App';
import { ROLES } from 'routes/roleConstants';

import { Box, Card, CardContent, Typography } from '@mui/material';
import './auth.scss';

const AuthContainer = () => {
  const { mutate, isLoading: isLogging } = useLogin();
  const navigate = useNavigate();
  const { setUserAuth, userAuth } = useContext(UserContext);

  const onGoogleLoginSuccess = (credentialResponse) => {
    const { email, name, picture }: userProfileType =
      jwt_decode(credentialResponse.credential) || {};
    // save the google auth data to localstorage
    saveToLocalStorage(LOCAL_STORAGE_KEYS.USER_PROFILE, {
      email,
      name,
      picture,
    });
    let payload = {
      user: {
        name: 'sethu',
        email: 'sethu@joshsoftware.com',
      },
    };
    // make login api call with user data
    mutate(payload, {
      onSuccess: (response) => {
        // update user auth data for userContext
        setUserAuth(response.data.data);
        saveToLocalStorage(LOCAL_STORAGE_KEYS.USER_AUTH, response.data.data);
      },
      onError: (error) => {},
    });
  };

  // useEffect to navigate on successfull login
  useEffect(() => {
    if (userAuth?.auth_token) {
      if (userAuth?.role === ROLES.SUPER_ADMIN) {
        navigate(ROUTE.ORGANIZATION);
      } else {
        navigate(ROUTE.DASHBOARD);
      }
    }
  }, [navigate, userAuth]);

  const onGoogleLoginFailure = () => {
    toast.error('Login failed.');
  };

  const Heading = () => {
    return (
      <Box display={'grid'} gap={1} textAlign={'center'}>
        <Typography m={0} fontSize={20}>
          Welcome to
        </Typography>
        <img src='/images/providesk-logo.svg' alt='ProviDesk' height={28} />
      </Box>
    );
  };

  return (
    <>
      <Loader isLoading={isLogging} top='0' />
      <Box
        bgcolor={'#DEEBF1'}
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        justifyContent={'center'}
        alignItems={'center'}
        p={3}
        className='scroll-auto'
      >
        <Card
          sx={{
            display: 'flex',
            m: '0 auto',
            borderRadius: 3,
          }}
        >
          <CardContent
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: '1',
              gap: 3,
              '@media (max-width: 575.98px)': {
                flexDirection: 'column',
              },
            }}
          >
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              bgcolor={'#b1c6d7'}
              height={'100%'}
              p={3}
              borderRadius={2}
              overflow={'hidden'}
            >
              <img src='./images/auth.svg' alt='Login' className='img-auth' />
            </Box>
            <Box
              display={'flex'}
              flexDirection={'column'}
              alignItems={'center'}
              justifyContent={'center'}
              gap={4}
              p={3}
              sx={{
                '@media (max-width: 575.98px)': {
                  p: 0,
                  gap: 3,
                },
              }}
            >
              <Heading />
              <GoogleLogin
                onSuccess={onGoogleLoginSuccess}
                onError={onGoogleLoginFailure}
                theme='filled_blue'
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default AuthContainer;
