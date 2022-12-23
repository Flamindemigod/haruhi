import React from "react";
const Hero = () => {
  return (
    <div className="h-[60vh] flex flex-col justify-center gap-2 text-white p-12 bg-black/75 rounded-md w-full relative">
      <h3 className="text-3xl font-georama font-medium">Welcome To Haruhi</h3>
      <p className="font-georama text-lg">
        A next gen anime and manga platform made for you with anilist
        integration to provide a seemless watching experience
      </p>
    </div>
  );
};

export default Hero;
