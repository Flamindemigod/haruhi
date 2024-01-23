"use client";

import { Category, ListSort, ListStatus, Media } from "~/types.shared/anilist";
import CardGrid, { Props as GridProps } from "../../CardGrid";
import ListSelectorMobile from "./List.Selector.Mobile";

type Props = {
  list: ListStatus;
  sort: ListSort;
  type: Category.anime | Category.manga;
  setParams: (list: ListStatus, sort: ListSort) => void;
  data: Media[];
  onReachBottom: () => void;
  isFetching: boolean;
};

export default (props: Props) => {
  return (
    <>
      <CardGrid
        isFetching={props.isFetching}
        type={props.type}
        data={props.data as GridProps["data"]}
        onReachBottom={props.onReachBottom}
        fallback="Fetching Seasonal Data"
      />
      <ListSelectorMobile {...props} />
    </>
  );
};
