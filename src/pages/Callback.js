import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from "../features/loading";


const Callback = () => {
  const dispatch = useDispatch();
  useEffect(()=>{dispatch(setLoading(true));
  let hash = window.location.hash.substr(1);
  // Looping through it and making an array
  let result = hash.split("&").reduce(function (res, item) {
    let parts = item.split("=");
    res[parts[0]] = parts[1];
    return res;
  }, {});

  // Storing access_token and expires_in to variables (We got these from the URL fragment)
  let access_token = result["access_token"],
      expires_in = result["expires_in"]

  const d = new Date();
  d.setTime(d.getTime() + expires_in*1000);
  document.cookie = "access_token=" + access_token + ";expires=" + d.toUTCString() + ";path=/" 
  
  dispatch(setLoading(false));

  //Redirect To home
  window.location.replace("/")}, [])
  return (
    <></>
  )
}

export default Callback