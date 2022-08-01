import { useState, useEffect } from "react";
import makeQuery from "../misc/makeQuery";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from "../features/loading"
import { Link } from 'react-router-dom';
import AnimeCard from './AnimeCard';




const Trending = () => {
  const dispatch = useDispatch()
    const [animeArray, setAnimeArray] = useState([]);
    let user = useSelector((state) => state.user.value);

    useEffect(() => {
        const getCurrentAiring = async () => {
            dispatch(setLoading(true))
            var query = `
            query getMediaTrend {
              Page{
                pageInfo{
                  hasNextPage
                }
                media(sort:[POPULARITY_DESC], type:ANIME, onList:false) {
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
            var variables = {
                perPage: 50,
                page: 0,
                userName: user.userName,
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
            console.log(data.data.Page.media)
            for (const media in data.data.Page.media){
              data.data.Page.media[media] = getAiring(data.data.Page.media[media])
            }
            airingArrayAccumalated = airingArrayAccumalated.concat(data.data.Page.media)
            setAnimeArray(airingArrayAccumalated)
            console.log(airingArrayAccumalated)
            dispatch(setLoading(false))

        };
        getCurrentAiring();
        // eslint-disable-next-line
    }, [user.userName]);

    return (

        <><div className='text-2xl font-semibold p-2'>Trending</div>

            <div className=' flex flex-row gap-4 p-2  overflow-x-scroll styled-scrollbars'>
                {animeArray.map((media) => (<Link className="cardLink" key={media.id} to={`/anime/${media.id}`}><AnimeCard mediaCover={media.coverImage.large} mediaTitle={media.title.userPreferred} nextAiringEpisode={media.nextAiring ? media.nextAiring.node.episode : 0} timeUntilAiring={media.nextAiring ? media.nextAiring.node.timeUntilAiring : 0} episodes={media.episodes} progress={media.progress ? media.progress : 0}/></Link>))}
            </div>
        </>
    )
}

export default Trending
