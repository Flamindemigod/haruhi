"use client";
import { Category, Media, Season } from "~/types.shared/anilist";
import useSwipe from "~/app/hooks/useSwipe";
import Card, { Props as CardProps } from "../Card";

type Props = {
  season: Exclude<Season, Season.any>;
  year: number;
  setPrevSeason: () => void;
  setNextSeason: () => void;
  setCurrentSeason: () => void;
  data: Media[];
};

export default (props: Props) => {
  const { SwipeBlob } = useSwipe({
    text: {
      left: "Go To\nPrevious\nSeason",
      right: "Go To\nNext\nSeason",
    },
    onSwipedLeft: props.setPrevSeason,
    onSwipedRight: props.setNextSeason,
  });
  return (
    <>
      {SwipeBlob}
      {props.season} - {props.year}
      <div className="grid grid-cols-3 place-items-center">
        {props.data.map((m, i) => (
          <Card data={m as CardProps["data"]} key={i} type={Category.anime} />
        ))}
      </div>
    </>
  );
};
