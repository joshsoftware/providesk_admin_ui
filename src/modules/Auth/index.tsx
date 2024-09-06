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

import { Box, Typography } from '@mui/material';
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
        name,
        email,
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
      <Typography
        variant='h2'
        sx={{ textAlign: 'center' }}
        className='auth-heading'
      >
        Welcome to Providesk!
      </Typography>
    );
  };

  return (
    <>
      <Loader isLoading={isLogging} top='0' />
      <Box sx={{ display: 'grid', flex: '1' }} className='scroll-auto'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1',
          }}
          className='auth-wrapper'
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
            }}
            className='img-box'
          >
            <Heading />
            <img src='./images/auth.svg' alt='Login' className='img-auth' />
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
            }}
            className='auth-box'
          >
            <Heading />
            <GoogleLogin
              onSuccess={onGoogleLoginSuccess}
              onError={onGoogleLoginFailure}
              theme='filled_blue'
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AuthContainer;
