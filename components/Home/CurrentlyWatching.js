import { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import makeQuery from "../../makeQuery";
import { shuffle } from "../../shuffle"
import Card from "../Card";
import Carosel from "./Carosel";

const Recommended = () => {
    const user = useSelector(state => state.user.value);
    const [animeArray, setAnimeArray] = useState([]);

    useEffect(() => {
        const getCurrentAiring = async () => {
            var query = `query userRecommended($perPage: Int = 50, $page: Int = 1, $userName: String) {
            Page(perPage: $perPage, page: $page) {
              pageInfo {
                hasNextPage
                total
              }
              mediaList(userName: $userName, type: ANIME, sort:[UPDATED_TIME_DESC]) {
                progress
                score
                media {
                  recommendations {
                    edges {
                      node {
                        rating
                        mediaRecommendation {
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
                          mediaListEntry{
                            id
                          }
                          
                        }
                      }
                    }
                  }
                }
              }
            }
          }`;


            var variables = {
                userName: user.userName
            };

            const getList = (data) => {
                const mediaArray = data.data.Page.mediaList;
                var RecommendationList = [];
                for (const media in mediaArray) {
                    const recommendationEdges = mediaArray[media].media.recommendations.edges
                    for (const edge in recommendationEdges) {
                        if (mediaArray[media].media.recommendations.edges[edge].node.mediaRecommendation) {
                            RecommendationList = (mediaArray[media].media.recommendations.edges[edge].node.rating > 25) && (!mediaArray[media].media.recommendations.edges[edge].node.mediaRecommendation.mediaListEntry) ? [...RecommendationList, mediaArray[media].media.recommendations.edges[edge].node.mediaRecommendation] : RecommendationList
                        }
                    }
                }



                return [data.data.Page.pageInfo.hasNextPage, RecommendationList];
            };
            let hasNextPage = true
            let airingArrayAccumalated = []
            let data;
            while (hasNextPage) {
                variables["page"] = variables["page"] + 1
                data = await makeQuery(query, variables).then((data) => {
                    return data
                }).then(getList);
                hasNextPage = data[0];
                airingArrayAccumalated = airingArrayAccumalated.concat(data[1])
                if (airingArrayAccumalated.length >= 20) { hasNextPage = false }
            }
            const mediaIDArray = [];
            airingArrayAccumalated = airingArrayAccumalated.filter((c) => {
                if (mediaIDArray.includes(c.id)) { return false }
                mediaIDArray.push(c.id)
                return true
            })
            airingArrayAccumalated = shuffle(airingArrayAccumalated)
            setAnimeArray(airingArrayAccumalated)

        };
        getCurrentAiring();
        // eslint-disable-next-line
    }, []);
    return (
        <div className="">
            <div className="text-xl p-4">
                Recommended for you
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

export default Recommended