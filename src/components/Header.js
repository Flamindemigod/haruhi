import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { unsetUser } from "../features/user"
import { ButtonBase } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchAnime from './SearchAnime';
import { SwipeableDrawer, List, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import {useMediaQuery} from '@mui/material';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        backgroundColor: "#2e2e2e",
        color:
            "#f22",
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: "#f22",
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));





const Header = () => {
    const matches = useMediaQuery('(min-width:425px)');

    const handleLogout = () => {
        document.cookie = document.cookie + ";max-age=0";
        dispatch(unsetUser());
    }
    const dispatch = useDispatch();
    let user = useSelector((state) => state.user.value);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setDrawerOpen(open);
    };



    const list = () => (
        <Box sx={{ width: 250 }}
            role="presentation">

            <List>
                <ListItem disablePadding>
                    <NavLink className='w-full' to={"/"}>
                        <ListItemButton>
                            <ListItemText primary={"Home"} />
                        </ListItemButton> 
                    </NavLink>
                </ListItem>
                <ListItem disablePadding>
                    <NavLink className='w-full' to={"/anime"}>
                        <ListItemButton>
                            <ListItemText primary={"Lists"} />
                        </ListItemButton> 
                    </NavLink>
                </ListItem>
                <ListItem disablePadding>
                    <NavLink className='w-full' to={"/calender"}>
                        <ListItemButton>
                            <ListItemText primary={"Calender"} />
                        </ListItemButton> 
                    </NavLink>
                </ListItem>
            </List>
        </Box>
    )
    return (
        <>
            <header className='flex justify-around dark:bg-offWhite-700 dark:text-white'>
            {!matches ? (<><IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon></MenuIcon>
            </IconButton>
                <SwipeableDrawer
                    anchor={"left"}
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    {list()}
                </SwipeableDrawer></>):
                (<nav className='grid grid-cols-3 gap-4 text-xl'>
                    <NavLink className='' to={"/"}><ButtonBase className=' h-full w-full'>Home</ButtonBase></NavLink>
                    <NavLink to={"/anime"} className='' ><ButtonBase className='h-full w-full'>Lists</ButtonBase></NavLink>
                    <NavLink to={"/calender"} className='' >  <ButtonBase className='h-full w-full'>Calender</ButtonBase></NavLink>
                </nav>)}
                <div className="h-full p-4 flex gap-4">
                    <SearchAnime />
                    <Avatar onClick={handleClick} alt={`Avatar of user ${user.userName}`} src={user.userAvatar} />
                </div>
            </header>
            <StyledMenu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}><ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                    Logout</MenuItem>
            </StyledMenu>
        </>
    )
}

export default Header