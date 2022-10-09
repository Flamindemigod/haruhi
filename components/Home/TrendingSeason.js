import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import makeQuery from "../../makeQuery";
import Card from "../Card";
import Carosel from "../Carosel";
import getCurrentSeason from "../../getCurrentSeason";

const TrendingSeason = () => {
  const user = useSelector((state) => state.user.value);
  const [animeArray, setAnimeArray] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const getTrending = async () => {
      var query = `query getMediaTrend($season: MediaSeason, $seasonYear: Int) {
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

      var variables = {
        season,
        seasonYear,
      };

      const getAiring = (media) => {
        const airingSchedule = media.airingSchedule;
        delete media.airingSchedule;
        const nextAiringIndex = airingSchedule.edges.findIndex(
          (element) => element.node.timeUntilAiring > 0
        );
        media["nextAiring"] = airingSchedule.edges[nextAiringIndex];
        return media;
      };

      let airingArrayAccumalated = [];
      let data;
      variables["page"] = variables["page"] + 1;
      data = await makeQuery(query, variables, user.userToken);
      for (const media in data.data.Page.media) {
        data.data.Page.media[media] = getAiring(data.data.Page.media[media]);
      }
      airingArrayAccumalated = airingArrayAccumalated.concat(
        data.data.Page.media
      );
      setAnimeArray(airingArrayAccumalated);
    };
    getTrending();
    // eslint-disable-next-line
  }, [user.userToken]);
  return (
    <div className="">
      <div className="text-xl p-4">Trending This Season</div>
      <Carosel width={"95vw"}>
        <AnimatePresence>
          {animeArray.map((anime, index) => (
            <Card
              key={anime.id}
              height={167}
              width={128}
              status={anime.status}
              image={anime.coverImage.large}
              title={anime.title.userPreferred}
              link={`/anime/${anime.id}`}
              hasNotif={true}
              listStatus={anime.mediaListEntry && anime.mediaListEntry.status}
              progress={anime.mediaListEntry && anime.mediaListEntry.progress}
              episodes={anime.episodes}
              changeDirection={animeArray.length - index < 5 ? true : false}
              nextAiringEpisode={
                anime.nextAiring && anime.nextAiring.node.episode
              }
              nextAiringTime={
                anime.nextAiring && anime.nextAiring.node.timeUntilAiring
              }
            />
          ))}
        </AnimatePresence>
      </Carosel>
    </div>
  );
};

export default TrendingSeason;
