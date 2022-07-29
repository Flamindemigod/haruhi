import React, { useEffect, useState } from 'react';
import ContinueWatching from '../components/ContinueWatching';
import { useSelector } from 'react-redux';
import Recommended from '../components/Recommended';
import TrendingSeason from '../components/TrendingSeason';
import Activity from '../components/Activity';

const Home = () => {
  const user = useSelector((state) => state.user.value)
  const [isEmpty, setIsEmpty] = useState(null) 
  useEffect(()=>{
    document.title = "Haruhi - Home";}, [])
  return (
    <main>
      <div className='grid splashGrid'>
        <div className="text-3xl">Welcome Back {user.userName}</div>
        <div className=""></div>
        <img className="homeImg" height="60px" src='./HomeSplash.jpg' alt="a girl saluting you" />
        <div className={`activity ${isEmpty ? "empty": ""}`}>
          <Activity setIsEmpty={setIsEmpty}/>
        </div>
      </div>
      <div className=' w-11/12 containerHome'>
        <ContinueWatching></ContinueWatching>
        <Recommended></Recommended>
        <TrendingSeason></TrendingSeason>
        </div>
    </main>
  )
}

export default Home