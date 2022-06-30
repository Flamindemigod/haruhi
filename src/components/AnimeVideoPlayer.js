import React, { useEffect, useState } from 'react'
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import IconButton from "@mui/material/IconButton";
import SkipNext from "@mui/icons-material/SkipNext";
import SkipPrevious from "@mui/icons-material/SkipPrevious";
import ReactPlayer from 'react-player';
import { styled } from '@mui/material/styles';
import makeQuery from '../misc/makeQuery';

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

const updateEpisode = async (id, episode) => {
  const query = `
              mutation updateEpisode($id: Int=1, $episode: Int=1){
                SaveMediaListEntry(mediaId: $id, progress:$episode){
                  id
                }
              }`;
  const variables = {
    id: id,
    episode: episode,
  };
  const response = await makeQuery(query, variables);
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


const AnimeVideoPlayer = ({ mediaMALid, progress, episodes, nextAiringEpisode, setVideoEndToast }) => {
  const [episodeLink, setEpisodeLink] = useState("");
  const [episodeToPlay, setEpisodeToPlay] = useState(1);
  const [videoProgress, setVideoProgress] = useState({
    url: null,
    pip: false,
    playing: true,
    controls: false,
    light: false,
    volume: 0.8,
    muted: false,
    played: 0,
    playedSeconds: 0,
    loaded: 0,
    loadedSeconds: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
  });
  const [videoEnd, setVideoEnd] = useState(false);


  useEffect(() => {
    if (progress) {
      setEpisodeToPlay(median([1, progress.progress + 1, nextAiringEpisode ? (nextAiringEpisode.episode - 1) : episodes]))
    }
  }, [mediaMALid])

  useEffect(() => {
    const getEpisodeLink = async (idMal, episode) => {
      const MalTitle = await getMALTitle(idMal);
      const animeID = await getAnimeID(MalTitle).then((data) => {
        return data.filter(item => !(item.animeId.includes("dub")))[0].animeId
      })
      const EL = await getVideoUrl(animeID, episode).then((data) => (data.sources[0].file))
      setEpisodeLink(EL)
    }
    getEpisodeLink(mediaMALid, episodeToPlay)
  }, [episodeToPlay, mediaMALid])

  useEffect(() => {
    if (videoProgress.played >= 0.9 && !videoEnd) {
      console.log("Video Ended")
      setVideoEnd(true);
      setVideoEndToast(true);
      updateEpisode(mediaMALid, episodeToPlay);
    }
  }, [videoProgress]);
  return (
    <>
      {/* <div>{`Malid ${mediaMALid}`}</div>
      <div>{`Episode to play ${episodeToPlay}`}</div>
      <div>{`Episodes ${episodes}`}</div>
      <div>{`Progress ${JSON.stringify(progress)}`}</div>
      <div>{`Next Airing ${JSON.stringify(nextAiringEpisode)}`}</div> */}
      <div className='text-2xl p-4'>Streaming</div>
      <div className="playerWrapper">
        <ReactPlayer
          className="react-player"
          url={episodeLink}
          controls={true}
          onReady={() => {
            setVideoEnd(false);
          }}
          onProgress={(state) => {
            setVideoProgress({...videoProgress, ...state});
          }}
          width="100%"
          height="100%"
        />
      </div>
      <div className="playerControls flex flex-row justify-center">
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
        Playing
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel sx={{ color: "white", backgroundColor: "#2e2e2e" }} id="episodeSelectorLabel">Episode</InputLabel>
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
            label="Age"
            onChange={(e) => {
              setEpisodeToPlay(e.target.value);
            }}
          >
            {Array.from({ length: (nextAiringEpisode ? nextAiringEpisode.episode : episodes) }, (_, i) => i + 1).map(
              (_episode) => (
                <MenuItem key={_episode} value={_episode}>{`${_episode}`}</MenuItem>
              )
            )}
          </DarkSelect>
        </FormControl>
        <IconButton
          sx={{ color: "white" }}
          aria-label="Next Episode"
          disabled={episodeToPlay === (nextAiringEpisode ? nextAiringEpisode.episode : episodes) ? true : false}
          onClick={() => {
            setEpisodeToPlay(episodeToPlay + 1);
          }}
        >
          <SkipNext />
        </IconButton>
      </div>
    </>
  )
}

export default AnimeVideoPlayer