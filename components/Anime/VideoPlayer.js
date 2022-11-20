import { useEffect, useState, useRef, useMemo } from "react";
import ReactPlayer from "react-player/lazy";
import {
  Box,
  Button,
  styled,
  LinearProgress,
  Slider,
  linearProgressClasses,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import screenfull from "screenfull";
import {
  PlayArrow,
  Pause,
  SkipNext,
  VolumeUp,
  VolumeMute,
  VolumeDown,
  PictureInPictureAlt,
  Fullscreen,
  FastForward,
} from "@mui/icons-material";
import _ from "lodash";
import { useSelector } from "react-redux";
import { median } from "../../median";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 2,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
}));

function format(seconds) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(string) {
  return ("0" + string).slice(-2);
}

const VideoPlayer = ({
  url,
  setProgress,
  onNextEpisode,
  hasNextEpisode,
  onReady,
}) => {
  let timeoutID = null;
  const user = useSelector((state) => state.user.value);
  const isSmall = useMediaQuery("(min-width: 420px)");
  const [isMuted, setIsMuted] = useState(0);
  const [controlsHidden, setControlsHidden] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const [sliderTooltip, setSliderTooltip] = useState({
    absoluteX: 0,
    relativeX: 0,
  });
  const [qualitySelctorMenuAnchor, setQualitySelectorMenuAnchor] =
    useState(false);
  const qualitySelctorMenuOpen = Boolean(qualitySelctorMenuAnchor);
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
  const playerContainer = useRef();
  const playerControls = useRef();
  const sliderRef = useRef();

  function keyboardShortcuts(event) {
    const { key } = event;

    switch (key) {
      case "k":
        setPlayerState((state) => ({ ...state, playing: !state.playing }));
        break;
      case " ":
        setPlayerState((state) => ({ ...state, playing: !state.playing }));
        break;
      case "m":
        toggleMute();
        break;
      case "f":
        handleClickFullscreen();
        break;
      case "p":
        setPlayerState((state) => ({ ...state, playing: !state.playing }));
        break;
      default:
        break;
    }
  }

  const toggleMute = () => {
    if (isMuted !== 0) {
      setPlayerState((state) => ({ ...state, volume: isMuted }));
      setIsMuted(0);
    } else {
      setIsMuted(playerState.volume);
      setPlayerState((state) => ({ ...state, volume: 0 }));
    }
  };

  const handleClickFullscreen = () => {
    if (screenfull.isFullscreen) {
      screenfull.exit(playerContainer.current);
      window.screen.orientation.unlock();
    } else {
      screenfull.request(playerContainer.current);
      window.screen.orientation.lock("landscape").catch((error) => {
        console.error(error);
      });
    }
  };

  useEffect(() => {
    setPlayerState((state) => ({ ...state, url: url }));
  }, [url]);

  useEffect(() => {
    setControlsHidden(playerState.playing);
  }, [playerState.playing]);

  useEffect(() => {
    document.addEventListener("keyup", keyboardShortcuts);

    return () => {
      document.removeEventListener("keyup", keyboardShortcuts);
    };
  }, [playerState.volume]);

  const throttledPlayerControlHandler = useMemo(
    () =>
      _.throttle((e) => {
        clearTimeout(timeoutID);
        setControlsHidden(false);
        timeoutID = setTimeout(() => {
          setControlsHidden(true);
        }, 3000);
      }, 300),
    []
  );

  const handleClick = (event) => {
    setQualitySelectorMenuAnchor(event.currentTarget);
  };
  const handleClose = () => {
    setQualitySelectorMenuAnchor(null);
  };

  const setTooltip = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const absoluteX = e.clientX - rect.left;
    const relativeX = absoluteX / (rect.right - rect.left);
    console.log(absoluteX, rect.right - rect.left);
    setSliderTooltip({
      absoluteX: median([20, absoluteX - 30, rect.right - rect.left - 80]),
      relativeX: median([0, relativeX, 1]),
    });
  };

  return (
    <Box
      className="player | relative isolate cursor-none"
      sx={{ aspectRatio: "16/9" }}
      ref={playerContainer}
      onMouseMove={throttledPlayerControlHandler}
      onTouchStart={throttledPlayerControlHandler}
    >
      <ReactPlayer
        width="100%"
        height="100%"
        url={playerState.url}
        ref={videoPlayer}
        playing={playerState.playing}
        volume={playerState.volume}
        pip={playerState.pip}
        onReady={(e) => {
          onReady(e);
          setPlayerReady(true);
        }}
        onProgress={(newState) => {
          setProgress(newState.played);
          setPlayerState((state) => ({ ...state, ...newState }));
        }}
        onDuration={(duration) => {
          setPlayerState((state) => ({ ...state, duration }));
        }}
      />

      <Box
        className="player--controls | absolute inset-0 z-10 cursor-auto"
        hidden={controlsHidden}
        ref={playerControls}
      >
        {/* Seek Fields */}

        <div className="flex w-full h-full">
          <div
            className="w-full h-full"
            onDoubleClick={() => {
              videoPlayer.current.seekTo(
                videoPlayer.current.getCurrentTime() - 10
              );
            }}
          ></div>
          <div
            className="w-full h-full"
            onDoubleClick={() => {
              videoPlayer.current.seekTo(
                videoPlayer.current.getCurrentTime() + 10
              );
            }}
          ></div>
        </div>
        {/* Play / Pause Button */}
        <Button
          className="top-1/2 left-1/2"
          sx={{
            position: "absolute",
            color: "#eee",
            transform: "translate(-50%, -50%)",
          }}
          onClick={() => {
            setPlayerState((state) => ({ ...state, playing: !state.playing }));
          }}
        >
          {playerState.playing ? (
            <Pause sx={{ width: 64, height: 64 }} />
          ) : (
            <PlayArrow sx={{ width: 64, height: 64 }} />
          )}
        </Button>
        {/* Opening Skip Button */}
        {user.userPreferenceSkipOpening ? (
          <div className="absolute bottom-2/4 sm:bottom-1/4 right-10 ">
            <Button
              onClick={() => {
                videoPlayer.current.seekTo(
                  videoPlayer.current.getCurrentTime() +
                    user.userPreferenceSkipOpening
                );
              }}
              sx={{
                color: "white",
                borderColor: "white",
                backgroundColor: "#1212128f",
                "&:hover": { backgroundColor: "#121212" },
              }}
              variant="outlined"
            >
              <FastForward />+{user.userPreferenceSkipOpening}
            </Button>
          </div>
        ) : (
          <></>
        )}
        {/* Bottom Controls */}
        <Box className="absolute -bottom-1 left-0 right-0 flex flex-col bg-gradient-to-t from-black to-transparent">
          <Box
            className="relative"
            onMouseMove={setTooltip}
            onTouchStart={setTooltip}
            sx={{
              "&:hover .MuiLinearProgress-root,&:hover .MuiSlider-root": {
                height: "8px ",
              },
              "&:hover .tooltip": { display: "flex" },
            }}
          >
            <BorderLinearProgress
              variant="determinate"
              color="inherit"
              className="transition-all h-1"
              ref={sliderRef}
              value={playerState.loaded * 100}
            />
            <Slider
              sx={{
                height: 4,
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                padding: 0,
                marginBlock: "auto",
                "& .MuiSlider-thumb": { width: 16, height: 16 },
                "& .MuiSlider-rail": { display: "none" },
              }}
              aria-label="Progress Slider"
              classes={"transition-all"}
              value={playerState.played * 100}
              onChange={(event, newValue) => {
                setPlayerState((state) => ({
                  ...state,
                  played: sliderTooltip.relativeX,
                }));
                videoPlayer.current.seekTo(sliderTooltip.relativeX, "fraction");
              }}
            />
            <Box
              className="tooltip | hidden absolute -top-10  h-4 min-w-min p-4 items-center justify-center rounded-lg bg-primary-500 bg-opacity-40"
              left={`${sliderTooltip.absoluteX}px`}
            >
              {format(sliderTooltip.relativeX * playerState.duration)}
            </Box>
          </Box>
          <div className="flex">
            <Button
              className=""
              sx={{ color: "#eee", padding: "0.5rem", minWidth: 0 }}
              onClick={() => {
                setPlayerState((state) => ({
                  ...state,
                  playing: !state.playing,
                }));
              }}
            >
              {playerState.playing ? <Pause /> : <PlayArrow />}
            </Button>
            <Button
              sx={{ color: "#eee", padding: "0.5rem", minWidth: 0 }}
              aria-label="Next Episode"
              disabled={!hasNextEpisode}
              onClick={onNextEpisode}
            >
              <SkipNext />
            </Button>
            {/* Elapsed Time */}
            <Box className="my-auto px-2 sm:px-4 min-w-max text-xs sm:text-base">
              {format(playerState.playedSeconds)} /{" "}
              {format(playerState.duration)}
            </Box>
            {/* Volume Mute  Button*/}
            {/* Volume Slider */}
            {isSmall && (
              <Box
                className="p-0 flex gap-2 items-center flex-grow"
                sx={{ minWidth: "5rem", maxWidth: "9rem" }}
              >
                <Button
                  sx={{ color: "#eee", padding: "0.5rem", minWidth: 0 }}
                  aria-label="Volume Mute"
                  onClick={toggleMute}
                >
                  {playerState.volume >= 0.5 ? (
                    <VolumeUp />
                  ) : playerState.volume === 0 ? (
                    <VolumeMute />
                  ) : (
                    <VolumeDown />
                  )}
                </Button>
                <Slider
                  sx={{ width: "100%" }}
                  valueLabelDisplay="auto"
                  size={"small"}
                  aria-label="Volume Slider"
                  value={parseInt(playerState.volume * 100)}
                  onChange={(event, newValue) => {
                    setPlayerState((state) => ({
                      ...state,
                      volume: parseInt(newValue) / 100,
                    }));
                  }}
                />
              </Box>
            )}
            <div className="ml-auto"></div>
            {/* Quality Selector */}
            {playerReady && videoPlayer.current.getInternalPlayer("hls") ? (
              <>
                <Button onClick={handleClick} sx={{ color: "white" }}>{`${
                  videoPlayer.current.getInternalPlayer("hls").currentLevel ===
                  -1
                    ? "auto"
                    : `${
                        videoPlayer.current.getInternalPlayer("hls").levels[
                          videoPlayer.current.getInternalPlayer("hls")
                            .currentLevel
                        ].height
                      }p`
                }`}</Button>
                <Menu
                  anchorEl={qualitySelctorMenuAnchor}
                  open={qualitySelctorMenuOpen}
                  container={playerControls.current}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  transformOrigin={{ vertical: "top", horizontal: "center" }}
                >
                  <MenuItem
                    onClick={() => {
                      videoPlayer.current.getInternalPlayer(
                        "hls"
                      ).currentLevel = -1;
                      handleClose();
                    }}
                  >
                    Auto
                  </MenuItem>
                  {videoPlayer.current
                    .getInternalPlayer("hls")
                    .levels.map((level, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          videoPlayer.current.getInternalPlayer(
                            "hls"
                          ).currentLevel = index;
                          handleClose();
                        }}
                      >{`${level.height}p`}</MenuItem>
                    ))}
                </Menu>
              </>
            ) : (
              <></>
            )}
            {/* PiP */}
            <div className="flex">
              {document.pictureInPictureEnabled && (
                <Button
                  sx={{ color: "white" }}
                  onClick={() => {
                    setPlayerState((state) => ({ ...state, pip: !state.pip }));
                  }}
                >
                  <PictureInPictureAlt />
                </Button>
              )}
              {/* Fullscreen */}
              <Button sx={{ color: "white" }} onClick={handleClickFullscreen}>
                <Fullscreen />
              </Button>
            </div>
          </div>
        </Box>
      </Box>
    </Box>
  );
};

export default VideoPlayer;
