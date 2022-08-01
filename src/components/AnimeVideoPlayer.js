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
import { Button } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Slider from '@mui/material/Slider';
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { Pause, PlayArrow } from '@mui/icons-material';
import VolumeMute from '@mui/icons-material/VolumeMute';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import screenfull from 'screenfull';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { findDOMNode } from 'react-dom'
//https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss/44743686
function formatSeconds(value, fracDigits) {
  var isNegative = false;
  if (isNaN(value)) {
    return value;
  } else if (value < 0) {
    isNegative = true;
    value = Math.abs(value);
  }
  var days = Math.floor(value / 86400);
  value %= 86400;
  var hours = Math.floor(value / 3600);
  value %= 3600;
  var minutes = Math.floor(value / 60);
  var seconds = (value % 60).toFixed(fracDigits || 0);
  if (seconds < 10) {
    seconds = '0' + seconds;
  }

  var res = hours ? (hours + ':' + ('0' + minutes).slice(-2) + ':' + seconds) : (minutes + ':' + seconds);
  if (days) {
    res = days + '.' + res;
  }
  return (isNegative ? ('-' + res) : res);
}

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

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 2,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },

}));


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
    "https://gogoanime.herokuapp.com/vidcdn/watch/" +
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
    "https://gogoanime.herokuapp.com/search?keyw=" + title;
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


const AnimeVideoPlayer = ({ mediaId, mediaMALid, progress, episodes, nextAiringEpisode, setVideoEndToast, mediaListStatus, mediaListRewatches, setRefresh }) => {
  const [episodeLink, setEpisodeLink] = useState(null);
  const [episodeToPlay, setEpisodeToPlay] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [isDubbed, setIsDubbed] = useState(false)
  const [hasDubbed, setHasDubbed] = useState(false)
  const [isMuted, setIsMuted] = useState(0)
  var [timeoutID, setTimoutID] = useState(0)

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
    playbackRate: 1.0,
    loop: false,
  });
  const [videoEnd, setVideoEnd] = useState(true);
  const [playerHidden, setPlayerHidden] = useState(false);

  let videoPlayer = useRef(null)
  let videoContainer = useRef(null)

  const toggleMute = () => {
    console.log(isMuted)
    if (isMuted !== 0) {
      setVideoProgress((state) => ({ ...state, volume: isMuted }));
      setIsMuted(0);
    }
    else {
      setIsMuted(videoProgress.volume);
      setVideoProgress((state) => ({ ...state, volume: 0 }));
    }
  }
  const handleClickFullscreen = () => {
    if (screenfull.isFullscreen) {

      screenfull.exit(findDOMNode(videoContainer.current))
    }
    else {
      screenfull.request(findDOMNode(videoContainer.current))

    }
  }

  function keyboardShortcuts(event) {
    const { key } = event;
    switch(key) {
      case 'k':
        setVideoProgress((state)=>({...state, playing: !state.playing}))
        break;
      case ' ':
        setVideoProgress((state)=>({...state, playing: !state.playing}))
        break;
      case 'm':
        toggleMute();
        break;
      case 'f':
        handleClickFullscreen();
        break;
      case 'p':
        break;
    }
  }

