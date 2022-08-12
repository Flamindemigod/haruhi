import React from 'react'
import { useState, useEffect } from "react";
import makeQuery from "../misc/makeQuery";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../features/loading"
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex !== 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


const Recommended = () => {
  const dispatch = useDispatch()
  const [animeArray, setAnimeArray] = useState([]);
  let user = useSelector((state) => state.user.value);
  const responsive = {
    desktopLarge: {
      breakpoint: { max: 3000, min: 2000 },
      items: 11,
      slidesToSlide: 8 // optional, default to 1.
    },
    desktop: {
      breakpoint: { max: 2000, min: 1500 },
      items: 7,
      slidesToSlide: 6 // optional, default to 1.
    },
    desktopSmall: {
      breakpoint: { max: 1500, min: 1100 },
      items: 5,
      slidesToSlide: 5 // optional, default to 1.
    },
    tabletLarge: {
      breakpoint: { max: 1100, min: 930 },
      items: 4,
      slidesToSlide: 4 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 930, min: 740 },
      items: 3,
      slidesToSlide: 3 // optional, default to 1.
    },
    tabletSmall: {
      breakpoint: { max: 740, min: 560 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 560, min: 375 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    }
  };
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
      dispatch(setLoading(false))

    };
    getReccomendations();
    // eslint-disable-next-line
  }, [user.userName]);

  return (

    <><div className='mt-4 text-2xl font-semibold p-2'>Recommended For You</div>
      {/* <div className=' flex flex-row gap-4 p-2  overflow-x-auto styled-scrollbars'> */}
      <Carousel
        responsive={responsive}
        containerClass="carousel-container"
        centerMode={true} >
        {animeArray.map((media) => (<div className='w-40'><Link className="cardLink" key={media.id} to={`/anime/${media.id}`}><AnimeCard mediaCover={media.coverImage.large} mediaTitle={media.title.userPreferred} nextAiringEpisode={0} timeUntilAiring={0} episodes={media.episodes} progress={0} mediaListStatus=""/></Link></div>))}
      </Carousel>
      {/* </div> */}
    </>
  )
}

export default Recommended