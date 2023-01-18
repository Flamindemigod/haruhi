"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { userContext } from "../../app/UserContext";
import ListEntry from "./ListEntry";
type Props = {
  type: "ANIME" | "MANGA";
  list: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED";

  sort:
    | "MEDIA_ID"
    | "MEDIA_ID_DESC"
    | "SCORE"
    | "SCORE_DESC"
    | "STATUS"
    | "STATUS_DESC"
    | "PROGRESS"
    | "PROGRESS_DESC"
    | "PROGRESS_VOLUMES"
    | "PROGRESS_VOLUMES_DESC"
    | "REPEAT"
    | "REPEAT_DESC"
    | "PRIORITY"
    | "PRIORITY_DESC"
    | "STARTED_ON"
    | "STARTED_ON_DESC"
    | "FINISHED_ON"
    | "FINISHED_ON_DESC"
    | "ADDED_TIME"
    | "ADDED_TIME_DESC"
    | "UPDATED_TIME"
    | "UPDATED_TIME_DESC"
    | "MEDIA_TITLE_ROMAJI"
    | "MEDIA_TITLE_ROMAJI_DESC"
    | "MEDIA_TITLE_ENGLISH"
    | "MEDIA_TITLE_ENGLISH_DESC"
    | "MEDIA_TITLE_NATIVE"
    | "MEDIA_TITLE_NATIVE_DESC"
    | "MEDIA_POPULARITY"
    | "MEDIA_POPULARITY_DESC";
  isBottom: boolean;
};

const List = (props: Props) => {
  const user = useContext(userContext);

  const {
    isLoading,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery({
    enabled: user.userAuth,
    queryKey: ["MediaList", props.type, props.list, props.sort],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER}/api/getList?type=${props.type}&status=${props.list}&username=${user.userName}&sort=${props.sort}&page=${pageParam}`
      );
      return res.json();
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.Page.pageInfo.hasNextPage
        ? lastPage.Page.pageInfo.currentPage + 1
        : false,
  });

  if (props.isBottom && hasNextPage) {
    fetchNextPage();
  }

  if (isLoading) {
    return <div className="dark:text-white">Loading....</div>;
  }
  return (
    <div
      className="grid gap-x-2 dark:text-white text-sm md:text-xl "
      style={{ gridTemplateColumns: "1fr 3fr 0.5fr 0.5fr 1fr" }}
    >
      <div
        className="grid col-span-full items-center bg-primary-600"
        style={{ gridTemplateColumns: "subgrid" }}
      >
        <div className=""></div>
        <div className="justify-self-start p-2">Title</div>
        <div className="justify-self-center">Score</div>
        <div className="justify-self-center">Format</div>
        <div className="justify-self-center">Progress</div>
      </div>
      {data?.pages.map((page: any, index: number) => (
        <React.Fragment key={index}>
          {page.Page.mediaList.map((el: any) => (
            <ListEntry key={el.media.id} entry={el} />
          ))}
        </React.Fragment>
      ))}
      {isFetchingNextPage && hasNextPage && (
        <div className="col-span-full justify-center">Loading More....</div>
      )}
    </div>
  );
};

export default List;
