"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { userContext } from "../../app/UserContext";
import VideoPlayer from "./VideoPlayer";
import VideoPlayerSkeleton from "./VideoPlayerSkeleton";
import _ from "lodash";
import { median } from "../../utils/median";
import Switch from "../../primitives/Switch";
import Select from "../../primitives/Select";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../utils/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import * as ToastPrimitive from "@radix-ui/react-toast";
import cx from "classnames";
import { MdClose, MdSkipNext, MdSkipPrevious } from "react-icons/md";
type Props = {
  entry: any;
  syncCode: string | undefined;
};

const Streaming = (props: Props) => {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const user = useContext(userContext);
  const [fetching, setFetching] = useState<boolean>(true);
  const [isDubbed, setIsDubbed] = useState<boolean>(false);
  const [episodesListSub, setEpisodeListSub] = useState<any>([]);
  const [episodesListDub, setEpisodeListDub] = useState<any>([]);
  const [episode, setEpisode] = useState(0);
  const [syncCode, setSyncCode] = useState<string>(props.syncCode || uuidv4());
  const [syncPlayedSeconds, setSyncPlayedSeconds] = useState<number>(0);
  const [videoEnd, setVideoEnd] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);
  const [playerState, setPlayerState] = useState({
    ready: false,
    url: "",
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
  const videoPlayer = useRef<any>(null);
  const syncChannelRef = useRef<any>(null);

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

  const isSameAnime = (id: number) => {
    return props.entry.id === id;
  };

  const fetchEpisodesList = async (malId: number, origin: string) => {
    setFetching(true);
    const dataSub = await fetch(
      `http://136.243.175.33:8080/api/getEpisodes?idMal=${malId}&format=sub&origin=${origin}`
    ).then((res) => res.json());
    setEpisodeListSub(dataSub);
    const dataDub = await fetch(
      `http://136.243.175.33:8080/api/getEpisodes?idMal=${malId}&format=dub&origin=${origin}`
    ).then((res) => res.json());
    setEpisodeListDub(dataDub);

    setFetching(false);
  };

  useEffect(() => {
    fetchEpisodesList(props.entry.idMal, props.entry.countryOfOrigin);
  }, []);

  useEffect(() => {
    if (episodesListDub.length === 0) {
      setIsDubbed(false);
    } else {
      setIsDubbed(user.userPreferenceDubbed || false);
    }
  }, [episodesListDub]);

  useEffect(() => {
    if (props.entry.mediaListEntry) {
      setEpisode(
        median([
          1,
          props.entry.mediaListEntry.progress + 1,
          props.entry.nextAiringEpisode
            ? props.entry.nextAiringEpisode.episode - 1
            : props.entry.episodes,
        ])
      );
    } else {
      setEpisode(1);
    }
  }, []);

  useEffect(() => {
    // setPlayerState((state) => ({ ...state, playing: false }));

    const getVideoURL = async () => {
      console.log(episode);
      if (
        isDubbed ? episodesListDub[episode - 1] : episodesListSub[episode - 1]
      ) {
        const data = await fetch(
          `http://136.243.175.33:8080/api/getStream?id=${
            isDubbed
              ? episodesListDub[episode - 1]?.id
              : episodesListSub[episode - 1]?.id
          }`
        ).then((res) => res.json());
        setPlayerState((state) => ({ ...state, url: data[0]?.url }));
      }
    };

    if (episode) {
      getVideoURL();
    }
  }, [episode, isDubbed, episodesListSub, episodesListDub]);

  const syncPlaying = (payload: any) => {
    if (isSameAnime(payload.animeID)) {
      setEpisode(payload.episode);

      setPlayerState((state) => ({ ...state, playing: payload.playing }));
    }
  };

  useEffect(() => {
    if (
      Math.abs(syncPlayedSeconds - playerState.playedSeconds) > 5 &&
      playerState.ready &&
      playerState.url
    ) {
      setTimeout(() => {
        setPlayerState((state) => ({ ...state, playing: true }));
      }, 300);
      throttleedSeek(videoPlayer, syncPlayedSeconds, "seconds");
    }
  }, [syncPlayedSeconds]);
  const syncPlayed = (payload: any) => {
    if (isSameAnime(payload.animeID)) {
      setEpisode(payload.episode);
      setSyncPlayedSeconds(payload.played);
    }
  };
  const syncSeekTo = (payload: any) => {
    if (isSameAnime(payload.animeID)) {
      videoPlayer.current.seekTo(payload.seekTo, payload.seekType);
      // locked = true;
      // setTimeout(() => {
      //   locked = false;
      // }, 1000);
    }
  };
  const syncEpisodes = (payload: any) => {
    if (isSameAnime(payload.animeID)) {
      setEpisode(parseInt(payload.episode));
    }
  };

  useEffect(() => {
    if (props.syncCode) {
      syncChannelRef.current = supabase.channel(syncCode);
      syncChannelRef.current
        .on("broadcast", { event: "playing" }, syncPlaying)
        .on("broadcast", { event: "played" }, syncPlayed)
        .on("broadcast", { event: "seekTo" }, syncSeekTo)
        .on("broadcast", { event: "episodes" }, syncEpisodes)
        .subscribe();

      return () => {
        supabase.removeChannel(syncChannelRef.current);
        // syncChannelRef.current.unsubscribe();
      };
    }
  }, []);

  const dispatchSyncChannelRef = (props: any) => {
    if (syncChannelRef.current) {
      syncChannelRef.current.send({
        type: "broadcast",
        ...props,
      });
    }
  };

  const updateEpisode = async (
    id: number,
    episode: number,
    status: string,
    rewatches = 0
  ) => {
    const data = await fetch(
      `http://136.243.175.33:8080/api/setMediaEntry?&mediaId=${id}&status=${status}&progress=${episode}&repeat=${rewatches}`
    );
    queryClient.invalidateQueries({
      queryKey: ["mediaListEntry"],
      type: "all",
    });

    if (openToast) {
      setOpenToast(false);
      setTimeout(() => {
        setOpenToast(true);
      }, 400);
    } else {
      setOpenToast(true);
    }
  };
  useEffect(() => {
    if (user.userAuth) {
      if (
        playerState.played >=
          (user.userPreferenceEpisodeUpdateTreshold !== undefined
            ? user.userPreferenceEpisodeUpdateTreshold
            : 0.85) &&
        !videoEnd
      ) {
        setVideoEnd(true);
        if (episode === 1) {
          if (props.entry.mediaListEntry) {
            if (props.entry.mediaListEntry.status === "COMPLETED") {
              updateEpisode(
                props.entry.id,
                episode,
                "CURRENT",
                props.entry.mediaListEntry.repeat + 1
              );
            }
          } else {
            updateEpisode(
              props.entry.id,
              episode,
              "CURRENT",
              props.entry.mediaListEntry ? props.entry.mediaListEntry.repeat : 0
            );
          }
        }
        if (episode === props.entry.episodes) {
          if (episode === 1) {
            updateEpisode(
              props.entry.id,
              episode,
              "COMPLETED",
              props.entry.mediaListEntry.repeat + 1
            );
          } else {
            updateEpisode(
              props.entry.id,
              episode,
              "COMPLETED",
              props.entry.mediaListEntry.repeat
            );
          }
        } else {
          updateEpisode(
            props.entry.id,
            episode,
            "CURRENT",
            props.entry.mediaListEntry ? props.entry.mediaListEntry.repeat : 0
          );
        }
      }
    }
  }, [playerState.played]);
  return (
    <>
      {fetching || episodesListSub.length || episodesListDub.length ? (
        <div>
          <ToastPrimitive.Provider>
            <div className="p-2 text-2xl text-offWhite-900 dark:text-offWhite-100">
              Streaming
            </div>
            {fetching && !playerState.ready ? (
              <VideoPlayerSkeleton />
            ) : (
              <VideoPlayer
                playerState={playerState}
                setPlayerState={setPlayerState}
                videoPlayer={videoPlayer}
                hasNextEpisode={
                  (isDubbed ? episodesListDub.length : episodesListSub.length) >
                  episode
                }
                onReady={() => {
                  setVideoEnd(false);
                }}
                onPlay={() => {
                  dispatchSyncChannelRef({
                    event: "playing",
                    playing: true,
                    animeID: props.entry.id,
                    episode: episode,
                  });
                }}
                onPause={() => {
                  dispatchSyncChannelRef({
                    event: "playing",
                    playing: false,
                    animeID: props.entry.id,
                    episode: episode,
                  });
                }}
                onSeek={(seekTo: number, seekType: string) => {
                  dispatchSyncChannelRef({
                    event: "seekTo",
                    seekTo,
                    seekType,
                    animeID: props.entry.id,
                  });
                }}
                onProgress={(playedSeconds: number) => {
                  dispatchSyncChannelRef({
                    event: "played",
                    played: playedSeconds,
                    animeID: props.entry.id,
                    episode: episode,
                  });
                }}
                onNextEpisode={() => {
                  setPlayerState((state) => ({ ...state, ready: false }));
                  dispatchSyncChannelRef({
                    event: "episodes",
                    episode: episode + 1,
                    animeID: props.entry.id,
                  });
                  setEpisode((state) => state + 1);
                }}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 w-full p-4 items-center">
              <div className="h-full flex">
                {!props.syncCode ? (
                  <Link
                    href={`${pathname}/${syncCode}`}
                    className="p-2 font-medium rounded-md bg-primary-500 text-white flex items-center gap-2"
                  >
                    <svg
                      viewBox="1.679 36.5 499.277 426.464"
                      width="24"
                      height="20"
                    >
                      <path
                        d="M 490.546 67.705 L 291.443 67.705 C 288.398 55.725 280.156 45.726 268.974 40.456 C 257.792 35.181 244.836 35.181 233.656 40.456 C 222.474 45.726 214.23 55.725 211.185 67.705 L 12.082 67.705 C 9.323 67.705 6.677 68.801 4.726 70.752 C 2.775 72.7 1.679 75.348 1.679 78.105 L 1.679 327.743 C 1.679 330.502 2.775 333.148 4.726 335.099 C 6.677 337.049 9.323 338.146 12.082 338.146 L 74.49 338.146 L 74.49 349.667 C 74.505 355.447 76.185 361.102 79.329 365.96 C 82.478 370.813 86.954 374.653 92.23 377.029 C 71.013 392.46 57.25 416.091 54.302 442.161 L 22.484 442.161 C 16.74 442.161 12.082 446.817 12.082 452.562 C 12.082 458.306 16.74 462.964 22.484 462.964 L 480.152 462.964 C 485.897 462.964 490.553 458.306 490.553 452.562 C 490.553 446.817 485.897 442.161 480.152 442.161 L 448.334 442.161 C 446.37 424.914 439.656 408.551 428.943 394.893 C 418.226 381.237 403.933 370.826 387.648 364.818 C 398.738 358.599 407.825 349.344 413.832 338.144 L 490.553 338.144 C 493.312 338.144 495.958 337.047 497.909 335.097 C 499.859 333.148 500.956 330.5 500.956 327.743 L 500.956 78.105 C 500.956 75.347 499.859 72.7 497.909 70.75 C 495.958 68.799 493.312 67.703 490.553 67.703 L 490.546 67.705 Z M 251.311 57.304 C 256.827 57.304 262.121 59.495 266.023 63.396 C 269.922 67.295 272.115 72.59 272.115 78.105 C 272.115 83.623 269.922 88.917 266.023 92.817 C 262.121 96.718 256.827 98.909 251.311 98.909 C 245.796 98.909 240.501 96.718 236.6 92.817 C 232.701 88.917 230.508 83.623 230.508 78.105 C 230.518 72.59 232.709 67.306 236.61 63.404 C 240.51 59.505 245.796 57.312 251.311 57.304 Z M 211.181 88.508 C 214.228 100.488 222.47 110.485 233.65 115.757 C 244.832 121.032 257.789 121.032 268.971 115.757 C 280.152 110.486 288.395 100.488 291.44 88.508 L 480.142 88.508 L 480.142 275.735 L 413.822 275.735 C 406.253 261.522 393.772 250.548 378.703 244.87 C 363.636 239.191 347.011 239.191 331.944 244.87 C 316.874 250.548 304.393 261.522 296.825 275.735 L 206.956 275.735 C 193.314 256.102 170.891 244.434 146.986 244.531 C 123.081 244.628 100.75 256.475 87.269 276.214 C 86.494 275.959 85.696 275.795 84.882 275.735 L 22.474 275.735 L 22.474 88.508 L 211.181 88.508 Z M 289.895 317.342 L 220.107 317.342 C 220.102 310.299 219.067 303.286 217.041 296.539 L 289.899 296.539 L 289.895 296.539 C 288.697 303.42 288.697 310.461 289.895 317.342 Z M 220.107 349.665 L 220.107 338.144 L 296.828 338.144 C 302.837 349.344 311.923 358.599 323.012 364.818 C 306.727 370.826 292.434 381.237 281.718 394.895 C 271.005 408.551 264.29 424.916 262.326 442.161 L 240.297 442.161 C 237.349 416.092 223.585 392.462 202.369 377.031 C 207.645 374.654 212.121 370.813 215.27 365.96 C 218.414 361.104 220.094 355.448 220.109 349.667 L 220.107 349.665 Z M 309.802 306.941 C 309.802 294.868 314.598 283.287 323.134 274.746 C 331.672 266.207 343.253 261.415 355.327 261.415 C 367.4 261.415 378.981 266.213 387.52 274.746 C 396.061 283.287 400.857 294.868 400.857 306.941 C 400.857 319.013 396.061 330.594 387.52 339.134 C 378.981 347.673 367.4 352.471 355.327 352.466 C 343.258 352.453 331.686 347.651 323.152 339.116 C 314.617 330.582 309.815 319.01 309.803 306.941 L 309.802 306.941 Z M 22.481 317.342 L 22.481 296.539 L 77.552 296.539 C 75.528 303.286 74.493 310.297 74.488 317.342 L 22.481 317.342 Z M 104.574 358.949 C 99.452 358.944 95.297 354.787 95.292 349.667 L 95.292 317.342 C 95.292 298.764 105.207 281.592 121.296 272.305 C 137.386 263.012 157.214 263.012 173.303 272.305 C 189.394 281.592 199.307 298.764 199.307 317.342 L 199.307 349.667 C 199.304 354.787 195.147 358.944 190.025 358.949 L 104.574 358.949 Z M 147.299 379.751 C 164.792 379.783 181.685 386.104 194.9 397.563 C 208.115 409.02 216.767 424.849 219.278 442.161 L 75.322 442.161 C 77.834 424.849 86.485 409.02 99.701 397.563 C 112.915 386.104 129.809 379.783 147.301 379.751 L 147.299 379.751 Z M 427.309 442.161 L 283.351 442.161 C 286.686 418.868 301.085 398.627 322 387.841 C 342.911 377.053 367.753 377.053 388.662 387.841 C 409.578 398.627 423.978 418.87 427.311 442.161 L 427.309 442.161 Z M 420.762 317.342 C 421.96 310.461 421.96 303.42 420.762 296.539 L 480.149 296.539 L 480.149 317.342 L 420.762 317.342 Z M 213.219 253.622 C 217.444 256.125 222.254 257.467 227.166 257.51 C 232.075 257.556 236.914 256.298 241.182 253.865 L 304.412 218.29 L 304.412 218.294 C 310.23 215.02 314.697 209.782 317.006 203.512 C 319.313 197.25 319.313 190.366 317.006 184.099 C 314.697 177.834 310.23 172.596 304.412 169.323 L 241.182 133.748 L 241.182 133.738 C 232.479 128.85 221.836 128.942 213.222 133.985 C 204.608 139.027 199.311 148.26 199.311 158.238 L 199.311 229.373 C 199.282 234.28 200.554 239.111 202.997 243.368 C 205.439 247.626 208.963 251.164 213.217 253.621 L 213.219 253.622 Z M 220.114 158.24 C 220.087 155.64 221.469 153.229 223.73 151.943 C 224.856 151.28 226.131 150.927 227.437 150.917 C 228.682 150.922 229.903 151.251 230.984 151.873 L 294.216 187.447 L 294.216 187.444 C 296.509 188.738 297.929 191.168 297.929 193.806 C 297.929 196.438 296.509 198.871 294.216 200.162 L 230.984 235.723 C 228.736 237.046 225.942 237.022 223.722 235.661 C 221.469 234.376 220.09 231.97 220.114 229.375 L 220.114 158.24 Z"
                        data-bx-origin="0 -0.000002"
                        fill="#eee"
                      ></path>
                    </svg>
                    Watch with Friends
                  </Link>
                ) : (
                  <div className="dark:text-offWhite-100 flex items-center gap-2">
                    <svg
                      transform="scale(1.6)"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5 7.50003C5 8.32845 4.32843 9.00003 3.5 9.00003C2.67157 9.00003 2 8.32845 2 7.50003C2 6.6716 2.67157 6.00003 3.5 6.00003C4.32843 6.00003 5 6.6716 5 7.50003ZM5.71313 8.66388C5.29445 9.45838 4.46048 10 3.5 10C2.11929 10 1 8.88074 1 7.50003C1 6.11931 2.11929 5.00003 3.5 5.00003C4.46048 5.00003 5.29445 5.54167 5.71313 6.33616L9.10424 4.21671C9.03643 3.98968 9 3.74911 9 3.50003C9 2.11932 10.1193 1.00003 11.5 1.00003C12.8807 1.00003 14 2.11932 14 3.50003C14 4.88074 12.8807 6.00003 11.5 6.00003C10.6915 6.00003 9.97264 5.61624 9.51566 5.0209L5.9853 7.22738C5.99502 7.31692 6 7.40789 6 7.50003C6 7.59216 5.99502 7.68312 5.9853 7.77267L9.51567 9.97915C9.97265 9.38382 10.6915 9.00003 11.5 9.00003C12.8807 9.00003 14 10.1193 14 11.5C14 12.8807 12.8807 14 11.5 14C10.1193 14 9 12.8807 9 11.5C9 11.2509 9.03643 11.0104 9.10425 10.7833L5.71313 8.66388ZM11.5 5.00003C12.3284 5.00003 13 4.32846 13 3.50003C13 2.6716 12.3284 2.00003 11.5 2.00003C10.6716 2.00003 10 2.6716 10 3.50003C10 4.32846 10.6716 5.00003 11.5 5.00003ZM13 11.5C13 12.3285 12.3284 13 11.5 13C10.6716 13 10 12.3285 10 11.5C10 10.6716 10.6716 10 11.5 10C12.3284 10 13 10.6716 13 11.5Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>{" "}
                    Share the page with friends to watch together
                  </div>
                )}
              </div>
              <div className="flex justify-center items-center">
                <button
                  className="btn | flex justify-center disabled:text-gray-400 dark:text-white disabled:dark:text-white/25"
                  disabled={episode === 0}
                  onClick={() => {
                    setEpisode((state) => state - 1);
                  }}
                >
                  <MdSkipPrevious size={24} />
                </button>
                <Select
                  defaultValue={1}
                  triggerAriaLabel="Episode Selector"
                  prefix="Episode "
                  value={String(episode)}
                  onValueChange={(value: number) => {
                    setPlayerState((state) => ({ ...state, ready: false }));

                    dispatchSyncChannelRef({
                      event: "episodes",
                      episode: value,
                      animeID: props.entry.id,
                    });
                    setEpisode(value);
                  }}
                  values={
                    isDubbed
                      ? episodesListDub.map((el: any) => el.number)
                      : episodesListSub.map((el: any) => el.number)
                  }
                />
                <button
                  className="btn | flex justify-center disabled:text-gray-400 dark:text-white disabled:dark:text-white/25"
                  disabled={
                    props.entry.episodes
                      ? episode + 1 === props.entry.episodes
                      : false
                  }
                  onClick={() => {
                    setEpisode((state) => state + 1);
                  }}
                >
                  <MdSkipNext size={24} />
                </button>
              </div>
              <div className="flex gap-2 items-center justify-end">
                <label
                  className="text-offWhite-900 dark:text-offWhite-100"
                  htmlFor="Dubbed-Subbed Toggle"
                >
                  {isDubbed ? "Dubbed" : "Subbed"}
                </label>
                <Switch
                  checked={isDubbed}
                  onChecked={setIsDubbed}
                  disabled={episodesListDub.length === 0}
                />
              </div>
            </div>
            <ToastPrimitive.Root
              open={openToast}
              onOpenChange={setOpenToast}
              className={cx(
                "z-50 fixed bottom-4 inset-x-4 w-auto md:bottom-4 md:right-4 md:left-auto md:top-auto md:w-full md:max-w-sm shadow-lg rounded-lg",
                "bg-white dark:bg-offWhite-800",
                "radix-state-open:animate-toast-slide-in-bottom md:radix-state-open:animate-toast-slide-in-right",
                "radix-state-closed:animate-toast-hide",
                "radix-swipe-end:animate-toast-swipe-out",
                "translate-x-radix-toast-swipe-move-x",
                "radix-swipe-cancel:translate-x-0 radix-swipe-cancel:duration-200 radix-swipe-cancel:ease-[ease]",
                "focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
              )}
            >
              <div className="flex">
                <div className="w-0 flex-1 flex items-center pl-5 py-4">
                  <div className="w-full radix">
                    <ToastPrimitive.Title className="text-sm font-medium text-offWhite-900 dark:text-offWhite-100">
                      Episode Updated
                    </ToastPrimitive.Title>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex flex-col px-3 py-2 space-y-1">
                    <div className="h-0 flex-1 flex">
                      <ToastPrimitive.Close
                        asChild
                        className="w-full border border-transparent rounded-lg px-3 py-2 flex items-center justify-center text-sm font-medium text-offWhite-700 dark:text-offWhite-100 hover:bg-offWhite-50 dark:hover:bg-offWhite-900 focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                      >
                        <button className="btn dark:text-white">
                          <MdClose />
                        </button>
                      </ToastPrimitive.Close>
                    </div>
                  </div>
                </div>
              </div>
            </ToastPrimitive.Root>

            <ToastPrimitive.Viewport />
          </ToastPrimitive.Provider>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Streaming;
