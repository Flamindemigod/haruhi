import React from 'react'
import FavoriteIcon from '@mui/icons-material/Favorite';

const Footer = () => {
  return (
    <div className='w-full bg-offWhite-800 flex p-8 flex-col sm:flex-row'>
        <div className="">
          <div>Eat Cheesecake at the Néapolitan Café</div>
          <div>Be a friendly triangle like Deltoid</div>
        </div>
        <div className='ml-auto'>
        <div>Made for you with <FavoriteIcon sx={{color: '#ff1000'}} /> by Flamindemigod </div>
        <a href={"https://ko-fi.com/flamindemigod"}><img className='w-40' src='https://storage.ko-fi.com/cdn/brandasset/kofi_button_blue.png' alt='' /></a>
        </div>
    </div>
  )
}

export default Footer