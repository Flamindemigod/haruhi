import React, { useEffect, useState } from 'react';
import ContinueWatching from '../components/ContinueWatching';
import { useSelector } from 'react-redux';
import Recommended from '../components/Recommended';
import TrendingSeason from '../components/TrendingSeason';
import Activity from '../components/Activity';
import {Helmet} from "react-helmet";


const Home = () => {
  const user = useSelector((state) => state.user.value)
  const [isEmpty, setIsEmpty] = useState(null) 
 
  return (
    <main>
      <Helmet>
                <title>Haruhi - Home</title>
                <meta name='og:title' content='Haruhi' />
                <meta name='og:description' content='A React Based anime streaming Site made for you by Flamindemigod' />
                <meta name='description' content='A React Based anime streaming Site made for you by Flamindemigod' />

      </Helmet>
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