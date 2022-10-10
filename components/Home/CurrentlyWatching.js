import { AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import makeQuery from "../../makeQuery";
import Card from "../Card";
import Carosel from "../Carosel";



const CurrentlyWatching = () => {
  const [animeArray, setAnimeArray] = useState([]);
  let user = useSelector((state) => state.user.value);


  useEffect(() => {
    const getCurrentAiring = async () => {
      var query = `
          query usersAiringSchedule($perPage: Int = 50, $page: Int = 1, $userName: String) {
            Page(perPage: $perPage, page: $page) {
              pageInfo {
                hasNextPage
                total
              }
              mediaList(userName: $userName, type: ANIME, status:CURRENT, sort: [UPDATED_TIME_DESC]) {
                progress
                status
                media {
                  episodes
                  id
                  status
                  siteUrl
                  coverImage {
                    large
                  }
                  title {
                    userPreferred
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
            }
          }
        `;
      var variables = {
        perPage: 50,
        page: 0,
        userName: user.userName,
      };

      const getList = (data) => {
        const mediaArray = data.data.Page.mediaList;
        var airingArray = [];
        for (const media in mediaArray) {

          const airingSchedule = mediaArray[media].media.airingSchedule;
          delete mediaArray[media].media.airingSchedule;
          const nextAiringIndex = airingSchedule.edges.findIndex(
            (element) => element.node.timeUntilAiring > 0
          );
          mediaArray[media].media["nextAiring"] =
            airingSchedule.edges[nextAiringIndex];
          airingArray[media] = mediaArray[media];
        }


        return [data.data.Page.pageInfo.hasNextPage, airingArray];
      };
      let hasNextPage = true
      let airingArrayAccumalated = []
      let data;
      while (hasNextPage) {
        variables["page"] = variables["page"] + 1
        data = await makeQuery(query, variables, user.userToken).then(getList);
        hasNextPage = data[0];
        airingArrayAccumalated = airingArrayAccumalated.concat(data[1])
      }
      setAnimeArray(airingArrayAccumalated)

    };
    if (user.userAuth) {
      getCurrentAiring();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="">
      <div className="text-xl p-4">
        Continue Watching
      </div>
      <Carosel width={"95vw"}>
        <AnimatePresence>
          {animeArray.map((anime, index) => <Card
            key={anime.media.id}
            height={167}
            width={128}
            status={anime.media.status}
            image={anime.media.coverImage.large}
            title={anime.media.title.userPreferred}
            link={`/anime/${anime.media.id}`}
            hasNotif={true}
            listStatus={anime.status}
            progress={anime.progress}
            episodes={anime.media.episodes}
            changeDirection={(((animeArray.length - index) < 5) && (index > 5)) ? true : false}
            nextAiringEpisode={anime.media.nextAiring && anime.media.nextAiring.node.episode}
            nextAiringTime={anime.media.nextAiring && anime.media.nextAiring.node.timeUntilAiring}

          />)}
        </AnimatePresence>
      </Carosel>
    </div>
  )
}

export default CurrentlyWatching