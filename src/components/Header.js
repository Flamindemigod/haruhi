import React from 'react'
import { NavLink } from 'react-router-dom'
import { Avatar } from '@mui/material'
import { useSelector } from "react-redux"
import { ButtonBase } from '@mui/material';
const Header = () => {
    let user = useSelector((state) => state.user.value);

    return (
        <header className='flex justify-around dark:bg-offWhite-700 dark:text-white'>
            <nav className='grid grid-cols-3 gap-8 text-xl'>
                <ButtonBase className=' h-full w-full'><NavLink className='' to={"/"}>Home</NavLink></ButtonBase>
                <ButtonBase className='h-full w-full'><NavLink to={"/anime"} className='' >Lists</NavLink></ButtonBase>
                <ButtonBase className='h-full w-full'><NavLink to={"/calender"} className='' >Calender</NavLink></ButtonBase>
            </nav>
            <div className="h-full p-4">
                <Avatar alt={`Avatar of user ${user.userName}`} src={user.userAvatar} />
            </div>
        </header>
    )
}

export default Header