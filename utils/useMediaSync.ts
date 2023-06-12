import { useEffect, useRef } from "react";
import { supabase } from "./supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";
import _ from "lodash";

const useMediaSync = (
  syncCode: string,
  validationFunction: (payload:any) => boolean,
  syncPlaying: (payload: any) => void,
  syncPlayed: (payload: any) => void,
  syncSeekTo: (payload: any) => void,
  syncEpisodes: (payload: any) => void,
  syncPlaybackrate: (payload: any) => void
) => {
  const syncChannelRef = useRef<RealtimeChannel | null>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  

  useEffect(() => {
    if (!syncCode) return;

    syncChannelRef.current = supabase.channel(syncCode);
    syncChannelRef.current
      .on("broadcast", { event: "playing" }, (e)=>{if(validationFunction(e)){syncPlaying(e)}})
      .on("broadcast", { event: "played" }, (e)=>{if(validationFunction(e)){syncPlayed(e)}})
      .on("broadcast", { event: "seekTo" }, (e)=>{if(validationFunction(e)){syncSeekTo(e)}})
      .on("broadcast", { event: "episodes" }, (e)=>{if(validationFunction(e)){syncEpisodes(e)}})
      .on("broadcast", { event: "playbackRate" }, (e)=>{if(validationFunction(e)){syncPlaybackrate(e)}})
      .subscribe();

    return () => {
      supabase.removeChannel(syncChannelRef.current!);
      // syncChannelRef.current.unsubscribe();
    };
  }, []);
  const dispatchSyncChannelRef = (props: any) => {
    if (syncChannelRef.current) {
      syncChannelRef.current.send({
        type: "broadcast",
        ...props,
      });
    }
  };
  return dispatchSyncChannelRef;
};

export default useMediaSync;
