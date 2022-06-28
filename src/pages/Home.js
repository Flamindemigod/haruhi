import React from 'react';
import "../assets/Home.css";
import ContinueWatching from '../components/ContinueWatching';
import { useSelector } from 'react-redux';
import Recommended from '../components/Recommended';


const Home = () => {
  const user = useSelector((state) => state.user.value)
  return (
    <main>
      <div className='grid splashGrid'>
        <div className="text-3xl">Welcome Back {user.userName}</div>
        <div className=""></div>
        <img className="homeImg" height="60px" src='./HomeSplash.jpg' />
      </div>
      <div className=' w-11/12 containerHome'>
        <ContinueWatching></ContinueWatching>
        <Recommended></Recommended>
        </div>
    </main>
  )
}

export default Home