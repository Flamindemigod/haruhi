import React from 'react'
import Button from '@mui/material/Button';
import { ReactComponent as Logo } from '../assets/AnilistIcon.svg';
import "../assets/Login.css"
import getToken from "../misc/getToken";
import makeQuery from "../misc/makeQuery"
import { useDispatch } from 'react-redux';
import { setUser } from "../features/user";
import { setLoading } from "../features/loading";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  dispatch(setLoading(true))
  let user = useSelector((state) => state.user.value);
  
  const getUserDetails = async () => {
    var query = `query {
                    Viewer {
                        id
                        name
                        avatar{
                            medium
                        }}
                    }`;

    makeQuery(query).then((data) => {
      const user = data.data.Viewer;

      dispatch(setUser({
        userAuth: true,
        userName: user.name,
        userAvatar: user.avatar.medium,
        userToken: getToken()
      }));
    });
  };
  useEffect(() => {
    if (!user.userAuth) {
      const token = getToken();
      if (token) {
        getUserDetails();
      }
    }
  dispatch(setLoading(false))        

  }, []);
  
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