import React from 'react'
import { useState, useEffect } from "react";
import makeQuery from "../misc/makeQuery";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../features/loading"
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



const ContinueWatching = () => {
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
        breakpoint: { max: 560, min:  375 },
        items: 1,
        slidesToSlide: 1 // optional, default to 1.
      }
    };

    useEffect(() => {
        const getCurrentAiring = async () => {
            dispatch(setLoading(true))
            var query = `
          query usersAiringSchedule($perPage: Int = 50, $page: Int = 1, $userName: String) {
            Page(perPage: $perPage, page: $page) {
              pageInfo {
                hasNextPage
                total
              }
              mediaList(userName: $userName, type: ANIME, status:CURRENT, sort: [UPDATED_TIME_DESC]) {
                progress
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
                data = await makeQuery(query, variables).then(getList);
                hasNextPage = data[0];
                airingArrayAccumalated = airingArrayAccumalated.concat(data[1])
            }
            setAnimeArray(airingArrayAccumalated)
            dispatch(setLoading(false))

        };
        getCurrentAiring();
        // eslint-disable-next-line
    }, [user.userName]);

    return (

        <><div className='text-2xl font-semibold p-2'>Continue Watching</div>

            {/* <div className=' flex flex-row gap-4 p-2  overflow-x-auto styled-scrollbars'> */}
                <Carousel 
                responsive={responsive} 
                containerClass="carousel-container"
                centerMode={true} >
                {animeArray.map((media) => (<div className='w-40'><Link className="cardLink" key={media.media.id} to={`/anime/${media.media.id}`}><AnimeCard mediaCover={media.media.coverImage.large} mediaTitle={media.media.title.userPreferred} nextAiringEpisode={media.media.nextAiring ? media.media.nextAiring.node.episode : 0} timeUntilAiring={media.media.nextAiring ? media.media.nextAiring.node.timeUntilAiring : 0} episodes={media.media.episodes} progress={media.progress ? media.progress : 0}/></Link></div>))}
                </Carousel>
            {/* </div> */}
        </>
    )
}

export default ContinueWatching