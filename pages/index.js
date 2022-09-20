import { Box } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Activity from "../components/Home/Activity";
import CurrentlyWatching from "../components/Home/CurrentlyWatching";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import TrendingSeason from "../components/Home/TrendingSeason";
import Meta from '../components/Meta'
import { SERVER } from "../config";

export default function Home({ token = "" }) {
  const user = useSelector(state => state.user.value)
  const [height, setHeight] = useState(4000);

  useEffect(() => {
    setHeight(window.screen.height);
  }, [])
  return (
    <>
      <Meta />
      <section className="w-full">
        <Box className="relative grid isolate" sx={{ gridTemplateColumns: "1fr 1fr", height: height * 0.6 }}>
          <Box className="" sx={{ gridColumn: "1/-1", gridRow: "1 / -1" }} >
            <Image layout="fill" className="object-cover" src={`${SERVER}/haruhiHomeBg.webp`} />
            <a className="absolute -bottom-5 right-0 text-white no-underline hover:underline underline-offset-2" href="https://twitter.com/sakura_tsubame/"><p>Sakura Tsubame</p></a>
          </Box>
          <Box className="activity | overflow-y-scroll">{user.userAuth && <Activity />}</Box>
        </Box>
        {user.userAuth && <CurrentlyWatching />}
        {user.userAuth && <Recommended />}
        <TrendingSeason />
        <Trending />
      </section>
    </>
  )
}

