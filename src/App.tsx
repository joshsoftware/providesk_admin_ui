import { createContext, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from 'theme';
import { ToastContainer } from 'react-toastify';

import { IUserContextType } from 'modules/Auth/auth.types';
import { routeConfig } from 'routes/routeConfig';
import { GOOGLE_CLIENT_ID, LOCAL_STORAGE_KEYS } from 'shared/appConstants';
import { loadLocalStorage } from 'shared/localStorageHelpers';

import './App.css';

import { ReactQueryDevtools } from 'react-query/devtools';

// Create a client
const queryClient = new QueryClient();

// User context is used to store user auth details
export const UserContext = createContext<IUserContextType>({
  userAuth: { message: '', auth_token: '', organizations: [], role: '' },
  userProfile: { name: '', email: '', picture: '' },
  setUserAuth: (value) => {},
});

const router = createBrowserRouter(routeConfig);

function App() {
  const [userAuth, setUserAuth] = useState<any>(
    loadLocalStorage(LOCAL_STORAGE_KEYS.USER_AUTH)
  );

  const userProfile = loadLocalStorage(LOCAL_STORAGE_KEYS.USER_PROFILE);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ userAuth, userProfile, setUserAuth }}>
          <ThemeProvider theme={theme}>
            <ToastContainer position='top-right' autoClose={5000} />
            <RouterProvider router={router} />
          </ThemeProvider>
        </UserContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
