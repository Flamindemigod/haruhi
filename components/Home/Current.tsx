"use client";

import { useContext, useEffect, useState } from "react";
import { userContext } from "../../app/UserContext";
import Card from "../CardMain";
import Carosel from "../../primitives/Carosel";
const Current = ({ type }: { type: string }) => {
  const user = useContext(userContext);
  const [animeArray, setAnimeArray] = useState<any[]>([]);

  const fetchUserData = async () => {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER}/api/getList?username=${user.userName}&type=${type}&status=CURRENT`
    ).then((res) => res.json());
    setAnimeArray(data.Page.mediaList);
  };

  useEffect(() => {
    if (user.userAuth) {
      fetchUserData();
    }
  }, [user]);
  return (
    <>
      {user.userAuth && animeArray.length !== 0 ? (
        <div className="bg-offWhite-50 dark:bg-offWhite-900 ">
          <div className="text-xl p-2 text-black dark:text-offWhite-100 capitalize">
            {type.toLowerCase()} In Progress
          </div>
          <Carosel width="95vw" height={270}>
            {animeArray.map((el) => (
              <Card
                key={el.media.id}
                href={`/${String(el.media.type).toLowerCase()}/${el.media.id}`}
                imgWidth={156}
                imgHeight={220}
                imgSrcSmall={el.media.coverImage.medium}
                imgSrc={el.media.coverImage.large}
                contentTitle={el.media.title.userPreferred}
                contentTitleEnglish={el.media.title.english}
                contentSubtitle={el.media.description}
                contentProgress={el.progress}
                contentEpisodes={
                  el.media.type === "MANGA"
                    ? el.media.chapters
                    : el.media.episodes
                }
                contentNextAiringEpisode={
                  el.media.nextAiring && el.media.nextAiring.node.episode
                }
                contentNextAiringEpisodeTime={
                  el.media.nextAiring &&
                  el.media.nextAiring.node.timeUntilAiring
                }
                contentFormat={el.media.format?.replaceAll("_", " ")}
                contentType={el.media.type}
                contentStatus={el.media.status?.replaceAll("_", " ")}
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

export default Current;
