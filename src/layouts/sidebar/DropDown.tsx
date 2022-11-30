import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useContext, useState } from "react";

import { UserContext } from "App";



export const DropMenu = ({logout})=>{
    const userContext = useContext(UserContext);
    const profile = userContext?.userProfile;
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };
    return (<div>
      <IconButton
        id="demo-positioned-button"
        aria-controls={open ? 'demo-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar>{profile.name.toLocaleUpperCase().charAt(0)}</Avatar>
      </IconButton>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={handleClose}>{profile.name}</MenuItem>
        <MenuItem onClick={logout}>Logout  </MenuItem>
       
      </Menu>
    </div>)
    
    
} 