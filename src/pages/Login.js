import React from 'react'
import Button from '@mui/material/Button';
import { ReactComponent as Logo } from '../assets/AnilistIcon.svg';
import "../assets/Login.css"


const Login = () => {
  
  
  return (
    <div className='fullscreen fixed inset-0 flex flex-col justify-center items-center text-black drop-shadow-md object-cover'>
      <div className="container p-8 flex flex-col gap-4 justify-center items-center bg-neutral-100 shadow-xl text-center">
        <h1 className="text-2xl font-semibold">Meet Haruhi</h1>
              <p className="text-md">A React based Anime Streaming site with Anilist intergration</p>
              <Button variant="contained" color="primary" startIcon={<Logo height="2rem" width="2rem" />} href={`https://anilist.co/api/v2/oauth/authorize?client_id=8343&response_type=token`}>Login with AniList</Button>
      </div>
    </div>
    
  )
}

export default Login