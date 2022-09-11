import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Meta from "../../components/Meta"
import { SERVER } from "../../config"
import { setLoading } from "../../features/loading"
import makeQuery from "../../makeQuery"
import * as cookie from 'cookie'
import Image from "next/image"
import Description from "../../components/Anime/Description"

const Anime = ({ anime }) => {
  const user = useSelector(state => state.user.value)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading(false))
  }, [])
  return (
    <div>
      <Meta
        title={anime.title.userPreferred}
        description={anime.description}
        url={`${SERVER}/anime/${anime.id}`}
        image={anime.coverImage.large} />

      <div className="grid grid-cols-5 grid-rows-2 h-80 w-screen relative isolate">
        {anime.bannerImage ? <Image layout="fill" className="banner--image | object-cover  -z-10" src={anime.bannerImage} alt={`Banner for ${anime.title.userPreferred}`} /> : <></>}
        <div className="title--card | flex gap-4 bg-offWhite-800" style={{ "--tw-bg-opacity": 0.6 }}>
          {anime.coverImage.large ? <img className="aspect-auto" src={anime.coverImage.large} alt={`Cover for ${anime.title.userPreferred}`} /> : <></>}
          <div className=" self-center">
            <div className='text-xl font-semibold'>{anime.title.userPreferred}</div>
            <div className='text-base'>{anime.title.english}</div>
          </div>
        </div>
      </div>
      <Description text={anime.description} />
    </div>
  )
}

export async function getServerSideProps({ params, req }) {
  const query = `query getAnimeData($id: Int = 1) {
        Media(id: $id) {
          id
          idMal
          coverImage {
            large
          }
          bannerImage
          title {
            userPreferred
            english
          }
          description
          format
          season
          startDate {
            year
            month
            day
          }
          endDate {
            year
            month
            day
          }
          seasonYear
          type
          genres
          season
          studios {
            edges {
              isMain
              node {
                id
                name
              }
            }
          }
          duration
          source
          episodes
          status
          genres
          tags {
            id
            name
            description
            category
          }
          averageScore
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
          mediaListEntry {
            id
            status
            progress
            score
            repeat
            startedAt {
              year
              month
              day
            }
            completedAt {
              year
              month
              day
            }
          }
          relations {
            edges {
              relationType
              node {
                title {
                  userPreferred
                }
                id
                type
                status
                coverImage {
                  large
                }
              }
            }
          }
          recommendations {
            edges {
              node {
                mediaRecommendation {
                  type
                  id
                  title {
                    userPreferred
                  }
                  type
                  coverImage {
                    large
                  }
                }
              }
            }
          }
          characters(sort: ROLE) {
            edges {
              node {
                id
                name {
      
                  userPreferred
                }
                image {
                  large
                }
              }
              role
              voiceActors(language: JAPANESE, sort: ROLE) {
                id
                name {
      
                  userPreferred
                }
                image {
                  large
                }
              }
            }
          }
        }
      }
      
      `;
  const variables = {
    id: params.id,
  };
  const animeData = await makeQuery(query, variables, req.headers.cookie ? cookie.parse(req.headers.cookie).access_token : null);
  const data = await animeData.data.Media
  return {
    props: { anime: data }
  }
}

export default Anime