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
  Tooltip,
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

const getVideoUrl = async (title, episode, animeMalID, isDubbed) => {
  function handleResponse(response) {
    return response.json().then(function (json) {
      return response.ok ? json : Promise.reject(json);
    });
  }
  function handleError(error) {
    console.error(error);
  }
  const blacklist = {
    51367: [
      {
        animeId:
          episode >= 13
            ? "jojo-no-kimyou-na-bouken-part-6-stone-ocean-part-3"
            : "jojo-no-kimyou-na-bouken-part-6-stone-ocean-part-2",
        episode: 12,
      },
      {
        animeId:
          episode >= 13
            ? "jojo-no-kimyou-na-bouken-part-6-stone-ocean-part-3-dub"
            : "jojo-no-kimyou-na-bouken-part-6-stone-ocean-part-2-dub",
        episode: 12,
      },
    ],
  };
  const req = `${VIDEOSERVER}/vidcdn/watch/${
    blacklist[animeMalID]
      ? blacklist[animeMalID][isDubbed ? 1 : 0].animeId
      : title
  }-episode-${
    blacklist[animeMalID]
      ? episode > blacklist[animeMalID][isDubbed ? 1 : 0].episode
        ? episode - blacklist[animeMalID][isDubbed ? 1 : 0].episode
        : episode
      : episode
  }`;
  const resp = await fetch(req).then(handleResponse).catch(handleError);
  console.log(resp);
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
  const [_seekTo, setSeekTo] = useState({ to: 0, type: "fraction" });
  let locked = false;
  let episodeLock = false;
  const [playerState, setPlayerState] = useState({
    ready: false,
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

  const channelRef = useRef();

  const throttleedSeek = useCallback(
    _.debounce(
      (videoPlayer, seekTo, seekType) => {
        videoPlayer.current.seekTo(seekTo, seekType);
      },
      5000,
      { leading: true, trailing: false }
    ),
    []
  );

  const isSameAnime = (id) => {
    return anime.id === id;
  };
  useEffect(() => {
    channelRef.current = supabase.channel(syncCode);
    channelRef.current
      .on("broadcast", { event: "playing" }, (payload) => {
        if (isSameAnime) {
          setPlayerState((state) => ({ ...state, playing: payload.playing }));
          videoPlayer.current.seekTo(payload.played, "seconds");
          if (!episodeLock) {
            setEpisode(payload.episode);
            episodeLock = true;
          }
          setTimeout(() => {
            episodeLock = false;
          }, 5000);
          locked = true;
          setTimeout(() => {
            locked = false;
          }, 5000);
        }
      })
      .on("broadcast", { event: "played" }, (payload) => {
        if (isSameAnime) {
          if (
            Math.abs(payload.payload - playerState.playedSeconds) > 5 &&
            !locked
          ) {
            setPlayerState((state) => ({ ...state, playing: true }));
            throttleedSeek(videoPlayer, payload.payload, "seconds");
          }
        }
      })
      .on("broadcast", { event: "seekTo" }, (payload) => {
        if (isSameAnime) {
          videoPlayer.current.seekTo(payload.seekTo, payload.seekType);
          locked = true;
          setTimeout(() => {
            locked = false;
          }, 1000);
        }
      })
      .on("broadcast", { event: "episodes" }, (payload) => {
        if (isSameAnime && !episodeLock) {
          setEpisode(payload.episode);
        }
      })
      .subscribe();

    return () => {
      channelRef.current.unsubscribe();
    };
  }, [syncCode]);

  useEffect(() => {
    channelRef.current.send({
      type: "broadcast",
      event: "episodes",
      episode: episode,
      animeID: anime.id,
    });
  }, [episode]);

  useEffect(() => {
    channelRef.current.send({
      type: "broadcast",
      event: "playing",
      playing: playerState.playing,
      played: playerState.playedSeconds,
      episode: episode,
      animeID: anime.id,
    });
  }, [playerState.playing]);

  useEffect(() => {
    channelRef.current.send({
      type: "broadcast",
      event: "played",
      payload: playerState.playedSeconds,
      animeID: anime.id,
    });
  }, [playerState.playedSeconds]);

  useEffect(() => {
    channelRef.current.send({
      type: "broadcast",
      event: "seekTo",
      seekTo: _seekTo.to,
      seekType: _seekTo.type,
      animeID: anime.id,
    });
  }, [_seekTo]);

  const seekTo = (to, type = "seconds") => {
    setSeekTo({ to, type });
    videoPlayer.current.seekTo(to, type);
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
    setPlayerState((state) => ({ ...state, playing: false }));
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
        episode,
        anime.idMal,
        isDubbed
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
          setPlayerState((state) => ({ ...state, ready: true }));
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
      <div className="grid grid-cols-1 md:grid-cols-3 w-full justify-center items-center mt-4">
        {/* Empty Div to help position */}
        <div className="flex gap-2 items-center justify-center">
          <Tooltip title="Paste in your friend's share code here" arrow>
            <TextField
              fullWidth
              label="Sync Code"
              value={syncCode}
              onChange={(e) => {
                setSyncCode(e.target.value);
              }}
            />
          </Tooltip>
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
        <FormGroup className="flex justify-center items-end self-end">
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
