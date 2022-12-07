import React from "react";
import { Circles } from "react-loader-spinner";

const VideoPlayerSkeleton = () => {
  return (
    <div className="relative">
      <div className="w-full aspect-video bg-black text-white bg-opacity-30 animate-pulse grid place-content-center"></div>
      <div className="absolute top-1/2 left-1/2 text-white -translate-x-1/2 -translate-y-1/2">
        <Circles color="var(--clr-primary)" />
      </div>
    </div>
  );
};

export default VideoPlayerSkeleton;
