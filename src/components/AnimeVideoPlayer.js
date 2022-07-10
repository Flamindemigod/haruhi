import React, { useEffect, useRef, useState } from 'react'
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import FastForwardIcon from '@mui/icons-material/FastForward';
import ReactPlayer from 'react-player/lazy';
import { styled } from '@mui/material/styles';
import makeQuery from '../misc/makeQuery';
import { useParams } from 'react-router-dom';
import { Button } from '@mui/material';
import screenfull from 'screenfull';


//https://stackoverflow.com/questions/45309447/calculating-median-javascript
function median(values) {
  if (values.length === 0) throw new Error("No inputs");

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

const getMALTitle = async (idMal) => {
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }

  function handleError(error) {
    console.error(error);
  }
  if (idMal) {
    const req = `https://haruhi-proxy.herokuapp.com/https://api.jikan.moe/v4/anime/${idMal}`;
    const resp = await fetch(req)
      .then(handleResponse)
      .catch(handleError);
    return resp.data.title;
  }
  return ""
};

const getVideoUrl = async (title, episode) => {
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }


  function handleError(error) {
    console.error(error);
  }

  const req =
    "https://haruhi-backend.herokuapp.com/vidcdn/watch/" +
    title +
    "-episode-" +
    episode;
  const resp = await fetch(req)
    .then(handleResponse)
    .catch(handleError);
  return resp;
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
    "https://haruhi-backend.herokuapp.com/search?keyw=" + title;
  const resp = await fetch(req)
    .then(handleResponse)
    .catch(handleError);
  return resp;
};

const updateEpisode = async (id, episode, status, rewatches = 0) => {
  const query = `
              mutation updateEpisode($id: Int=1, $episode: Int=1, $status: MediaListStatus=CURRENT, $rewatches: Int= 0){
                SaveMediaListEntry(mediaId: $id, progress:$episode, status:$status, repeat: $rewatches){
                  id
                }
              }`;
  const variables = {
    id: id,
    episode: episode,
    status: status,
    rewatches: rewatches
  };
  makeQuery(query, variables);
};

const DarkSelect = styled(Select)(({ theme }) => ({
  '&': {
    position: 'relative',
    color: "white",
    backgroundColor: "#2e2e2e",
    transition: theme.transitions.create([
      'box-shadow',
    ]),
  },
  "&::before": {
    borderColor: "#fff",
  },
  "&:hover:not(.Mui-disabled):before": {
    borderColor: "var(--clr-primary)",
  },
  '& > .MuiSelect-icon': {
    color: "white",
  },

}));


