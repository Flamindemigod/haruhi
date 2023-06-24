"use client";

import { useEffect, useState } from "react";
import Card from "../CardMain";
import Carosel from "../../primitives/Carosel";
const Popular = ({ season, type }: { season?: boolean; type: string }) => {
  const [animeArray, setAnimeArray] = useState<any[]>([]);
  const fetchTrending = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/getPopular?type=${type}${
        season ? "&season" : ""
      }`
    ).then((res) => res.json());
    setAnimeArray(data);
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="bg-offWhite-50 dark:bg-offWhite-900 relative z-0">
      <div className="text-xl p-2 text-black dark:text-offWhite-100 capitalize">
        Popular {type.toLowerCase()} {season && "This Season"}
      </div>
      <Carosel width="95vw" height={270}>
        {animeArray.map((el: any) => (
          <Card
            key={el.id}
            href={`/${String(el.type).toLowerCase()}/${el.id}`}
            imgWidth={156}
            imgHeight={220}
            imgSrc={el.coverImage.large}
            imgSrcSmall={el.coverImage.medium}
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
            contentFormat={el.format?.replaceAll("_", " ")}
            contentType={el.type}
            contentStatus={el.status?.replaceAll("_", " ")}
          />
        ))}
      </Carosel>
    </div>
  );
};

export default Popular;
