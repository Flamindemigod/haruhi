"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { userContext } from "../../app/UserContext";
import Grid from "../../primitives/Grid";
import Card from "../CardMain";
type Props = {
  season: string;
  year: number;
};

const Lists = (props: Props) => {
  const user = useContext(userContext);
  const { data, isLoading } = useQuery({
    queryKey: ["Seasonal", props.season, props.year, user.userShowAdult],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/getSeasonal?season=${props.season}&year=${props.year}&adult=${user.userShowAdult}`
      );
      return res.json();
    },
  });
  if (isLoading) {
    return <div>Loading....</div>;
  }
  return (
    <Grid>
      {data.map((el: any) => (
        <div key={el.id} className="flex justify-center items-center">
          <Card
            cardDirection="bottom"
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
        </div>
      ))}
    </Grid>
  );
};

export default Lists;
