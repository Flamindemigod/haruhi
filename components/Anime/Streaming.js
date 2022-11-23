import {
  FormControlLabel,
  FormGroup,
  Switch,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Chip,
} from "@mui/material";
import {
  SkipPrevious,
  SkipNext,
  ContentPaste,
  ContentCopy,
} from "@mui/icons-material";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { VIDEOSERVER } from "../../config";
import { median } from "../../median";
import VideoPlayer from "./VideoPlayer";
import makeQuery from "../../makeQuery";
import AlertInfo from "../AlertInfo";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../supabaseClient";
import _ from "lodash";

const getVideoUrl = async (title, episode) => {
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }
  function handleError(error) {
    console.error(error);
  }
  const req = `${VIDEOSERVER}/vidcdn/watch/${title}-episode-${episode}`;
  const resp = await fetch(req).then(handleResponse).catch(handleError);
  return resp;
};

const Streaming = ({ anime, videoId, refresh }) => {
  const [alertOpen, setAlertOpen] = useState(false);
  const user = useSelector((state) => state.user.value);
  const [videoURL, setVideoURL] = useState("");
  const [episode, setEpisode] = useState(0);
  const [hasDubbed, setHasDubbed] = useState(false);
  const [isDubbed, setIsDubbed] = useState(user.userPreferenceDubbed);
  const [progress, setProgress] = useState(0);
  const [videoEnd, setVideoEnd] = useState(false);

  // Stream Sync Code

  const [syncCode, setSyncCode] = useState(uuidv4());
  const [userID, setUserID] = useState(uuidv4());
  const [host, setHost] = useState(userID);
  const [_seakTo, setSeekTo] = useState({ to: 0, type: "fraction" });
  const [playerState, setPlayerState] = useState({
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
  const videoPlayer = useRef();

  useEffect(() => {
    const getData = async () => {
      const { data, error } = await supabase.from(`watchparties`).select();
      const filteredData = data.filter((el) => {
        if (el.id === syncCode) {
          return true;
        }
      })[0];
      setHost(filteredData.host);
      setEpisode(filteredData.episode);
      setVideoURL(filteredData.url);
      setPlayerState((state) => ({
        ...state,
        playing: filteredData.playing,
      }));
      videoPlayer.current.seekTo(filteredData.played, "fraction");
    };
    getData();
  }, [syncCode]);

  useEffect(() => {
    supabase
      .channel(`public:watchparties:id=eq.${syncCode}`)
      .on("postgres_changes", { event: "UPDATE", schema: "*" }, (payload) => {
        if (payload.new.id !== syncCode || payload.new.host === userID) {
          return null;
        }
        setHost(payload.new.host);
        setEpisode(payload.new.episode);
        setVideoURL(payload.new.url);
        setPlayerState((state) => ({
          ...state,
          playing: payload.new.playing,
        }));
        if (payload.old.seekto !== payload.new.seekto) {
          videoPlayer.current.seekTo(payload.new.seekto, payload.new.seektype);
        }
        if (payload.old.playing !== payload.new.playing) {
          videoPlayer.current.seekTo(payload.new.played, "fraction");
        }
      })
      .subscribe();
  }, [syncCode]);

  const setDatabaseTable = useCallback(
    _.throttle(async (data, episode, syncCode, userID, _seakTo) => {
      const res = await supabase.from("watchparties").upsert({
        id: syncCode,
        episode: episode,
        playing: data.playing,
        played: data.played,
        url: data.url,
        host: userID,
        seekto: _seakTo.to,
        seektype: _seakTo.type,
        lastUpdated: new Date(),
      });
    }, 100),
    []
  );

  const seekTo = (to, type = "seconds") => {
    setSeekTo({ to, type });
    videoPlayer.current.seekTo(to, type);
  };
  // useEffect(() => {
  //   const channel = supabase.channel("db-watchParties");
  //   channel.on(
  //     "postgres_changes",
  //     {
  //       event: "UPDATE",
  //       schema: "public",
  //       table: "watchparties",
  //       filter: `id=eq.${syncCode}`,
  //     },
  //     (payload) => {
  //       console.log(payload);

  //       setEpisode(payload.new.episode);
  //       setVideoURL(payload.new.url);
  //       setPlayerState((state) => ({
  //         ...state,
  //         playing: payload.new.playing,
  //         played: payload.new.played,
  //       }));
  //     }
  //   );
  // });
  useEffect(() => {
    if (userID === host) {
      setDatabaseTable(playerState, episode, syncCode, userID, _seakTo);
    }
  }, [playerState.playing, playerState.played, episode]);

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
      rewatches: rewatches,
    };
    makeQuery(query, variables, user.userToken);
    refresh();
  };

  useEffect(() => {
    if (anime.mediaListEntry) {
      setEpisode(
        median([
          1,
          anime.mediaListEntry.progress + 1,
          anime.nextAiringEpisode
            ? anime.nextAiringEpisode.episode - 1
            : anime.episodes,
        ])
      );
    } else {
      setEpisode(1);
    }
    // eslint-disable-next-line
  }, [videoId]);

  useEffect(() => {
    const dubbedList = videoId.filter((el) => {
      if (el.animeId.includes("dub")) {
        return true;
      }
      return false;
    });
    const subbedList = videoId.filter((el) => {
      if (el.animeId.includes("dub")) {
        return false;
      }
      return true;
    });
    if (dubbedList.length) {
      setHasDubbed(true);
    }
    const getVideoURL = async () => {
      const resp = await getVideoUrl(
        isDubbed ? dubbedList[0].animeId : subbedList[0].animeId,
        episode
      );
      if (resp.sources) {
        setVideoURL(await resp.sources[0].file);
      }
    };
    if (episode) {
      getVideoURL();
    }
  }, [episode, isDubbed, videoId]);

  useEffect(() => {
    if (user.userAuth) {
      if (progress >= user.userPreferenceEpisodeUpdateTreshold && !videoEnd) {
        setVideoEnd(true);
        setAlertOpen(true);
        if (episode === 1) {
          if (anime.mediaListEntry) {
            if (anime.mediaListEntry.status === "COMPLETED") {
              updateEpisode(
                anime.id,
                episode,
                "CURRENT",
                anime.mediaListEntry.repeat + 1
              );
            }
          } else {
            updateEpisode(
              anime.id,
              episode,
              "CURRENT",
              anime.mediaListEntry ? anime.mediaListEntry.repeat : 0
            );
          }
        }
        if (episode === anime.episodes) {
          if (episode === 1) {
            updateEpisode(
              anime.id,
              episode,
              "COMPLETED",
              anime.mediaListEntry.repeat + 1
            );
          } else {
            updateEpisode(
              anime.id,
              episode,
              "COMPLETED",
              anime.mediaListEntry.repeat
            );
          }
        }
        if (episode !== anime.episodes && episode !== 1) {
          updateEpisode(
            anime.id,
            episode,
            "CURRENT",
            anime.mediaListEntry ? anime.mediaListEntry.repeat : 0
          );
        }
      }
    }
  }, [progress]);
  return (
    <div>
      <div className="text-xl">Streaming</div>
      <VideoPlayer
        setVideoEnd={setVideoEnd}
        setProgress={setProgress}
        videoPlayer={videoPlayer}
        onReady={() => {
          setVideoEnd(false);
        }}
        playerState={playerState}
        setPlayerState={setPlayerState}
        url={videoURL}
        seekTo={seekTo}
        hasNextEpisode={
          episode ===
          (anime.nextAiringEpisode
            ? anime.nextAiringEpisode.episode - 1
            : anime.episodes)
            ? false
            : true
        }
        onNextEpisode={() => {
          setEpisode((state) => state + 1);
        }}
      />
      <div className="flex flex-col sm:flex-row w-full justify-between items-center mt-2">
        {/* Empty Div to help position */}
        <div className="flex gap-2 items-center justify-center">
          <TextField
            label="Sync Code"
            value={syncCode}
            onChange={(e) => {
              setSyncCode(e.target.value);
            }}
          />
          {navigator.clipboard && (
            <>
              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(syncCode);
                }}
              >
                <ContentCopy />
              </IconButton>
              <IconButton
                onClick={async () => {
                  setSyncCode(await navigator.clipboard.readText());
                }}
              >
                <ContentPaste />
              </IconButton>
            </>
          )}
          {host === userID && <Chip label="You are the host" />}
        </div>
        {/* Episode Selector */}
        <div className="flex flex-row justify-center ">
          <IconButton
            aria-label="Previous Episode"
            disabled={episode === 1 ? true : false}
            onClick={() => {
              setEpisode((state) => state - 1);
            }}
          >
            <SkipPrevious />
          </IconButton>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="episodeSelectorLabel">Playing Episode</InputLabel>
            <Select
              MenuProps={{
                disableScrollLock: true,
              }}
              labelId="episodeSelectorLabel"
              id="episodeSelector"
              value={episode}
              label="Episode"
              onChange={(e) => {
                setEpisode(e.target.value);
              }}
            >
              {Array.from(
                {
                  length: anime.nextAiringEpisode
                    ? anime.nextAiringEpisode.episode - 1
                    : anime.episodes,
                },
                (_, i) => i + 1
              ).map((_episode) => (
                <MenuItem
                  key={_episode}
                  value={_episode}
                >{`${_episode}`}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <IconButton
            aria-label="Next Episode"
            disabled={
              episode ===
              (anime.nextAiringEpisode
                ? anime.nextAiringEpisode.episode - 1
                : anime.episodes)
                ? true
                : false
            }
            onClick={() => {
              setEpisode((state) => state + 1);
            }}
          >
            <SkipNext />
          </IconButton>
        </div>

        {/* Dubbed Selector */}
        <FormGroup sx={{ width: "10rem" }}>
          <FormControlLabel
            disabled={!hasDubbed}
            control={
              <Switch
                checked={isDubbed}
                onChange={() => {
                  setIsDubbed((state) => !state);
                }}
              />
            }
            label={isDubbed ? "Dubbed" : "Subbed"}
          />
        </FormGroup>
      </div>

      <AlertInfo
        open={alertOpen}
        onClose={() => {
          setAlertOpen(false);
        }}
        value="Episode Updated"
      />
    </div>
  );
};

export default Streaming;