useEffect(()=>{
  document.addEventListener('keyup', keyboardShortcuts);
  document.body.addEventListener("mousemove", function(e) {
   clearTimeout(timeoutID)
    if (e.movementX || e.movementY)
   {
    setPlayerHidden(false)
   }
   setTimoutID(setTimeout(()=>{setPlayerHidden(true)}, 5000))
});
}, [])

  useEffect(() => {
    if (mediaId) {
      if (progress) {
        setEpisodeToPlay(median([1, progress.progress + 1, nextAiringEpisode ? (nextAiringEpisode.episode - 1) : episodes]))
      }
      else {
        setEpisodeToPlay(1)
      }
    }
    // eslint-disable-next-line
  }, [mediaId])


  useEffect(() => {
    const getEpisodeLink = async (idMal, episode) => {
      const MalTitle = await getMALTitle(idMal);
      const blacklist = {
        40356: ["tate-no-yuusha-no-nariagari-season-2", "tate-no-yuusha-no-nariagari-season-2-dub"],
        38680: ["fruits-basket-2019", "fruits-basket-2019-dub"],
        47164: ["dungeon-ni-deai-wo-motomeru-no-wa-machigatteiru-darou-ka-iv-shin-shou-meikyuu-hen"],
        34798: ["yuru-camp"],
        38475: ["yuru-camp-movie"],
        38474: ["yuru-camp-season-2"],

      }
      if (blacklist[idMal]) {
        if (blacklist[idMal].length === 2) {
          setHasDubbed(true)
        }
        else {
          setHasDubbed(false)
        }
      }
      let animeID = blacklist[idMal] ? blacklist[idMal][isDubbed ? 1 : 0] : await getAnimeID(MalTitle)
        .then((data) => {
          if (data.length) {
            const dubbedList = data.filter(item => (item.animeId.includes("dub")))
            if (dubbedList.length) {
              setHasDubbed(true)
            }
            else (
              setHasDubbed(false)
            )
            return data.filter(item => (isDubbed ? (item.animeId.includes("dub")) : !(item.animeId.includes("dub"))))[0].animeId
          }
        })



      const EL = animeID ? await getVideoUrl(animeID, episode).then((data) => { return data.sources[0].file }) : ""
      setEpisodeLink(EL)
    }
    if (!episodeToPlay) { return undefined }
    getEpisodeLink(mediaMALid, episodeToPlay)
    // eslint-disable-next-line
  }, [episodeToPlay, mediaId, isDubbed])

  useEffect(() => {
    if (videoProgress.played >= 0.9 && !videoEnd && videoProgress.playing) {
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
      setRefresh({ type: "refresh" });


    }
    // eslint-disable-next-line
  }, [videoProgress.played]);
  return (
    <>
      <div className='text-lg sm:text-2xl p-4'>Streaming</div>
      {episodeLink === null ? <div>Finding Episode</div> : (episodeLink ? (<div className="playerWrapper relative aspect-video flex" style={{ maxHeight: "100vh" }} ref={videoContainer}>
        <ReactPlayer

          className="react-player"
          url={episodeLink}
          controls={false}
          pip={true}
          ref={videoPlayer}
          volume={videoProgress.volume}
          playing={videoProgress.playing}
          onReady={() => {
            setVideoProgress({ ...videoProgress, playing: 0 })
            setPlayerReady(true)
            setVideoEnd(false);
          }}
          onProgress={(state) => {
            setVideoProgress({ ...videoProgress, ...state });
          }}
          onPlay={() => { setVideoProgress((state) => ({ ...state, playing: true })) }}
          onPause={() => { setVideoProgress((state) => ({ ...state, playing: false })) }}
          onDuration={(duration) => {
            setVideoProgress((state) => ({ ...state, duration }))
          }}
          width="100%"
          height="100%"
        >
        </ReactPlayer>
        {playerReady ? <div className='playerControls absolute inset-0' data-state={(!videoProgress.playing || !playerHidden) ? "visible" : "hidden"}>
          {/* Play / Pause Button */}
          {(<Button className='absolute top-1/2 left-1/2'
            sx={{ color: "#eee", transform: "translate(-50%, -50%)" }}
            onClick={() => { setVideoProgress({ ...videoProgress, playing: !videoProgress.playing }) }}>
            {videoProgress.playing ? <Pause sx={{ width: 64, height: 64 }} /> : <PlayArrow sx={{ width: 64, height: 64 }} />}
          </Button>)}
          {/* Elapsed Time / Duration */}
          <div className='absolute bottom-0 left-0 right-0 h-8 flex gap-4 justify-around align-center bg-black bg-opacity-50'>
            <Button className=''
              sx={{ color: "#eee" }}
              onClick={() => { setVideoProgress({ ...videoProgress, playing: !videoProgress.playing }) }}>
              {videoProgress.playing ? <Pause /> : <PlayArrow />}
            </Button>
            <IconButton
            sx={{ color: "white" }}
            aria-label="Next Episode"
            disabled={episodeToPlay === (nextAiringEpisode ? nextAiringEpisode.episode - 1 : episodes) ? true : false}
            onClick={() => {
              setPlayerReady(false)
              setEpisodeToPlay(episodeToPlay + 1);
            }}
          >
            <SkipNext />
          </IconButton>
            <div className="my-auto w-24">{formatSeconds(videoProgress.playedSeconds)} / {formatSeconds(videoProgress.duration)}</div>
            {/* Volume Mute  Button*/}
            {/* Volume Slider */}
            <div className="w-36 flex gap-2">
              <div className="" onClick={toggleMute}>{videoProgress.volume >= 0.5 ? <VolumeUp /> : (videoProgress.volume === 0 ? <VolumeMute /> : <VolumeDown />)}</div>
              <Slider valueLabelDisplay="auto" size={"small"} aria-label="Volume" value={parseInt(videoProgress.volume * 100)} onChange={(event, newValue) => { setVideoProgress((state) => ({ ...state, volume: parseInt(newValue) / 100 })) }} />
            </div>
            {/* Progress Bar */}
            <div className='w-8/12 my-auto relative'>
              <BorderLinearProgress variant="determinate" color='inherit' value={videoProgress.loaded * 100} />
              <Slider sx={{ position: "absolute", top: "50%", padding: 0, marginBlock: "auto", "& .MuiSlider-thumb":{width:16, height:16}, "& .MuiSlider-rail":{display: "none"} }} aria-label="Progress" value={videoProgress.played * 100} onChange={(event, newValue) => { setVideoProgress((state) => ({ ...state, played: newValue / 100 })); videoPlayer.current.seekTo(newValue / 100, "fraction") }} />

            </div>
            <Button sx={{color: "white"}} onClick={handleClickFullscreen}>
              <FullscreenIcon color='white' />
            </Button>
          </div>


          {/* Fullscreen Button */}
          {/* PiP */}
          <div className="absolute bottom-2/4 sm:bottom-1/4 right-10 ">
            <Button
              sx={{ border: "2px solid", background: "#2e2e2e2e", color: "#eee" }}
              onClick={() => {
                videoPlayer.current.seekTo(videoPlayer.current.getCurrentTime() + 85)
              }}>
              <FastForwardIcon />
              +85
            </Button>
          </div>
        </div> : (<></>)}
      </div>) : <div>Episode Unavailable</div>)}

      <div className="flex flex-col justify-center relative">
        <div className="flex flex-row justify-center">
          <IconButton
            sx={{ color: "white" }}
            aria-label="Previous Episode"
            disabled={(episodeToPlay === 1) ? true : false}
            onClick={() => {
              setPlayerReady(false)
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
                setPlayerReady(false)
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
              setPlayerReady(false)
              setEpisodeToPlay(episodeToPlay + 1);
            }}
          >
            <SkipNext />
          </IconButton>
        </div>
        <FormGroup className='px-4 py-2 w-max sm:right-0 sm:top-0 sm:absolute'>
          <FormControlLabel
            control={<Switch
              checked={isDubbed}
              disabled={!hasDubbed}
              onClick={() => { setIsDubbed((state) => (!state)) }} />}
            label={isDubbed ? "Subbed" : "Dubbed"}
            sx={{ "&  .Mui-disabled.MuiTypography-root": { color: "#acacac" } }} />
        </FormGroup>
      </div>

    </>
  )
}

export default AnimeVideoPlayer