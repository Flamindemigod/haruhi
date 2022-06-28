import React from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar } from '@mui/material'
import { useSelector, useDispatch } from "react-redux";
import {unsetUser} from "../features/user"
import { ButtonBase } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Logout from '@mui/icons-material/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import { styled, alpha } from '@mui/material/styles';

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

    const handleLogout = () =>{
        document.cookie=document.cookie+";max-age=0";
        dispatch(unsetUser());
    }
    const dispatch=useDispatch();
    let user = useSelector((state) => state.user.value);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <header className='flex justify-around dark:bg-offWhite-700 dark:text-white'>
                <nav className='grid grid-cols-3 gap-8 text-xl'>
                    <ButtonBase className=' h-full w-full'><NavLink className='' to={"/"}>Home</NavLink></ButtonBase>
                    <ButtonBase className='h-full w-full'><NavLink to={"/anime"} className='' >Lists</NavLink></ButtonBase>
                    <ButtonBase className='h-full w-full'><NavLink to={"/calender"} className='' >Calender</NavLink></ButtonBase>
                </nav>
                <div className="h-full p-4">
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