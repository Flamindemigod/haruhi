"use client";

import { Category, Media, Season } from "~/types.shared/anilist";
import CardGrid, { Props as GridProps } from "../CardGrid";
import SeasonSelectorDesktop from "./Season.Selector.Desktop";

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
  return (
    <div className="flex gap-2">
      <div
        className="sticky top-2 flex w-full max-w-[15rem] flex-col gap-2 p-2"
        style={{ alignSelf: "flex-start" }}
      >
        <SeasonSelectorDesktop
          year={props.year}
          season={props.season}
          setSeason={props.setSeason}
          setCurrentSeason={props.setCurrentSeason}
        />
      </div>
      <CardGrid
        isFetching={props.isFetching}
        type={Category.anime}
        data={props.data as GridProps["data"]}
        onReachBottom={props.onReachBottom}
        fallback="Fetching Seasonal Data"
      />
    </div>
  );
};
