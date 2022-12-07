"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { userContext } from "../../app/UserContext";
import VideoPlayer from "./VideoPlayer";
import VideoPlayerSkeleton from "./VideoPlayerSkeleton";
import _ from "lodash";
import { median } from "../../utils/median";
import Switch from "../../primitives/Switch";
type Props = {
  entry: any;
  syncCode: string | undefined;
};

const Streaming = (props: Props) => {
  const user = useContext(userContext);
  const [fetching, setFetching] = useState<boolean>(true);
  const [isDubbed, setIsDubbed] = useState<boolean>(
    user.userPreferenceDubbed || false
  );
  const [episodesListSub, setEpisodeListSub] = useState<any>([]);
  const [episodesListDub, setEpisodeListDub] = useState<any>([]);
  const [episode, setEpisode] = useState(0);
  const syncCode = props.syncCode || uuidv4();

  let locked = false;
  let episodeLock = false;

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
  const [_seekTo, setSeekTo] = useState({ to: 0, type: "fraction" });

  const seekTo = (to: any, type = "seconds") => {
    setSeekTo({ to, type });
    videoPlayer.current?.seekTo(to, type);
  };

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

  return (
    <>
      <div>
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
              (isDubbed ? episodesListDub.length : episodesListSub.length) >=
              episode
            }
            onNextEpisode={() => {
              setEpisode((state) => state + 1);
            }}
            seekTo={seekTo}
          />
        )}
        <div className="flex">
          <label
            className="Label"
            htmlFor="Dubbed-Subbed Toggle"
            style={{ paddingRight: 15 }}
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
    </>
  );
};

export default Streaming;
