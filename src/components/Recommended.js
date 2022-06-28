import React from 'react'
import { useState, useEffect } from "react";
import makeQuery from "../misc/makeQuery";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../features/loading"
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';

const Recommended = () => {
  const dispatch = useDispatch()
  const [animeArray, setAnimeArray] = useState([]);
  let user = useSelector((state) => state.user.value);

  useEffect(() => {
    const getReccomendations = async () => {
      dispatch(setLoading(true))
      var query = `
            query userRecommended($perPage: Int = 50, $page: Int = 1, $userName: String) {
              Page(perPage: $perPage, page: $page) {
                pageInfo {
                  hasNextPage
                  total
                }
                mediaList(userName: $userName, type: ANIME, status: CURRENT, sort: [MEDIA_POPULARITY_DESC]) {
                  progress
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
            }
            
        `;
      var variables = {
        perPage: 50,
        page: 0,
        userName: user.userName,
      };

      const getList = (data) => {
        const mediaArray = data.data.Page.mediaList;
        var RecommendationList = [];
        for (const media in mediaArray) {
          const recommendationEdges = mediaArray[media].media.recommendations.edges
          for (const edge in recommendationEdges) {
           
            RecommendationList = (mediaArray[media].media.recommendations.edges[edge].node.rating > 50) && (!mediaArray[media].media.recommendations.edges[edge].node.mediaRecommendation.mediaListEntry) ? [...RecommendationList, mediaArray[media].media.recommendations.edges[edge].node.mediaRecommendation] : RecommendationList
          }
        }
      


      return [data.data.Page.pageInfo.hasNextPage, RecommendationList];
    };
    let hasNextPage = true
    let airingArrayAccumalated = []
    let data;
    while (hasNextPage) {
      variables["page"] = variables["page"] + 1
      data = await makeQuery(query, variables).then(getList);
      hasNextPage = data[0];
      airingArrayAccumalated = airingArrayAccumalated.concat(data[1])
    }
    setAnimeArray(airingArrayAccumalated)
    dispatch(setLoading(false))

  };
  getReccomendations();
  // eslint-disable-next-line
}, [user.userName]);

return (

  <><div className='text-2xl font-semibold p-2'>Recommended For You</div>

    <div className=' flex flex-row gap-4 p-2  overflow-x-scroll styled-scrollbars'>
      {animeArray.map((media) => (<Link className="cardLink" key={media.id} to={`/anime/${media.id}`}><AnimeCard mediaCover={media.coverImage.large} mediaTitle={media.title.userPreferred} nextAiringEpisode={0} timeUntilAiring={0} episodes={media.episodes} progress={0} /></Link>))}
    </div>
  </>
)
}

export default Recommended