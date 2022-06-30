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



const Anime = () => {
  const [anime, setAnime] = useState({ coverImage: { large: "" }, title: { userPreferred: "", english: "" }, relations: { edges: [] }, mediaListEntry:{progress:0}, nextAiringEpisode:{episode:0} });
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
          season
          seasonYear
          type
          episodes
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
  }, [params.id]);

  useEffect(()=>{
    console.log(anime.title.userPreferred)
      document.title = anime.title.userPreferred;
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
    if (description.current.offsetHeight >= 170) {
      description.current.classList.add("readMore")
      setDescriptionAfterText("Read More")
    }

  }, [])

  return (
    <>
      <img className="bannerImage h-60 w-full object-cover" src={anime.bannerImage} alt={`Banner Image for ${anime.title.userPreferred}`} />
      <div className='flex flex-col items-center sm:flex-row sm:items-start w-11/12 gap-4 titleDescriptionContainer'>
        <img className="coverImage h-48 w-36" src={anime.coverImage.large} alt={`Cover Image for ${anime.title.userPreferred}`} />
        <div className='' >
          <div className='titleUser text-3xl'>{anime.title.userPreferred}</div>
          <div className='titleUser text-md '>{anime.title.english}</div>
          <div className='Description' ref={description} >
            <div className="before"></div>
            <div className='text-md DescriptionInner' dangerouslySetInnerHTML={{ __html: anime.description }}></div>
            <div className="after text-md" onClick={toggleOpen}>{descriptionAfterText}</div>
          </div>
          <AnimeVideoPlayer mediaId={anime.id} mediaMALid={anime.idMal} progress={anime.mediaListEntry} episodes={anime.episodes} nextAiringEpisode={anime.nextAiringEpisode} setVideoEndToast={setVideoEndToast}/>  

        </div>
        <div>
            <div className='flex flex-col'>
              <div className='flex flex-row flex-wrap gap-4 justify-center sm:justify-start relatedShowsFlex'>
                {anime.relations.edges.map((edge) => (
                  edge.node.type !== "MANGA" ? (
                    <Link to={`/anime/${edge.node.id}`} key={edge.node.id}>
                      <AnimeRelations media={edge.node} relationship={edge.relationType} />
                    </Link>
                  ) : (<></>)
                ))}
              </div>
              <div className='text-2xl p-2 relatedShows'>Related Shows</div>
            </div>
          </div>
      </div>
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