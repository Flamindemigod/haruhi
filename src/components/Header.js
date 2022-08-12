import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Avatar, Dialog, DialogContent, DialogTitle, FormControl, ListItem, ListItemButton, ListItemText, Slider, Typography, Select, Switch } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import { unsetUser } from "../features/user"
import { ButtonBase } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuIcon from '@mui/icons-material/Menu';
import Search from './Search';
import { SwipeableDrawer, List, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { useMediaQuery } from '@mui/material';
import { setUser } from '../features/user';

const Header = () => {
    const matches = useMediaQuery('(min-width:600px)');

    const handleLogout = () => {
        document.cookie = document.cookie + ";max-age=0";
        dispatch(unsetUser());
    }
    const dispatch = useDispatch();
    let user = useSelector((state) => state.user.value);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);


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
            <List onClick={toggleDrawer(false)}>
                <ListItem>
                    <NavLink className='w-full' to={"/"}>
                        <ListItemButton>
                            <ListItemText primary={"Home"} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem >
                    <NavLink className='w-full' to={"/anime"}>
                        <ListItemButton>
                            <ListItemText primary={"Lists"} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem >
                    <NavLink className='w-full' to={"/seasonal"}>
                        <ListItemButton>
                            <ListItemText primary={"Seaonal"} />
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
                    </SwipeableDrawer></>) :
                    (<nav className='flex gap-4 text-xl w-3/12 px-14' style={{ flexBasis: "100%" }}>
                        <NavLink className='w-24' to={"/"}><ButtonBase className='px-4 h-full w-full'>Home</ButtonBase></NavLink>
                        <NavLink to={"/anime"} className='w-24' ><ButtonBase className=' px-4 h-full w-full'>Lists</ButtonBase></NavLink>
                        <NavLink to={"/seasonal"} className='w-24' >  <ButtonBase className=' px-4 h-full w-full'>Seasonal</ButtonBase></NavLink>
                    </nav>)}
                <div className="h-full p-4 flex gap-4">
                    <Search />
                    <Avatar onClick={handleClick} alt={`Avatar of user ${user.userName}`} src={user.userAvatar} />
                </div>
            </header>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        setDialogOpen(true)
                    }}>
                    Prefrences
                </MenuItem>
                <MenuItem sx={{ color: "#f22", }} onClick={handleLogout}><ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                    Logout</MenuItem>

            </Menu>
            <Dialog open={dialogOpen} onClose={() => { setDialogOpen(false) }}>
                <DialogTitle> User Prefrences </DialogTitle>
                <DialogContent>
                    <Box className='grid grid-cols-2 p-8 text-left justify-end gap-4 sm:gap-16 gap-y-2' sx={{ gridTemplateColumns: "2fr 1fr" }}>
                        <Typography className='w-full'>Episode Update Treshold</Typography>
                        <FormControl className="">
                            <Slider valueLabelDisplay="auto" value={user.userPreferenceEpisodeUpdateTreshold * 100} onChange={(e) => { dispatch(setUser({ userPreferenceEpisodeUpdateTreshold: parseInt(e.target.value) / 100 })) }}></Slider>
                        </FormControl>
                        <div className='w-full'>
                            <Typography className=''>Opening Skip Time</Typography>
                            <div className='w-full text-sm'>Setting to 0 removes Button</div>
                        </div>
                        <FormControl className="">
                            <Select
                                value={user.userPreferenceSkipOpening}
                                onChange={(e) => { dispatch(setUser({ userPreferenceSkipOpening: parseInt(e.target.value) })) }}
                                MenuProps={{
                                    PaperProps: {
                                        className: "styled-scrollbars",
                                        style: {
                                            width: 100,
                                        },
                                    },
                                    disableScrollLock: true,
                                }}>
                                <MenuItem value={0}>0</MenuItem>
                                <MenuItem value={80}>80</MenuItem>
                                <MenuItem value={85}>85</MenuItem>
                                <MenuItem value={90}>90</MenuItem>

                            </Select>
                        </FormControl>
                        <div className='w-full'>
                            <Typography className=''>Prefer Dubbed</Typography>
                            <div className='w-full text-sm'>Default To Dubbed if Available</div>
                        </div>
                        <FormControl>
                            <Switch checked={user.userPreferenceDubbed} onChange={()=>{dispatch(setUser({userPreferenceDubbed: !user.userPreferenceDubbed}))}}></Switch>
                        </FormControl>
                        <div className='w-full'>
                            <Typography className=''>Show End Rating Dialog</Typography>
                            <div className='w-full text-sm'>Presents user with a prompt to rate show after finishing all episodes of it</div>
                        </div>
                        <FormControl>
                            <Switch checked={user.userPreferenceShowEndDialog} onChange={()=>{dispatch(setUser({userPreferenceShowEndDialog: !user.userPreferenceShowEndDialog}))}}></Switch>
                        </FormControl>

                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default Header