import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <div className='w-full bg-offWhite-800 flex p-8 justify-end'>
        <div className="">Made for you with <FavoriteIcon sx={{color: '#ff1000'}} /> by Flamindemigod </div>
    </div>
  )
}

export default Footer