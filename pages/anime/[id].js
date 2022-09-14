import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import Meta from "../../components/Meta"
import { MALSERVER, SERVER, VIDEOSERVER } from "../../config"
import { setLoading } from "../../features/loading"
import makeQuery from "../../makeQuery"
import * as cookie from 'cookie'
import Image from "next/image"
import Description from "../../components/Anime/Description"
import { Box } from "@mui/material"
import Characters from "../../components/Anime/Characters"
import Relations from "../../components/Anime/Relations"
import Streaming from "../../components/Anime/Streaming"
import ListEditor from "../../components/Anime/ListEditor"
import Sidebar from "../../components/Anime/Sidebar"

const Anime = ({ anime, videoId }) => {
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

      <section>
        <div className="grid grid-cols-5 grid-rows-2 h-80 w-screen relative isolate">
          {anime.bannerImage ? <Image layout="fill" className="banner--image | object-cover  -z-10" src={anime.bannerImage} alt={`Banner for ${anime.title.userPreferred}`} /> : <></>}
          <div className="title--card | flex gap-4 bg-offWhite-800" style={{ "--tw-bg-opacity": 0.6 }}>
            <div className="flex-shrink-0 overflow-hidden flex items-center">
              <Image className="aspect-auto object-contain" width={128} height={228} src={anime.coverImage.large} alt={`Cover for ${anime.title.userPreferred}`} />
            </div>
            <div className=" self-center">
              <div className='media--title | text-xl font-semibold'>{anime.title.userPreferred}</div>
              <div className='media--title | text-base'>{anime.title.english}</div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Description text={anime.description} />
      </section>
      <section>
        <Box className="flex flex-wrap flex-col md:flex-row p-4 gap-4">
          {/* Sidebar */}
          <Box className='flex flex-col gap-4' sx={{ flex: "1 1 15%", width: "-webkit-fill-available" }}>
            <ListEditor anime={anime} />
            <Sidebar anime={anime} />
          </Box>
          {/* Content */}
          <Box sx={{ flex: "1 1 80%", overflow: "hidden", width: "-webkit-fill-available" }}>
            <section className="py-2">
              <Characters characters={anime.characters.edges} />
            </section>
            <section className="py-2">
              <Relations relations={anime.relations.edges} />
            </section>
            <section>
              <Streaming anime={anime} videoId={videoId} />
            </section>
          </Box>
        </Box>
      </section>
    </div>
  )
}

export async function getServerSideProps({ params, req }) {

  const getMALTitle = async (idMal) => {
    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }

    function handleError(error) {
      console.error(error);
    }
    const req = `${MALSERVER}/${idMal}`;
    const resp = await fetch(req)
      .then(handleResponse)
      .catch(handleError);
    return resp.data.title;
  };

  const getAnimeID = async (title) => {
    function handleResponse(response) {
      return response.json().then(function (json) {
        return response.ok ? json : Promise.reject(json);
      });
    }


    function handleError(error) {
      console.error(error);
    }

    const req =
      `${VIDEOSERVER}/search?keyw=${title.replace(/[☆★♡△]/g, " ")}`;
    const resp = await fetch(req)
      .then(handleResponse)
      .catch(handleError);
    return resp;
  };

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
            rank
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
  const data = await animeData.data.Media;

  const blacklist = {
    40356: [{ animeId: "tate-no-yuusha-no-nariagari-season-2" }, { animeId: "tate-no-yuusha-no-nariagari-season-2-dub" }],
    38680: [{ animeId: "fruits-basket-2019" }, { animeId: "fruits-basket-2019-dub" }],
    47164: [{ animeId: "dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-iv-shin-shou-meikyuu-hen" }],
  }

  const malTitle = await getMALTitle(data.idMal);
  const animeID = blacklist[data.idMal] || await getAnimeID(malTitle);
  return {
    props: { anime: data, videoId: animeID }
  }
}

export default Anime