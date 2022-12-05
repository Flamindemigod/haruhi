"use client";

import { useEffect, useState } from "react";
import Card from "../../Components/CardMain";
import Carosel from "../../primitives/Carosel";

const Trending = ({ season, type }: { season?: boolean; type: string }) => {
  const [animeArray, setAnimeArray] = useState<any[]>([]);
  const fetchTrending = async () => {
    const data = await fetch(
      `http://136.243.175.33:8080/api/getTrending?type=${type}${
        season ? "&season" : ""
      }`
    ).then((res) => res.json());
    setAnimeArray(animeArray);
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="bg-white dark:bg-offWhite-900 relative z-0">
      <div className="text-xl p-2 text-black dark:text-offWhite-100 capitalize">
        Trending {type.toLowerCase()} {season && "This Season"}
      </div>
      <Carosel width="95vw" height={270}>
        {animeArray.map((el: any) => (
          <Card
            key={el.id}
            href={`/${el.id}`}
            imgWidth={156}
            imgHeight={220}
            imgSrc={el.coverImage.large}
            contentTitle={el.title.userPreferred}
            contentTitleEnglish={el.title.english}
            contentSubtitle={el.description}
            contentProgress={0}
            contentEpisodes={el.format === "MANGA" ? el.chapters : el.episodes}
            contentNextAiringEpisode={
              el.nextAiring && el.nextAiring.node.episode
            }
            contentNextAiringEpisodeTime={
              el.nextAiring && el.nextAiring.node.timeUntilAiring
            }
            contentType={el.format}
            contentStatus={el.status}
          />
        ))}
      </Carosel>
    </div>
  );
};

export default Trending;
