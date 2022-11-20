import { Box } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Activity from "../components/Home/Activity";
import CurrentlyWatching from "../components/Home/CurrentlyWatching";
import Recommended from "../components/Home/Recommended";
import Trending from "../components/Home/Trending";
import TrendingSeason from "../components/Home/TrendingSeason";
import Meta from "../components/Meta";
import { SERVER } from "../config";
import { setLoading } from "../features/loading";
import getCurrentSeason from "../getCurrentSeason";
import makeQuery from "../makeQuery";
import * as cookie from "cookie";

export default function Home({ trendingData, trendingSeasonData }) {
  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();
  const [height, setHeight] = useState(4000);

  useEffect(() => {
    dispatch(setLoading(false));
    setHeight(window.screen.height);
  }, []);
  return (
    <>
      <Meta />
      <section className="w-full">
        <Box
          className="relative grid isolate"
          sx={{ gridTemplateColumns: "1fr 1fr", height: height * 0.6 }}
        >
          <Box className="" sx={{ gridColumn: "1/-1", gridRow: "1 / -1" }}>
            <Image
              layout="fill"
              className="object-cover"
              src={`${SERVER}/haruhiHomeBg.webp`}
              alt={"Haruhi Art made by Sakura Tsubame"}
            />
            <a
              className="absolute -bottom-5 right-0 text-white no-underline hover:underline underline-offset-2"
              href="https://twitter.com/sakura_tsubame/"
            >
              <p>Made by Sakura Tsubame</p>
            </a>
          </Box>
          <Box className="activity | overflow-y-auto">
            {user.userAuth && (
              <>
                <a
                  className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white"
                  href="#currentlyWatching"
                >
                  Skip to Currently Watching
                </a>
                <Activity />
              </>
            )}
          </Box>
        </Box>
        {user.userAuth && (
          <section id="currentlyWatching">
            <a
              className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white"
              href="#recommended"
            >
              Skip to Recommended for you
            </a>
            <CurrentlyWatching />
          </section>
        )}
        {user.userAuth && (
          <section id="recommended">
            <a
              className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white"
              href="#trendingSeason"
            >
              Skip to Trending This Season
            </a>

            <Recommended />
          </section>
        )}
        <section id="trendingSeason">
          <a
            className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white"
            href="#trending"
          >
            Skip to Trending
          </a>

          <TrendingSeason data={trendingSeasonData} />
        </section>
        <section id="trending">
          <a
            className="navigation--link | fixed top-0 left-0 right-0 p-4 text-center bg-black text-white"
            href="#footer"
          >
            Skip to Footer
          </a>

          <Trending data={trendingData} />
        </section>
      </section>
    </>
  );
}

export async function getServerSideProps({ params, req }) {
  var queryTrending = `query getMediaTrend {
    Page(perPage: 20){
      pageInfo{
        hasNextPage
      }
      media(sort:[POPULARITY_DESC], type:ANIME) {
        id
        title{
          userPreferred
        }
        episodes
        status
        coverImage{
          large
        }
        mediaListEntry{
          progress
          status
        }
        airingSchedule {
          edges {
            node {
              airingAt
              timeUntilAiring
              episode
            }
          }
        }
      }
    }
    }`;

  var queryTrendingSeason = `query getMediaTrend($season: MediaSeason, $seasonYear: Int) {
      Page(perPage: 20){
        pageInfo{
          hasNextPage
        }
        media(sort:[POPULARITY_DESC], season: $season, seasonYear: $seasonYear, type:ANIME) {
          id
          title{
            userPreferred
          }
          episodes
          status
          coverImage{
            large
          }
          mediaListEntry{
            progress
            status
          }
          airingSchedule {
            edges {
              node {
                airingAt
                timeUntilAiring
                episode
              }
            }
          }
        }
      }
      }`;

  let season = null;
  let seasonYear = null;
  [season, seasonYear] = getCurrentSeason();

  var variablesTrendingSeason = {
    season,
    seasonYear,
    page: 1,
  };

  const getAiring = (media) => {
    const airingSchedule = media.airingSchedule;
    delete media.airingSchedule;
    const nextAiringIndex = airingSchedule.edges.findIndex(
      (element) => element.node.timeUntilAiring > 0
    );
    media["nextAiring"] = airingSchedule.edges[nextAiringIndex]
      ? airingSchedule.edges[nextAiringIndex]
      : null;
    return media;
  };
  let airingArrayAccumalated = [];
  let data = await makeQuery(
    queryTrending,
    {},
    req.headers.cookie ? cookie.parse(req.headers.cookie).access_token : null
  );
  for (const media in data.data.Page.media) {
    data.data.Page.media[media] = getAiring(data.data.Page.media[media]);
  }
  airingArrayAccumalated = airingArrayAccumalated.concat(data.data.Page.media);
  const trendingData = airingArrayAccumalated;
  airingArrayAccumalated = [];
  data = await makeQuery(
    queryTrendingSeason,
    variablesTrendingSeason,
    req.headers.cookie ? cookie.parse(req.headers.cookie).access_token : null
  );
  for (const media in data.data.Page.media) {
    data.data.Page.media[media] = getAiring(data.data.Page.media[media]);
  }
  airingArrayAccumalated = airingArrayAccumalated.concat(data.data.Page.media);
  const trendingSeasonData = airingArrayAccumalated;
  return {
    props: { trendingData, trendingSeasonData },
  };
}
