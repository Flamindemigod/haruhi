import { useState, useEffect } from "react";
import makeQuery from "../misc/makeQuery";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../features/loading"
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



const TrendingSeason = () => {
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
  const getCurrentSeason = () => {
    let currentTime = new Date();
    let currentYear = currentTime.getUTCFullYear();
    let currentMonth = currentTime.getMonth();

    if (currentMonth >= 2 && currentMonth < 4) {
      return ["SPRING", currentYear]
    }
    else if (currentMonth >= 4 && currentMonth < 8) {
      return ["SUMMER", currentYear]

    }
    else if (currentMonth >= 8 && currentMonth < 10) {
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
    const getCurrentAiring = async () => {
      dispatch(setLoading(true))
      var query = `
            query getMediaTrend($season: MediaSeason, $seasonYear: Int) {
              Page(perPage: 50){
                pageInfo{
                  hasNextPage
                }
                media(sort:[POPULARITY_DESC], season: $season, seasonYear: $seasonYear, type:ANIME) {
                  id
                  title{
                    userPreferred
                  }
                  coverImage{
                    large
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
        `;

      let season = null;
      let seasonYear = null;
      [season, seasonYear] = getCurrentSeason();

      var variables = {
        season,
        seasonYear
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
      variables["page"] = variables["page"] + 1
      data = await makeQuery(query, variables);
      for (const media in data.data.Page.media) {
        data.data.Page.media[media] = getAiring(data.data.Page.media[media])
      }
      airingArrayAccumalated = airingArrayAccumalated.concat(data.data.Page.media)
      setAnimeArray(airingArrayAccumalated)
      dispatch(setLoading(false))

    };
    getCurrentAiring();
    // eslint-disable-next-line
  }, []);

  return (

    <><div className='mt-4 text-2xl font-semibold p-2'>Trending this Season</div>

      {/* <div className=' flex flex-row gap-4 p-2  overflow-x-auto styled-scrollbars'> */}
      <Carousel
        responsive={responsive}
        containerClass="carousel-container"
        centerMode={true} >
        {animeArray.map((media) => (<div className="w-40"><Link className="cardLink" key={media.id} to={`/anime/${media.id}`}><AnimeCard mediaCover={media.coverImage.large} mediaTitle={media.title.userPreferred} nextAiringEpisode={media.nextAiring ? media.nextAiring.node.episode : 0} timeUntilAiring={media.nextAiring ? media.nextAiring.node.timeUntilAiring : 0} episodes={media.episodes} progress={media.progress ? media.progress : 0} /></Link></div>))}
      </Carousel>
      {/* </div> */}
    </>
  )
}

export default TrendingSeason
