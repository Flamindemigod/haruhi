import { Box } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Activity from "../components/Home/Activity";
import CurrentlyWatching from "../components/Home/CurrentlyWatching";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import TrendingSeason from "../components/Home/TrendingSeason";
import Meta from '../components/Meta'
import { SERVER } from "../config";
import { setLoading } from "../features/loading";

export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();
  const [height, setHeight] = useState(4000);

  useEffect(() => {
    dispatch(setLoading(false))
    setHeight(window.screen.height);
  }, [])
  return (
    <>
      <Meta />
      <section className="w-full">
        <Box className="relative grid isolate" sx={{ gridTemplateColumns: "1fr 1fr", height: height * 0.6 }}>
          <Box className="" sx={{ gridColumn: "1/-1", gridRow: "1 / -1" }} >
            <Image layout="fill" className="object-cover" src={`${SERVER}/haruhiHomeBg.webp`} alt={"Haruhi Art made by Sakura Tsubame"} />
            <a className="absolute -bottom-5 right-0 text-white no-underline hover:underline underline-offset-2" href="https://twitter.com/sakura_tsubame/"><p>Made by Sakura Tsubame</p></a>
          </Box>
          <Box className="activity | overflow-y-auto">{user.userAuth && <>
            <a className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white" href="#currentlyWatching">Skip to Currently Watching</a>
            <Activity /></>}</Box>
        </Box>
        {user.userAuth && <section id="currentlyWatching">
          <a className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white" href="#recommended">Skip to Recommended for you</a>
          <CurrentlyWatching />
        </section>}
        {user.userAuth && <section id="recommended">
          <a className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white" href="#trendingSeason">Skip to Trending This Season</a>

          <Recommended />
        </section>}
        <section id="trendingSeason">
          <a className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white" href="#trending">Skip to Trending</a>

          <TrendingSeason />
        </section>
        <section id="trending">
          <a className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white" href="#footer">Skip to Footer</a>

          <Trending />
        </section>
      </section>
    </>
  )
}

