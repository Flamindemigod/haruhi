"use client";

import { Category, ListSort, ListStatus, Media } from "~/types.shared/anilist";
import CardGrid, { Props as GridProps } from "../../CardGrid";
import ListSelectorDesktop from "./List.Selector.Desktop";

type Props = {
  list: ListStatus;
  sort: ListSort;
  type: Category.Anime | Category.Manga;
  setParams: (list: ListStatus, sort: ListSort) => void;
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
        <ListSelectorDesktop {...props} />
      </div>
      <CardGrid
        isFetching={props.isFetching}
        type={props.type}
        data={props.data as GridProps["data"]}
        onReachBottom={props.onReachBottom}
        fallback="Fetching Seasonal Data"
      />
    </div>
  );
};
