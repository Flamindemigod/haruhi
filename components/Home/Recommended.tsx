"use client";

import { useContext, useEffect, useState } from "react";
import { userContext } from "../../app/UserContext";
import Card from "../CardMain";
import Carosel from "../../primitives/Carosel";
const Recommended = ({ type }: { type: string }) => {
  const user = useContext(userContext);
  const [animeArray, setAnimeArray] = useState<any[]>([]);

  const fetchUserData = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/getRecommended?username=${user.userName}&type=${type}`
    ).then((res) => res.json());
    setAnimeArray(data);
  };

  useEffect(() => {
    if (user.userAuth) {
      fetchUserData();
    }
  }, [user]);
  return (
    <>
      {user.userAuth && animeArray.length !== 0 ? (
        <div className="bg-offWhite-50 dark:bg-offWhite-900 relative z-0">
          <div className="text-xl p-2 text-black dark:text-offWhite-100 capitalize">
            {type.toLowerCase()} You Might Like
          </div>
          <Carosel width="95vw" height={270}>
            {animeArray.map((el) => (
              <Card
                key={el.id}
                href={`/${String(el.type).toLowerCase()}/${el.id}`}
                imgWidth={156}
                imgHeight={220}
                imgSrcSmall={el.coverImage.medium}
                imgSrc={el.coverImage.large}
                contentTitle={el.title.userPreferred}
                contentTitleEnglish={el.title.english}
                contentSubtitle={el.description}
                contentProgress={0}
                contentEpisodes={
                  el.format === "MANGA" ? el.chapters : el.episodes
                }
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
      ) : (
        <></>
      )}
    </>
  );
};

export default Recommended;
