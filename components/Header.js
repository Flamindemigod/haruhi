import { useState } from "react";
import { Avatar, Box, Button, ButtonBase, IconButton, SwipeableDrawer, useMediaQuery, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem } from "@mui/material"
import { useSelector, useDispatch } from "react-redux"
import { AnilistClientID, SERVER } from "../config";
import Image from "next/image"
import Link from "next/link";
import { unsetUser } from "../features/user";
import { Menu as MenuIcon, Logout } from "@mui/icons-material";
import SearchButton from "./Header/Search";

const Header = () => {
    const matches = useMediaQuery('(min-width:640px)');
    const dispatch = useDispatch();
    const user = useSelector(state => state.user.value);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);
    const menuOpen = Boolean(menuAnchorEl);
    const handleLogout = () => {
        document.cookie = document.cookie + ";max-age=0";
        dispatch(unsetUser());
    }


    const handleClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setMenuAnchorEl(null);
    };
    return (
        <div className='w-full bg-offWhite-700 text-offWhite-100 h-16 flex px-8 flex-row items-center'>
            {matches ?
                <nav className="grid h-full" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <Link href="/"><a className="w-full h-full"><ButtonBase sx={{ p: "1rem" }} className="w-full h-full"><div className="text-xl">Home</div></ButtonBase></a></Link>
                    <Link href="/anime"><a className="w-full h-full"><ButtonBase sx={{ p: "1rem" }} className="w-full h-full"><div className="text-xl">Lists</div></ButtonBase></a></Link>
                    <Link href="/seasonal"><a className="w-full h-full"><ButtonBase sx={{ p: "1rem" }} className="w-full h-full p-4"><div className="text-xl">Seasonal</div></ButtonBase></a></Link >
                </nav > :
                (<>
                    <IconButton onClick={() => { setDrawerOpen(true) }}>
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer open={drawerOpen} onOpen={() => { setDrawerOpen(true) }} onClose={() => { setDrawerOpen(false) }}>
                        <Box sx={{ width: 250 }}
                            role="presentation">
                            <List onClick={() => { setDrawerOpen(false) }}>
                                <ListItem>
                                    <Link className='w-full' href={"/"}>
                                        <ListItemButton>
                                            <ListItemText primary={"Home"} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem >
                                    <Link className='w-full' href={"/anime"}>
                                        <ListItemButton>
                                            <ListItemText primary={"Lists"} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                                <ListItem >
                                    <Link className='w-full' href={"/seasonal"}>
                                        <ListItemButton>
                                            <ListItemText primary={"Seaonal"} />
                                        </ListItemButton>
                                    </Link>
                                </ListItem>
                            </List>
                        </Box>
                    </SwipeableDrawer>
                </>
                )
            }
            <Box className="flex gap-2 self-center ml-auto">
                <SearchButton />
                {user.userAuth ? (<div className="flex gap-4">
                    <a>
                        <IconButton className="cursor-pointer" onClick={handleClick}>
                            <Avatar alt={user.userName} draggable={false} src={user.userAvatar} />
                        </IconButton>
                    </a>
                    <Menu
                        id="basic-menu"
                        anchorEl={menuAnchorEl}
                        open={menuOpen}
                        onClose={handleClose}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    > <Link href="/prefrences">
                            <a>
                                <MenuItem
                                    onClick={() => {
                                        handleClose();
                                    }}>

                                    <div className="text-offWhite-100 no-underline">Prefrences</div>
                                </MenuItem>
                            </a>
                        </Link>
                        <a href='#'>
                            <MenuItem sx={{ color: "#f22", }} onClick={handleLogout}>
                                <Logout fontSize="small" /> Logout
                            </MenuItem>
                        </a>
                    </Menu>
                </div>) : (<div>
                    <Button
                        variant="contained"
                        color="primary"
                        href={`https://anilist.co/api/v2/oauth/authorize?client_id=${AnilistClientID}&response_type=token`} className="w-full"><Image src={`${SERVER}/AnilistIcon.svg`} width={37} height={37} /> Login With Anilist</Button></div>)
                }
            </Box >
        </div >
    )
}

export default Header