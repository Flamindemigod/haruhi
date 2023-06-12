"use client";

import { RefObject, useContext, useMemo, useRef, useState } from "react";
import ReactPlayer from "react-player/lazy";
import _, { toNumber } from "lodash";
import { useMediaQuery } from "react-responsive";
import cx from "classnames";
import { median } from "../../utils/median";
import screenfull from "screenfull";
import { userContext } from "../../app/UserContext";
import * as Progress from "@radix-ui/react-progress";
import * as Slider from "@radix-ui/react-slider";
import Select from "../../primitives/Select";
import isBetween from "../../utils/isBetween";
type PlayerState = {
  ready: boolean;
  url: string;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  duration: number;
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
  playbackRate: number;
  loop: boolean;
};

type Props = {
  playerState: PlayerState;
  setPlayerState: any;
  hasNextEpisode: boolean;
  videoPlayer: RefObject<ReactPlayer>;
  startTime: number;
  endTime: number;
  onNextEpisode: () => void;
  onReady: () => void;

  onPlay: () => void;
  onPause: () => void;
  onSeek: (seekTo: number, seekType: string) => void;
  onProgress: (playedSeconds: number) => void;
  onPlaybackRateChange: (playbackRate: number) => void;
};

function format(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${mm}:${ss}`;
}

function pad(string: number) {
  return ("0" + string).slice(-2);
}

const VideoPlayer = (props: Props) => {
  let timeoutID: any;
  const user = useContext(userContext);
  const isSmall = useMediaQuery({ query: "(min-width: 420px)" });
  const [isMuted, setIsMuted] = useState<number>(0);
  const [controlsHidden, setControlsHidden] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [sliderTooltip, setSliderTooltip] = useState<any>({
    absoluteX: 0,
    relativeX: 0,
  });
  const sliderRef = useRef<any>();
  const playerContainer = useRef<any>();

  const setTooltip = (e: any) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const absoluteX = e.clientX - rect.left;
    const relativeX = absoluteX / (rect.right - rect.left);
    setSliderTooltip({
      absoluteX: median([20, absoluteX - 30, rect.right - rect.left - 80]),
      relativeX: median([0, relativeX, 1]),
    });
  };

  const toggleMute = () => {
    if (isMuted !== 0) {
      props.setPlayerState((state: any) => ({ ...state, volume: isMuted }));
      setIsMuted(0);
    } else {
      setIsMuted(props.playerState.volume);
      props.setPlayerState((state: any) => ({ ...state, volume: 0 }));
    }
  };

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

  const handleClickFullscreen = () => {
    if (screenfull.isFullscreen) {
      screenfull.exit();
      window.screen.orientation.unlock();
      setIsFullScreen(false);
    } else {
      screenfull.request(playerContainer.current);
      setIsFullScreen(true);
      window.screen.orientation.lock("landscape").catch((error) => {
        console.error(error);
      });
    }
  };
  return (
    <div
      ref={playerContainer}
      className="player--container | relative cursor-none aspect-video"
      onMouseMove={throttledPlayerControlHandler}
      onTouchStart={throttledPlayerControlHandler}
    >
      <ReactPlayer
        width="100%"
        height="100%"
        url={props.playerState.url}
        ref={props.videoPlayer}
        playing={props.playerState.playing}
        volume={props.playerState.volume}
        pip={props.playerState.pip}
        playbackRate={props.playerState.playbackRate}
        onReady={(e) => {
          props.onReady();
          props.setPlayerState((state: any) => ({ ...state, ready: true }));
        }}
        onPlay={() => {
          props.onPlay();
          props.setPlayerState((state: any) => ({ ...state, playing: true }));
        }}
        onPause={() => {
          props.onPause();
          props.setPlayerState((state: any) => ({ ...state, playing: false }));
        }}
        onProgress={(newState) => {
          if (props.playerState.ready && props.playerState.playing) {
            props.onProgress(newState.playedSeconds);
          }
          props.setPlayerState((state: any) => ({ ...state, ...newState }));
        }}
        onDuration={(duration) => {
          props.setPlayerState((state: any) => ({ ...state, duration }));
        }}
      />
      <div
        className={cx(
          "player--controls | absolute inset-0 z-10 cursor-auto",
          controlsHidden && "opacity-0 pointer-events-none",
          // "focus-within:opacity-100 focus-within:pointer-events-auto",
          !props.playerState.playing && "opacity-100 pointer-events-auto"
        )}
      >
        <div className="flex w-full h-full">
          <div
            className="w-full h-full"
            onDoubleClick={() => {
              props.onSeek(
                props.videoPlayer.current?.getCurrentTime()! - 10,
                "seconds"
              );
              props.videoPlayer.current?.seekTo(
                props.videoPlayer.current.getCurrentTime() - 10,
                "seconds"
              );
            }}
          ></div>
          <div
            className="w-full h-full"
            onDoubleClick={() => {
              props.onSeek(
                props.videoPlayer.current?.getCurrentTime()! + 10,
                "seconds"
              );
              props.videoPlayer.current?.seekTo(
                props.videoPlayer.current.getCurrentTime() + 10,
                "seconds"
              );
            }}
          ></div>
        </div>
        <button
          className="top-1/2 left-1/2 bg-primary-500 bg-opacity-30 focus:bg-opacity-50 hover:bg-opacity-50 rounded-full p-1"
          style={{
            position: "absolute",
            color: "#eee",
            transform: "translate(-50%, -50%) scale(2.5)",
          }}
          onClick={() => {
            if (props.playerState.playing) {
              props.onPause();
            } else {
              props.onPlay();
            }
            props.setPlayerState((state: any) => ({
              ...state,
              playing: !state.playing,
            }));
          }}
        >
          {props.playerState.playing ? (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          ) : (
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>

        {/* Opening Skip Button */}
        {user.userPreferenceSkipOpening &&
        (props.startTime === props.endTime
          ? true
          : isBetween(
              props.startTime,
              props.endTime,
              props.playerState.playedSeconds
            )) ? (
          <div className="absolute bottom-2/4 sm:bottom-1/4 right-10 ">
            {props.startTime === props.endTime ? (
              <button
                onClick={() => {
                  props.onSeek(
                    props.videoPlayer.current?.getCurrentTime()! +
                      user.userPreferenceSkipOpening!,
                    "seconds"
                  );
                  props.videoPlayer.current?.seekTo(
                    props.videoPlayer.current?.getCurrentTime()! +
                      user.userPreferenceSkipOpening!,
                    "seconds"
                  );
                }}
                className="flex gap-1 items-center bg-offWhite-800 hover:bg-primary-500 bg-opacity-30 hover:bg-opacity-30 p-2 text-lg rounded-md font-medium"
                style={{
                  color: "white",
                  borderColor: "white",
                }}
              >
                +{user.userPreferenceSkipOpening}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            ) : (
              <button
                onClick={() => {
                  props.onSeek(props.endTime, "seconds");
                  props.videoPlayer.current?.seekTo(props.endTime, "seconds");
                }}
                className="flex gap-1 items-center bg-offWhite-800 hover:bg-primary-500 bg-opacity-30 hover:bg-opacity-30 p-2 text-lg rounded-md font-medium"
                style={{
                  color: "white",
                  borderColor: "white",
                }}
              >
                Skip Opening
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.14645 11.1464C1.95118 11.3417 1.95118 11.6583 2.14645 11.8536C2.34171 12.0488 2.65829 12.0488 2.85355 11.8536L6.85355 7.85355C7.04882 7.65829 7.04882 7.34171 6.85355 7.14645L2.85355 3.14645C2.65829 2.95118 2.34171 2.95118 2.14645 3.14645C1.95118 3.34171 1.95118 3.65829 2.14645 3.85355L5.79289 7.5L2.14645 11.1464ZM8.14645 11.1464C7.95118 11.3417 7.95118 11.6583 8.14645 11.8536C8.34171 12.0488 8.65829 12.0488 8.85355 11.8536L12.8536 7.85355C13.0488 7.65829 13.0488 7.34171 12.8536 7.14645L8.85355 3.14645C8.65829 2.95118 8.34171 2.95118 8.14645 3.14645C7.95118 3.34171 7.95118 3.65829 8.14645 3.85355L11.7929 7.5L8.14645 11.1464Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            )}
          </div>
        ) : (
          <></>
        )}
        {/* Bottom Controls */}
        <div className="absolute -bottom-1  left-0 right-0 flex flex-col gap-2 bg-gradient-to-t from-black to-transparent">
          <div
            className="relative group"
            onMouseMove={setTooltip}
            onTouchStart={setTooltip}
          >
            <Progress.Root
              className="w-full overflow-hidden h-2 bg-white bg-opacity-20"
              value={props.playerState.loaded}
              max={1}
            >
              <Progress.Indicator
                style={{ width: `${props.playerState.loaded * 100}%` }}
                className="h-full bg-offWhite-100 duration-300 ease-in-out"
              />
            </Progress.Root>
            <Slider.Root
              ref={sliderRef}
              value={[props.playerState.played]}
              max={1}
              step={0.0001}
              onValueChange={(value) => {
                props.onSeek(value[0], "fraction");
                props.videoPlayer.current?.seekTo(value[0], "fraction");
              }}
              className="absolute inset-0 flex items-center"
            >
              <Slider.Track className="relative h-2 w-full grow ">
                <Slider.Range className="absolute h-full bg-primary-500" />
              </Slider.Track>
              <Slider.Thumb
                className={cx(
                  "block h-4 hover:h-5 w-4 hover:w-5 rounded-full bg-primary-500 ",
                  "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                )}
              />
            </Slider.Root>
            <div
              className="hidden group-hover:flex absolute -top-10  h-4 min-w-min p-4 items-center justify-center rounded-lg bg-primary-500 bg-opacity-40 text-white"
              style={{ left: `${sliderTooltip.absoluteX}px` }}
            >
              {format(sliderTooltip.relativeX * props.playerState.duration)}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="relative p-1 md:p-2 m-2 "
              style={{
                color: "#eee",
                transform: "scale(1.6)",
              }}
              onClick={() => {
                if (props.playerState.playing) {
                  props.onPause();
                } else {
                  props.onPlay();
                }
                props.setPlayerState((state: any) => ({
                  ...state,
                  playing: !state.playing,
                }));
              }}
            >
              {props.playerState.playing ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.04995 2.74998C6.04995 2.44623 5.80371 2.19998 5.49995 2.19998C5.19619 2.19998 4.94995 2.44623 4.94995 2.74998V12.25C4.94995 12.5537 5.19619 12.8 5.49995 12.8C5.80371 12.8 6.04995 12.5537 6.04995 12.25V2.74998ZM10.05 2.74998C10.05 2.44623 9.80371 2.19998 9.49995 2.19998C9.19619 2.19998 8.94995 2.44623 8.94995 2.74998V12.25C8.94995 12.5537 9.19619 12.8 9.49995 12.8C9.80371 12.8 10.05 12.5537 10.05 12.25V2.74998Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.24182 2.32181C3.3919 2.23132 3.5784 2.22601 3.73338 2.30781L12.7334 7.05781C12.8974 7.14436 13 7.31457 13 7.5C13 7.68543 12.8974 7.85564 12.7334 7.94219L3.73338 12.6922C3.5784 12.774 3.3919 12.7687 3.24182 12.6782C3.09175 12.5877 3 12.4252 3 12.25V2.75C3 2.57476 3.09175 2.4123 3.24182 2.32181ZM4 3.57925V11.4207L11.4288 7.5L4 3.57925Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
            <button
              className="p-1 md:p-2 m-2 "
              style={{ color: "#eee", transform: "scale(1.6)" }}
              aria-label="Next Episode"
              disabled={!props.hasNextEpisode}
              onClick={props.onNextEpisode}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.0502 2.74989C13.0502 2.44613 12.804 2.19989 12.5002 2.19989C12.1965 2.19989 11.9502 2.44613 11.9502 2.74989V7.2825C11.9046 7.18802 11.8295 7.10851 11.7334 7.05776L2.73338 2.30776C2.5784 2.22596 2.3919 2.23127 2.24182 2.32176C2.09175 2.41225 2 2.57471 2 2.74995V12.25C2 12.4252 2.09175 12.5877 2.24182 12.6781C2.3919 12.7686 2.5784 12.7739 2.73338 12.6921L11.7334 7.94214C11.8295 7.89139 11.9046 7.81188 11.9502 7.7174V12.2499C11.9502 12.5536 12.1965 12.7999 12.5002 12.7999C12.804 12.7999 13.0502 12.5536 13.0502 12.2499V2.74989ZM3 11.4207V3.5792L10.4288 7.49995L3 11.4207Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
            {/* Elapsed Time */}
            <div className="my-auto  min-w-max text-xs sm:text-lg text-white">
              {format(props.playerState.playedSeconds)} /{" "}
              {format(props.playerState.duration)}
            </div>
            {/* Volume */}
            {isSmall && (
              <div className="relative flex gap-2 items-center flex-grow min-w-[5rem] max-w-[9rem]">
                <button
                  className="p-1 md:p-2 m-2"
                  style={{ color: "#eee", transform: "scale(1.6)" }}
                  aria-label="Volume Toggle"
                  onClick={toggleMute}
                >
                  {props.playerState.volume >= 0.5 ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.46968 1.05085C7.64122 1.13475 7.75 1.30904 7.75 1.5V13.5C7.75 13.691 7.64122 13.8653 7.46968 13.9492C7.29813 14.0331 7.09377 14.0119 6.94303 13.8947L3.2213 11H1.5C0.671571 11 0 10.3284 0 9.5V5.5C0 4.67158 0.671573 4 1.5 4H3.2213L6.94303 1.10533C7.09377 0.988085 7.29813 0.966945 7.46968 1.05085ZM6.75 2.52232L3.69983 4.89468C3.61206 4.96294 3.50405 5 3.39286 5H1.5C1.22386 5 1 5.22386 1 5.5V9.5C1 9.77615 1.22386 10 1.5 10H3.39286C3.50405 10 3.61206 10.0371 3.69983 10.1053L6.75 12.4777V2.52232ZM10.2784 3.84804C10.4623 3.72567 10.7106 3.77557 10.833 3.95949C12.2558 6.09798 12.2558 8.90199 10.833 11.0405C10.7106 11.2244 10.4623 11.2743 10.2784 11.1519C10.0944 11.0296 10.0445 10.7813 10.1669 10.5973C11.4111 8.72728 11.4111 6.27269 10.1669 4.40264C10.0445 4.21871 10.0944 3.97041 10.2784 3.84804ZM12.6785 1.43044C12.5356 1.2619 12.2832 1.24104 12.1147 1.38386C11.9462 1.52667 11.9253 1.77908 12.0681 1.94762C14.7773 5.14488 14.7773 9.85513 12.0681 13.0524C11.9253 13.2209 11.9462 13.4733 12.1147 13.6161C12.2832 13.759 12.5356 13.7381 12.6785 13.5696C15.6406 10.0739 15.6406 4.92612 12.6785 1.43044Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : props.playerState.volume === 0 ? (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.72361 1.05279C7.893 1.13749 8 1.31062 8 1.5V13.5C8 13.6894 7.893 13.8625 7.72361 13.9472C7.55421 14.0319 7.35151 14.0136 7.2 13.9L3.33333 11H1.5C0.671573 11 0 10.3284 0 9.5V5.5C0 4.67158 0.671573 4 1.5 4H3.33333L7.2 1.1C7.35151 0.986371 7.55421 0.968093 7.72361 1.05279ZM7 2.5L3.8 4.9C3.71345 4.96491 3.60819 5 3.5 5H1.5C1.22386 5 1 5.22386 1 5.5V9.5C1 9.77614 1.22386 10 1.5 10H3.5C3.60819 10 3.71345 10.0351 3.8 10.1L7 12.5V2.5ZM14.8536 5.14645C15.0488 5.34171 15.0488 5.65829 14.8536 5.85355L13.2071 7.5L14.8536 9.14645C15.0488 9.34171 15.0488 9.65829 14.8536 9.85355C14.6583 10.0488 14.3417 10.0488 14.1464 9.85355L12.5 8.20711L10.8536 9.85355C10.6583 10.0488 10.3417 10.0488 10.1464 9.85355C9.95118 9.65829 9.95118 9.34171 10.1464 9.14645L11.7929 7.5L10.1464 5.85355C9.95118 5.65829 9.95118 5.34171 10.1464 5.14645C10.3417 4.95118 10.6583 4.95118 10.8536 5.14645L12.5 6.79289L14.1464 5.14645C14.3417 4.95118 14.6583 4.95118 14.8536 5.14645Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 1.5C8 1.31062 7.893 1.13749 7.72361 1.05279C7.55421 0.968093 7.35151 0.986371 7.2 1.1L3.33333 4H1.5C0.671573 4 0 4.67158 0 5.5V9.5C0 10.3284 0.671573 11 1.5 11H3.33333L7.2 13.9C7.35151 14.0136 7.55421 14.0319 7.72361 13.9472C7.893 13.8625 8 13.6894 8 13.5V1.5ZM3.8 4.9L7 2.5V12.5L3.8 10.1C3.71345 10.0351 3.60819 10 3.5 10H1.5C1.22386 10 1 9.77614 1 9.5V5.5C1 5.22386 1.22386 5 1.5 5H3.5C3.60819 5 3.71345 4.96491 3.8 4.9ZM10.083 5.05577C9.96066 4.87185 9.71235 4.82195 9.52843 4.94432C9.3445 5.06669 9.2946 5.31499 9.41697 5.49892C10.2207 6.70693 10.2207 8.29303 9.41697 9.50104C9.2946 9.68496 9.3445 9.93326 9.52843 10.0556C9.71235 10.178 9.96066 10.1281 10.083 9.94418C11.0653 8.46773 11.0653 6.53222 10.083 5.05577Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </button>

                <Slider.Root
                  className="flex items-center h-1 w-full bg-offWhite-600 relative"
                  value={[props.playerState.volume]}
                  onValueChange={(value) => {
                    props.setPlayerState((state: any) => ({
                      ...state,
                      volume: value[0],
                    }));
                  }}
                  aria-label="Volume"
                  min={0}
                  max={1}
                  step={0.001}
                >
                  <Slider.Track className="relative h-1 w-full grow">
                    <Slider.Range className="absolute h-full  bg-primary-500" />
                  </Slider.Track>
                  <Slider.Thumb
                    className={cx(
                      "block h-3 hover:h-4 w-3 hover:w-4 rounded-full bg-primary-500 ",
                      "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                    )}
                  />
                </Slider.Root>
              </div>
            )}
            <div className="ml-auto"></div>
            {props.playerState.ready && props.videoPlayer.current ? (
              <Select
                buttonNoColor
                triggerAriaLabel="Playback Rate"
                onValueChange={(value: string) => {
                  const playbackRate = toNumber(value.replace("x", ""));
                  props.onPlaybackRateChange(playbackRate);
                }}
                defaultValue={"1x"}
                value={`${props.playerState.playbackRate}x`}
                values={["1x", "1.25x", "1.5x", "1.75x", "2x", "3x"]}
              />
            ) : (
              <></>
            )}
            {props.playerState.ready && props.videoPlayer.current ? (
              <Select
                buttonNoColor
                triggerAriaLabel="Resolution"
                onValueChange={(value: string) => {
                  if (value === "Auto") {
                    return (props.videoPlayer.current!.getInternalPlayer(
                      "hls"
                    ).currentLevel = -1);
                  }
                  props.videoPlayer.current!.getInternalPlayer(
                    "hls"
                  ).currentLevel = props.videoPlayer
                    .current!.getInternalPlayer("hls")
                    .levels.findIndex(
                      (level: any) => `${level.height}p` === value
                    );
                }}
                defaultValue={"auto"}
                value={
                  props.videoPlayer.current.getInternalPlayer("hls")
                    .currentLevel === -1
                    ? "Auto"
                    : `${
                        props.videoPlayer.current.getInternalPlayer("hls")
                          .levels[
                          props.videoPlayer.current.getInternalPlayer("hls")
                            .currentLevel
                        ].height
                      }p`
                }
                values={[
                  "Auto",
                  ...props.videoPlayer.current
                    .getInternalPlayer("hls")
                    .levels.map((level: any) => `${level.height}p`),
                ]}
              />
            ) : (
              <></>
            )}

            {document.pictureInPictureEnabled && (
              <button
                className="p-1 md:p-2 m-2"
                style={{ color: "#eee", transform: "scale(1.5)" }}
                onClick={() => {
                  props.setPlayerState((state: any) => ({
                    ...state,
                    pip: !state.pip,
                  }));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z" />
                  <path d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z" />
                </svg>
              </button>
            )}
            <button
              className="p-1 md:p-2 m-2"
              style={{ color: "#eee", transform: "scale(1.6)" }}
              onClick={handleClickFullscreen}
            >
              {isFullScreen ? (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 2C5.77614 2 6 2.22386 6 2.5V5.5C6 5.77614 5.77614 6 5.5 6H2.5C2.22386 6 2 5.77614 2 5.5C2 5.22386 2.22386 5 2.5 5H5V2.5C5 2.22386 5.22386 2 5.5 2ZM9.5 2C9.77614 2 10 2.22386 10 2.5V5H12.5C12.7761 5 13 5.22386 13 5.5C13 5.77614 12.7761 6 12.5 6H9.5C9.22386 6 9 5.77614 9 5.5V2.5C9 2.22386 9.22386 2 9.5 2ZM2 9.5C2 9.22386 2.22386 9 2.5 9H5.5C5.77614 9 6 9.22386 6 9.5V12.5C6 12.7761 5.77614 13 5.5 13C5.22386 13 5 12.7761 5 12.5V10H2.5C2.22386 10 2 9.77614 2 9.5ZM9 9.5C9 9.22386 9.22386 9 9.5 9H12.5C12.7761 9 13 9.22386 13 9.5C13 9.77614 12.7761 10 12.5 10H10V12.5C10 12.7761 9.77614 13 9.5 13C9.22386 13 9 12.7761 9 12.5V9.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 2.5C2 2.22386 2.22386 2 2.5 2H5.5C5.77614 2 6 2.22386 6 2.5C6 2.77614 5.77614 3 5.5 3H3V5.5C3 5.77614 2.77614 6 2.5 6C2.22386 6 2 5.77614 2 5.5V2.5ZM9 2.5C9 2.22386 9.22386 2 9.5 2H12.5C12.7761 2 13 2.22386 13 2.5V5.5C13 5.77614 12.7761 6 12.5 6C12.2239 6 12 5.77614 12 5.5V3H9.5C9.22386 3 9 2.77614 9 2.5ZM2.5 9C2.77614 9 3 9.22386 3 9.5V12H5.5C5.77614 12 6 12.2239 6 12.5C6 12.7761 5.77614 13 5.5 13H2.5C2.22386 13 2 12.7761 2 12.5V9.5C2 9.22386 2.22386 9 2.5 9ZM12.5 9C12.7761 9 13 9.22386 13 9.5V12.5C13 12.7761 12.7761 13 12.5 13H9.5C9.22386 13 9 12.7761 9 12.5C9 12.2239 9.22386 12 9.5 12H12V9.5C12 9.22386 12.2239 9 12.5 9Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
