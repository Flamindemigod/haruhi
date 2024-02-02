"use client";

import { Category, Media } from "~/types.shared/anilist";
import { SelectNonNullableFields } from "../utils/typescript-utils";
import Carosel from "~/primitives/Carosel";
import Card from "./Card";
import ViewSegment from "./ViewSegment";
import { ThreeCircles } from "react-loader-spinner";

type CardMedia = Pick<
  Media,
  | "bannerImage"
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
  type: Category.Anime | Category.Manga;
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
  type: Category.Anime | Category.Manga;
  data: Props["data"];
};

export const Segment = (props: SegmentProps) => (
  <ViewSegment title={props.title}>
    <CardCarosel type={props.type} data={props.data} />
  </ViewSegment>
);

export const SegmentFallback = (
  props: Omit<SegmentProps, "data" | "type"> & { fallback?: string },
) => (
  <ViewSegment title={props.title}>
    <div className="flex h-32 items-center  justify-center gap-4 py-2 sm:h-48 md:h-64">
      <ThreeCircles
        height="100%"
        color="var(--clr-primary)"
        wrapperClass="items-center justify-center flex-shrink p-2"
        visible={true}
        ariaLabel="three-circles-rotating"
      />
      <span className="p-2 text-lg font-medium text-primary-500 md:text-xl">
        {props.fallback}
      </span>
    </div>
  </ViewSegment>
);

const CardCarosel = (props: Props) => {
  return (
    <Carosel height={"clamp(150px, 100%, 210px)"}>
      {props.data.map((d) => (
        <Card data={d} type={props.type} key={d.id} />
      ))}
    </Carosel>
  );
};

export default CardCarosel;
