import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import makeQuery from "../../makeQuery";
import Card from "../Card";
import Carosel from "../Carosel";

const Trending = () => {
    const user = useSelector(state => state.user.value);
    const [animeArray, setAnimeArray] = useState([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const getCurrentSeason = () => {
        let currentTime = new Date();
        let currentYear = currentTime.getUTCFullYear();
        let currentMonth = currentTime.getMonth();

        if (currentMonth >= 2 && currentMonth < 4) {
            return ["SPRING", currentYear]
        }
        else if (currentMonth >= 4 && currentMonth < 9) {
            return ["SUMMER", currentYear]

        }
        else if (currentMonth >= 9 && currentMonth < 10) {
            return ["FALL", currentYear]

        }
        else {
            if (currentMonth >= 10) {
                return ["WINTER", currentYear]
            }
            else {
                return ["WINTER", currentYear - 1]
            }
        }
    }
    useEffect(() => {
        const getTrending = async () => {
            var query = `query getMediaTrend {
                  Page(perPage: 50){
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



            var variables = {

            };

            const getAiring = (media) => {
                const airingSchedule = media.airingSchedule;
                delete media.airingSchedule;
                const nextAiringIndex = airingSchedule.edges.findIndex(
                    (element) => element.node.timeUntilAiring > 0
                );
                media["nextAiring"] = airingSchedule.edges[nextAiringIndex];
                return media
            }

            let airingArrayAccumalated = []
            let data;
            data = await makeQuery(query, user.userToken);
            for (const media in data.data.Page.media) {
                data.data.Page.media[media] = getAiring(data.data.Page.media[media])
            }
            airingArrayAccumalated = airingArrayAccumalated.concat(data.data.Page.media)
            setAnimeArray(airingArrayAccumalated)

        };
        getTrending();
        // eslint-disable-next-line
    }, []);
    return (
        <div className="">
            <div className="text-xl p-4">
                Been trending forever
            </div>
            <Carosel width={"95vw"}>
                {animeArray.map((anime, index) => <Card
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
                    changeDirection={((animeArray.length - index) < 5) ? true : false}
                    nextAiringEpisode={anime.nextAiring && anime.nextAiring.node.episode}
                    nextAiringTime={anime.nextAiring && anime.nextAiring.node.timeUntilAiring}

                />)}
            </Carosel>
        </div>
    )
}

export default Trending