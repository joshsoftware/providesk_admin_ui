import { createContext, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { IUserContextType } from 'modules/Auth/auth.types';
import { routeConfig } from 'routes/routeConfig';
import { GOOGLE_CLIENT_ID, LOCAL_STORAGE_KEYS } from 'shared/appConstants';
import { loadLocalStorage } from 'shared/localStorageHelpers';
import { ReactQueryDevtools } from 'react-query/devtools';
import { PaginationContextType } from 'shared/paginationContextType';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// User context is used to store user auth details
export const UserContext = createContext<IUserContextType>({
  userAuth: { message: '', auth_token: '', organizations: [], role: '' },
  userProfile: { name: '', email: '', picture: '' },
  setUserAuth: (value) => {},
});

export const PaginationContext = createContext<PaginationContextType>({
  rowsPerPage: 8,
  setRowsPerPage: (value) =>{}
})

const router = createBrowserRouter(routeConfig);

function App() {
  const [userAuth, setUserAuth] = useState<any>(
    loadLocalStorage(LOCAL_STORAGE_KEYS.USER_AUTH)
  );
  const [rowsPerPage , setRowsPerPage] = useState<any>(8)
  const userProfile = loadLocalStorage(LOCAL_STORAGE_KEYS.USER_PROFILE);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <UserContext.Provider value={{ userAuth, userProfile, setUserAuth }}>
          <PaginationContext.Provider value={{rowsPerPage, setRowsPerPage}}>
            <ToastContainer position='top-right' autoClose={5000} />
            <RouterProvider router={router} />
          </PaginationContext.Provider>
        </UserContext.Provider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
