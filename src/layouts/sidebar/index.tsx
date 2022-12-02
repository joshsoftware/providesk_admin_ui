import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import ROUTE from 'routes/constants';
import { UserContext } from 'App';
import { LOCAL_STORAGE_KEYS } from 'shared/appConstants';
import { removeLocalStorageState } from 'shared/localStorageHelpers';
import { getSidebarConfig } from './sidebarConfig';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Menu, Close } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';

import { DropMenu } from './DropDown';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Sidebar() {
  const userContext = useContext(UserContext);
  const role = userContext?.userAuth?.role;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>(window.location.pathname);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const onLogout = () => {
    removeLocalStorageState(LOCAL_STORAGE_KEYS.USER_AUTH);
    window.location.href = ROUTE.LOGIN;
  };

  const sidebarConfig = getSidebarConfig(role);
  const navigate = useNavigate()
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position='static' open={open} sx={{ zIndex: '1', backgroundColor: 'primary.light', color: 'black', boxShadow: 'none' }}>
        <Toolbar sx={{ gap: '1rem' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.5rem', mr: 'auto' }}>
            <IconButton
              aria-label='open drawer'
              onClick={open ? handleDrawerClose : handleDrawerOpen}
              edge='start'
              sx={{ color: 'common.black', ml: 0 }}
            >
              {open ? <Close sx={{ fontSize: '1.5rem' }} /> : <Menu sx={{ fontSize: '1.5rem' }} />}
            </IconButton>
            <Typography variant='h6' noWrap onClick={() => navigate(ROUTE.HOME)} sx={{ cursor: "pointer" }}>
              ProviDesk
            </Typography>
          </Box>
          <DropMenu logout={onLogout} />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader sx={{ backgroundColor: 'primary.light', justifyContent: 'center' }}></DrawerHeader>
        <List sx={{ py: '1.5rem' }}>
          {sidebarConfig.map((ele) => (
            <Link
              to={ele?.path}
              style={{ textDecoration: 'none', color: 'gray' }}
              key={ele?.label}
              onClick={() => {
                setActive(ele?.path);
                handleDrawerClose();
              }}
            >
              <ListItem
                sx={{
                  backgroundColor:
                    active === ele.path ? 'grey.200' : 'common.white',
                }}
                disablePadding
              >
                <ListItemButton sx={{ gap: '1rem' }}>
                  <ListItemIcon sx={{ minWidth: 'unset', color: active === ele.path ? 'primary.main' : '' }}>
                    {ele?.icon}
                  </ListItemIcon>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: '600', color: active === ele.path ? 'grey.900' : 'grey.700' }}>
                    {ele?.label}
                  </Typography>
                </ListItemButton>
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}