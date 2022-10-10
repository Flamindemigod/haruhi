import { useEffect, useRef, useState } from "react";
import makeQuery from "../../makeQuery";
import Card from "../Card";
import { Box, useMediaQuery } from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

const List = ({ season, seasonYear }) => {
  const user = useSelector((state) => state.user.value);
  const [seasonalAnime, setSeasonalAnime] = useState([]);
  const hasHover = useMediaQuery("(hover:hover)");
  const [gridColumnCount, setGridColumnCount] = useState(1);
  const grid = useRef();

  useEffect(() => {
    const handleResize = () => {
      const gridComputedStyle = window.getComputedStyle(grid.current);
      // get number of grid columns
      const _gridColumnCount = gridComputedStyle
        .getPropertyValue("grid-template-columns")
        .split(" ").length;
      setGridColumnCount(_gridColumnCount);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const getSeasonal = async () => {
      const query = `query getSeasonal($season: MediaSeason, $seasonYear: Int, $page:Int=1, $isAdult: Boolean) {
        Page(page:$page, perPage:50) {
          pageInfo {
            hasNextPage
          }
          media(season: $season, seasonYear: $seasonYear, type:ANIME, sort: [POPULARITY_DESC], isAdult: $isAdult) {
            id
            title {
              userPreferred
            }
            coverImage{
              large
            }
            episodes
            startDate{
              year
            }
            airingSchedule{
              edges{
                node{
                  episode
                  timeUntilAiring
                }
              }
              
            }
            mediaListEntry{
              progress
              status
            }
          }
        }
      }`;
      let variables = {
        season,
        seasonYear,
        page: 1,
      };
      if (!user.userAuth) {
        variables["isAdult"] = false;
      }
      let hasNextPage = true;
      let accumalatedMedia = [];
      const getAiring = (media) => {
        const airingSchedule = media.airingSchedule;
        delete media.airingSchedule;
        const nextAiringIndex = airingSchedule.edges.findIndex(
          (element) => element.node.timeUntilAiring > 0
        );
        media["nextAiring"] = airingSchedule.edges[nextAiringIndex];
        return media;
      };
      while (hasNextPage) {
        const data = await makeQuery(query, variables);
        if (!data) return null;
        if (data.data.Page.pageInfo.hasNextPage) {
          variables["page"] += 1;
        } else {
          hasNextPage = false;
        }
        accumalatedMedia = accumalatedMedia.concat(data.data.Page.media);
      }
      for (const media in accumalatedMedia) {
        accumalatedMedia[media] = getAiring(accumalatedMedia[media]);
      }
      setSeasonalAnime(accumalatedMedia);
    };
    getSeasonal();
  }, [season, seasonYear]);
  return (
    <>
      <Box
        ref={grid}
        className={`mt-4 grid justify-center gap-4 w-max ${
          hasHover
            ? "grid-cols-1 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 2xl:grid-cols-10 3xl:grid-cols-12"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        <AnimatePresence>
          {seasonalAnime.map((el, index) => (
            <Card
              key={el.id}
              width={128}
              height={168}
              image={el.coverImage.large}
              title={el.title.userPreferred}
              link={`/anime/${el.id}`}
              status={el.status}
              changeDirection={
                index % gridColumnCount >= gridColumnCount - 2 && index > 2
                  ? true
                  : false
              }
              episodes={el.episodes}
              nextAiringEpisode={el.nextAiring && el.nextAiring.node.episode}
              nextAiringTime={
                el.nextAiring && el.nextAiring.node.timeUntilAiring
              }
              progress={el.mediaListEntry && el.mediaListEntry.progress}
              listStatus={el.mediaListEntry && el.mediaListEntry.status}
            />
          ))}
        </AnimatePresence>
      </Box>
    </>
  );
};

export default List;