const AnimeVideoPlayer = ({ mediaId, mediaMALid, progress, episodes, nextAiringEpisode, setVideoEndToast, mediaListStatus, mediaListRewatches }) => {


  const params = useParams();
  const [episodeLink, setEpisodeLink] = useState("");
  const [episodeToPlay, setEpisodeToPlay] = useState(1);
  const [videoProgress, setVideoProgress] = useState({
    url: null,
    pip: false,
    playing: false,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    duration: 0,
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });
  const [videoEnd, setVideoEnd] = useState(false);
  let videoPlayer = useRef(null)
  let videoContainer = useRef(null)



  useEffect(() => {
    if (progress) {
      setEpisodeToPlay(median([1, progress.progress + 1, nextAiringEpisode ? (nextAiringEpisode.episode - 1) : episodes]))
    }
    else {
      setEpisodeToPlay(1)
    }
    // eslint-disable-next-line
  }, [mediaId])


  useEffect(() => {
    const getEpisodeLink = async (idMal, episode) => {
      const MalTitle = await getMALTitle(idMal);
      const blacklist = {
        40356: "tate-no-yuusha-no-nariagari-season-2",
      }
      let animeID = blacklist[idMal] ? blacklist[idMal] : await getAnimeID(MalTitle).then((data) => {
        if (data.length) { return data.filter(item => !(item.animeId.includes("dub")))[0].animeId } return ""
      })



      const EL = animeID ? await getVideoUrl(animeID, episode).then((data) => { return data.sources[0].file }) : false
      setEpisodeLink(EL)
    }
    getEpisodeLink(mediaMALid, episodeToPlay)
    // eslint-disable-next-line
  }, [episodeToPlay, mediaId])

  useEffect(() => {
    if (videoProgress.played >= 0.9 && !videoEnd) {
      console.log("Video Ended")
      setVideoEnd(true);
      setVideoEndToast(true);

      if (episodeToPlay === 1) {
        if (mediaListStatus === "COMPLETED") {
          updateEpisode(mediaId, episodeToPlay, "CURRENT", mediaListRewatches + 1);

        }
        else {
          updateEpisode(mediaId, episodeToPlay, "CURRENT", mediaListRewatches);

        }
      }
      if (episodeToPlay === episodes) {
        if (episodeToPlay === 1) {
          updateEpisode(mediaId, episodeToPlay, "COMPLETED", mediaListRewatches + 1);
        }
        else {
          updateEpisode(mediaId, episodeToPlay, "COMPLETED", mediaListRewatches);
        }
      }
      else {
        updateEpisode(mediaId, episodeToPlay, "CURRENT", mediaListRewatches);
      }

    }
    // eslint-disable-next-line
  }, [videoProgress]);
  return (
    <>{episodeLink ? <>
      <div className='text-2xl p-4'>Streaming</div>
      <div className="playerWrapper  relative" ref={videoContainer}>
        <ReactPlayer
          className="react-player"
          url={episodeLink}
          controls={true}
          pip={true}
          ref = {videoPlayer}
          playing = {videoProgress.playing}
          
          onReady={() => {
            setVideoEnd(false);
          }}
          onProgress={(state) => {
            setVideoProgress({ ...videoProgress, ...state });
          }}
          onPlay = {()=>{setVideoProgress((state)=>({...state, playing: true}))}}
          onPause = {()=>{setVideoProgress((state)=>({...state, playing: false}))}}
          onDuration={(duration)=>{
            setVideoProgress((state)=>({...state, duration}))
          }}
          width="100%"
          height="100%"
        >
         </ReactPlayer>
        <div className='playerControls absolute bottom-28 right-10 ' data-state={!videoProgress.playing ? "visible" : "hidden"}>
          {/* Play Pause Button */}
          {/* Elapsed Time / Duration */}
          {/* Progress Bar */}
          {/* Volume Mute  Button*/}
          {/* Volume Slider */}
          {/* Fullscreen Button */}
          {/* PiP */}
          <Button
          sx={{border:"2px solid", background:"#2e2e2e2e", color: "#eee"}}
          onClick={()=>{
            videoPlayer.current.seekTo(videoPlayer.current.getCurrentTime() + 85)
          }}>
            <FastForwardIcon/>
            +85
          </Button>
        </div>
      </div>
      <div className="flex flex-row justify-center">
        <IconButton
          sx={{ color: "white" }}
          aria-label="Previous Episode"
          disabled={(episodeToPlay === 1) ? true : false}
          onClick={() => {
            setEpisodeToPlay(episodeToPlay - 1);
          }}
        >
          <SkipPrevious />
        </IconButton>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel sx={{ color: "white", backgroundColor: "#2e2e2e" }} id="episodeSelectorLabel">Playing Episode</InputLabel>
          <DarkSelect
            MenuProps={{
              PaperProps: {
                className: "styled-scrollbars",
                style: {
                  width: 100,
                  backgroundColor: "#2e2e2e",
                  color: 'white'
                },
              },
              disableScrollLock: true,
            }}
            labelId="episodeSelectorLabel"
            id="episodeSelector"
            value={episodeToPlay}
            label="Episode"
            onChange={(e) => {
              setEpisodeToPlay(e.target.value);
            }}
          >
            {Array.from({ length: (nextAiringEpisode ? nextAiringEpisode.episode - 1 : episodes) }, (_, i) => i + 1).map(
              (_episode) => (
                <MenuItem key={_episode} value={_episode}>{`${_episode}`}</MenuItem>
              )
            )}
          </DarkSelect>
        </FormControl>
        <IconButton
          sx={{ color: "white" }}
          aria-label="Next Episode"
          disabled={episodeToPlay === (nextAiringEpisode ? nextAiringEpisode.episode - 1 : episodes) ? true : false}
          onClick={() => {
            setEpisodeToPlay(episodeToPlay + 1);
          }}
        >
          <SkipNext />
        </IconButton>
      </div>
    </> : <></>
}</>
  )
}

export default AnimeVideoPlayer