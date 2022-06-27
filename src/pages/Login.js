import React from 'react'
import Button from '@mui/material/Button';
import { ReactComponent as Logo } from '../assets/AnilistIcon.svg';
import "../assets/Login.css"
import getToken from "../misc/getToken";
import makeQuery from "../misc/makeQuery"
import { useDispatch } from 'react-redux';
import { setUser } from "../features/user";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux"

const Login = () => {
  let [_user, _setUser] = useState({});
  let user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
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

      _setUser({
        userAuth: true,
        userName: user.name,
        userAvatar: user.avatar.medium
      });
    });
  };
  useEffect(() => {
    if (!user.userAuth) {
      const token = getToken();
      if (token) {
        getUserDetails();
      }
    }
  }, []);
  useEffect(() => {
    dispatch(setUser(_user))
    
  }, [_user])
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