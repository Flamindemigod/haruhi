"use client";

import { Category, Media } from "~/types.shared/anilist";
import { SelectNonNullableFields } from "../utils/typescript-utils";
import { useState } from "react";
import Carosel from "~/primitives/Carosel";
import Card from "./Card";
import ViewSegment from "./ViewSegment";

type CardMedia = Pick<
  Media,
  | "coverImage"
  | "title"
  | "nextAiringEpisode"
  | "mediaListEntry"
  | "episodes"
  | "status"
  | "duration"
  | "averageScore"
  | "format"
  | "genres"
  | "isAdult"
  | "description"
  | "id"
  | "season"
  | "seasonYear"
  | "chapters"
  | "volumes"
>;

export type Props = {
  type: Category.anime | Category.manga;
  data: SelectNonNullableFields<
    CardMedia,
    keyof Omit<
      CardMedia,
      | "airingSchedule"
      | "mediaListEntry"
      | "averageScore"
      | "season"
      | "seasonYear"
      | "status"
      | "format"
    >
  >[];
};

export type SegmentProps = {
  title?: string;
  type: Category.anime | Category.manga;
  data: Props["data"];
};

export const Segment = (props: SegmentProps) => (
  <ViewSegment title={props.title}>
    <CardCarosel type={props.type} data={props.data} />
  </ViewSegment>
);

const CardCarosel = (props: Props) => {
  const [reset, setReset] = useState<boolean>(false);
  return (
    <>
      <Carosel height={"clamp(150px, 100%, 210px)"}>
        {props.data.map((d) => (
          <Card
            reset={reset}
            onReset={() => {
              setReset((state) => !state);
            }}
            data={d}
            type={props.type}
            key={d.id}
          />
        ))}
      </Carosel>
    </>
  );
};

export default CardCarosel;
