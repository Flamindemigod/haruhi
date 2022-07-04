import React, { createRef } from 'react'
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import makeQuery from '../misc/makeQuery';
import { useDispatch } from 'react-redux';
import { setLoading } from '../features/loading';
import "../assets/Anime.css"
import AnimeRelations from "../components/AnimeRelations"
import AnimeVideoPlayer from '../components/AnimeVideoPlayer';
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import AnimeRecommendations from '../components/AnimeRecommendations';
import { Box } from '@mui/material';


const Anime = () => {
  const [anime, setAnime] = useState({ coverImage: { large: "" }, title: { userPreferred: "", english: "" }, relations: { edges: [] }, mediaListEntry: { progress: 0 }, nextAiringEpisode: { episode: 0 }, recommendations: { edges: [] }, startDate:{year:null, month:null, day:null}, endDate:{year:null, month:null, day:null}, studios:{edges:[]}, source:"", format:"", status:"", season:"", genres:[]});
  let [descriptionAfterText, setDescriptionAfterText] = useState("Read More")
  const [videoEndToast, setVideoEndToast] = useState(false)
  let description = createRef()
  const dispatch = useDispatch()
  const params = useParams();



  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setVideoEndToast(false);
  };
  const toastAction = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    const getAnime = async () => {
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
                name
              }
            }
          }
          duration
          source
          episodes
          status
          genres
          mediaListEntry {
            progress
            status
          }
          averageScore
          nextAiringEpisode {
            airingAt
            timeUntilAiring
            episode
          }
          mediaListEntry {
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
        }
      }
      
      `;
      const variables = {
        id: params.id,
      };
      const animeData = await makeQuery(query, variables);
      setAnime(animeData.data.Media);
      dispatch(setLoading(false));




    };
    getAnime();
    // eslint-disable-next-line
  }, [params.id]);

  useEffect(() => {
    console.log(anime.title.userPreferred)
    document.title = anime.title.userPreferred;
    // eslint-disable-next-line
  }, [anime])

  const toggleOpen = () => {
    if (description.current.classList.contains("open")) {
      description.current.classList.remove("open")
      setDescriptionAfterText("Read More");
    }
    else {
      description.current.classList.add("open")
      setDescriptionAfterText("Read Less");
    }
  }
  useEffect(() => {
    description.current.classList.remove("readMore")
    console.log(description.current.offsetHeight)
    if (description.current.offsetHeight >= 170) {
      description.current.classList.add("readMore")
    }
    // eslint-disable-next-line
  })

  return (
    <>
      <div className="grid grid-cols-5 grid-rows-2 title-grid">
        {anime.bannerImage ? <img className="bannerImage object-cover h-full w-full" src={anime.bannerImage} alt={`Banner for ${anime.title.userPreferred}`} /> : <></>}
        <div className="flex title-card gap-4 bg-offWhite-800" style={{ "--tw-bg-opacity": 0.6 }}>
          {anime.coverImage.large ? <img className=" aspect-auto" src={anime.coverImage.large} alt={`Cover for ${anime.title.userPreferred}`} /> : <></>}
          <div className=" self-center">
            <div className='text-lg sm:text-3xl font-semibold'>{anime.title.userPreferred}</div>
            <div className='sm:text-xl'>{anime.title.english}</div>
          </div>
        </div>
      </div>
      <div className='Description p-8' ref={description} >
        <div className="before"></div>
        <div className='text-md DescriptionInner' dangerouslySetInnerHTML={{ __html: anime.description }}></div>
        <div className="after text-md" onClick={toggleOpen}>{descriptionAfterText}</div>
      </div>
      <Box className='flex flex-wrap flex-col md:flex-row p-4 gap-2' >
        {/* sidebar */}
          <Box className="flex md:flex-col gap-4 overflow-x-scroll md:overflow-auto styled-scrollbars rounded-xl p-4 bg-offWhite-600" sx={{ flex: "1 1 15%", width:"-webkit-fill-available" }}>
            <div className='flex flex-col '>
              <div className="font-semibold">Format</div>
              <div >{anime.format}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Episodes</div>
              <div>{anime.episodes}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Episode Duration</div>
              <div>{`${anime.duration} mins`}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Status</div>
              <div style={{"textTransform":"capitalize"}}>{anime.status.replace("_", " ").toLowerCase()}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Start Date</div>
              <div>{`${anime.startDate.day}/${anime.startDate.month}/${anime.startDate.year}`}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">End Date</div>
              <div>{`${anime.endDate.day}/${anime.endDate.month}/${anime.endDate.year}`}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Season</div>
              <div style={{"textTransform":"capitalize"}}>{anime.season ? anime.season.replace("_", " ").toLowerCase(): ""}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Average Score</div>
              <div>{`${anime.averageScore}%`}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Studios</div>
              <ul>
                {anime.studios.edges.map((edge)=>(edge.isMain ? <li>{edge.node.name}</li>:(<></>)))}
              </ul>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Producers</div>
              <ul>
                {anime.studios.edges.map((edge)=>(!edge.isMain ? <li>{edge.node.name}</li>:(<></>)))}
              </ul>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Source</div>
              <div style={{"textTransform":"capitalize"}}>{anime.source.replace("_", " ").toLowerCase()}</div>
            </div>
            <div className='flex flex-col'>
              <div className="font-semibold">Genres</div>
              <ul>{anime.genres.map((genre) => (<li>{genre}</li>))}</ul>
            </div>
          </Box>

        {/* Content */}
        <Box  sx={{ flex: "1 1 80%", overflow: "hidden", width:"-webkit-fill-available"}}>
        <div className='flex flex-col'>
            <div className=' flex gap-4 overflow-x-scroll styled-scrollbars relatedShowsFlex'>
              {anime.relations.edges.map((edge) => (
                edge.node.type !== "MANGA" ? (
                  <Link to={`/anime/${edge.node.id}`} key={edge.node.id}>
                    <AnimeRelations media={edge.node} relationship={edge.relationType} />
                  </Link>
                ) : (<></>)
              ))}
            </div>
            <div className='text-lg sm:text-2xl p-2 relatedShows'>Related Shows</div>
          </div>

          <AnimeVideoPlayer mediaId={anime.id} mediaMALid={anime.idMal} progress={anime.mediaListEntry} episodes={anime.episodes} nextAiringEpisode={anime.nextAiringEpisode} setVideoEndToast={setVideoEndToast} />

          <div className='flex flex-col '>
            <div className=' flex gap-4 overflow-x-scroll styled-scrollbars relatedShowsFlex'>
            {anime.recommendations.edges.map((edge) => (
                edge.node.mediaRecommendation.type !== "MANGA" ? (
                  <Link to={`/anime/${edge.node.mediaRecommendation.id}`} key={edge.node.mediaRecommendation.id}>
                    <AnimeRecommendations media={edge.node.mediaRecommendation} />
                  </Link>
                ) : (<></>)
              ))}
            </div>
            <div className='text-lg sm:text-2xl p-2 relatedShows'>Recommended Shows</div>
          </div>
        </Box>
      </Box>
      <Snackbar
        open={videoEndToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={handleClose}
        message="Episode Updated"
        action={toastAction}
      />
    </>
  )
}

export default Anime