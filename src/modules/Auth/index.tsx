import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

import Login from 'assets/svg/Login.svg';
import Loader from './components/Loader';

import { userProfileType } from './auth.types';
import { useLogin } from 'hooks/login.hooks';
import { saveToLocalStorage } from 'shared/localStorageHelpers';
import ROUTE from 'routes/constants';
import { LOCAL_STORAGE_KEYS } from 'shared/appConstants';
import { useContext, useEffect } from 'react';
import { UserContext } from 'App';
import { Header } from 'modules/shared/Header';

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
        email: email,
        name: name,
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
      navigate(ROUTE.DASHBOARD);
    }
  }, [navigate, userAuth]);

  const onGoogleLoginFailure = () => {};

  return (
    <div
      className='d-flex flex-column justify-content-center align-items-center'
      style={{ height: '95vh', overflow: 'hidden' }}
    >
      <Header />
      <Loader isLoading={isLogging} />
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <h1 className='m-3'>Welcome to Providesk!</h1>
        <div className='m-3'>
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginFailure}
            theme='filled_blue'
            size='large'
            shape='pill'
          />
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <img
          style={{
            border: '1px solid #9e9e9e7a',
            borderRadius: '3px',
            padding: '1rem',
            maxHeight: '20rem',
          }}
          src={Login}
          alt='Login'
        ></img>
      </div>
    </div>
  );
};

export default AuthContainer;
