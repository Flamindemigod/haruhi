"use client";
import { Category, Media, Season } from "~/types.shared/anilist";
import useSwipe from "~/app/hooks/useSwipe";
import CardGrid, { Props as GridProps } from "../CardGrid";
import SeasonSelectorMobile from "./Season.Selector.Mobile";

type Props = {
  season: Exclude<Season, Season.any>;
  year: number;
  setPrevSeason: () => void;
  setNextSeason: () => void;
  setCurrentSeason: () => void;
  setSeason: (season: Exclude<Season, Season.any>, year: number) => void;
  data: Media[];
  onReachBottom: () => void;
  isFetching: boolean;
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
      <CardGrid
        isFetching={props.isFetching}
        type={Category.anime}
        data={props.data as GridProps["data"]}
        onReachBottom={props.onReachBottom}
        fallback="Fetching More Data"
      />
      <SeasonSelectorMobile
        season={props.season}
        year={props.year}
        setSeason={props.setSeason}
      />
    </>
  );
};
