"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Fragment, useContext, useState } from "react";
import Grid from "../../../primitives/Grid";
import Switch from "../../../primitives/Switch";
import { userContext } from "../../UserContext";
import * as SelectPrimitive from "@radix-ui/react-select";
import cx from "classnames";
import Loading from "../../loading";
import Card from "../../../components/CardMain";
interface Tab {
  title: string;
  value: string;
}
const sortValues: Tab[] = [
  { title: "ID", value: "ID" },
  { title: "ID Descending", value: "ID_DESC" },
  { title: "Title Romaji", value: "TITLE_ROMAJI" },
  { title: "Title Romaji Descending", value: "TITLE_ROMAJI_DESC" },
  { title: "Title English", value: "TITLE_ENGLISH" },
  { title: "Title English Descending", value: "TITLE_ENGLISH_DESC" },
  { title: "Title Native", value: "TITLE_NATIVE" },
  { title: "Title Native Descending", value: "TITLE_NATIVE_DESC" },
  { title: "Type", value: "TYPE" },
  { title: "Type Descending", value: "TYPE_DESC" },
  { title: "Format", value: "FORMAT" },
  { title: "Format Descending", value: "FORMAT_DESC" },
  { title: "Start Date", value: "START_DATE" },
  { title: "Start Date Descending", value: "START_DATE_DESC" },
  { title: "End Date", value: "END_DATE" },
  { title: "End Date Descending", value: "END_DATE_DESC" },
  { title: "Score", value: "SCORE" },
  { title: "Score Descending", value: "SCORE_DESC" },
  { title: "Popularity", value: "POPULARITY" },
  { title: "Popularity Descending", value: "POPULARITY_DESC" },
  { title: "Trending", value: "TRENDING" },
  { title: "Trending Descending", value: "TRENDING_DESC" },
  { title: "Episodes", value: "EPISODES" },
  { title: "Episodes Descending", value: "EPISODES_DESC" },
  { title: "Duration", value: "DURATION" },
  { title: "Duration Descending", value: "DURATION_DESC" },
  { title: "Status", value: "STATUS" },
  { title: "Status Descending", value: "STATUS_DESC" },
  { title: "Chapters", value: "CHAPTERS" },
  { title: "Chapters Descending", value: "CHAPTERS_DESC" },
  { title: "Volumes", value: "VOLUMES" },
  { title: "Volumes Descending", value: "VOLUMES_DESC" },
  { title: "Updated At", value: "UPDATED_AT" },
  { title: "Updated At Descending", value: "UPDATED_AT_DESC" },
  { title: "Favorites", value: "FAVOURITES" },
  { title: "Favorites Descending", value: "FAVOURITES_DESC" },
];

export const PageInner = (params: {slug: String}) => {
    const user = useContext(userContext);
    const [language, setLanguage] = useState<string>("Japanese");
    const [onList, setOnList] = useState<boolean>(false);
    const [sort, setSort] = useState<
      | "ID"
      | "ID_DESC"
      | "TITLE_ROMAJI"
      | "TITLE_ROMAJI_DESC"
      | "TITLE_ENGLISH"
      | "TITLE_ENGLISH_DESC"
      | "TITLE_NATIVE"
      | "TITLE_NATIVE_DESC"
      | "TYPE"
      | "TYPE_DESC"
      | "FORMAT"
      | "FORMAT_DESC"
      | "START_DATE"
      | "START_DATE_DESC"
      | "END_DATE"
      | "END_DATE_DESC"
      | "SCORE"
      | "SCORE_DESC"
      | "POPULARITY"
      | "POPULARITY_DESC"
      | "TRENDING"
      | "TRENDING_DESC"
      | "EPISODES"
      | "EPISODES_DESC"
      | "DURATION"
      | "DURATION_DESC"
      | "STATUS"
      | "STATUS_DESC"
      | "CHAPTERS"
      | "CHAPTERS_DESC"
      | "VOLUMES"
      | "VOLUMES_DESC"
      | "UPDATED_AT"
      | "UPDATED_AT_DESC"
      | "SEARCH_MATCH"
      | "FAVOURITES"
      | "FAVOURITES_DESC"
    >("START_DATE_DESC");
    const {
      isLoading,
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
    } = useInfiniteQuery({
      queryKey: ["studio", params.slug, onList, sort],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER}/api/getStudio?id=${
            params.slug
          }&page=${pageParam}${onList ? "&onList=true" : ""}&sort=${sort}`
        );
        return res.json();
      },
      getNextPageParam: (lastPage, pages) => {
        return lastPage.data.Studio.media.pageInfo.hasNextPage
          ? lastPage.data.Studio.media.pageInfo.currentPage + 1
          : false;
      },
    });
  
    if (isLoading) {
      return <Loading />;
    }
  
    return (
      <div className="dark:text-white">
        <div className="p-4">
          <div className="flex justify-center sm:px-16 sm:flex-row flex-col">
            <div className="flex flex-col p-4 justify-center">
              <div className="px-8 text-3xl">
                {data?.pages[0].data.Studio.name}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end flex-wrap gap-4 p-4">
          <div className="flex items-center gap-2">
            <label>On list</label>
            <Switch
              checked={onList}
              onChecked={setOnList}
              disabled={!user.userAuth}
            />
          </div>
          <div>
            <SelectPrimitive.Root
              value={sort}
              onValueChange={(val: any) => {
                setSort(val);
              }}
            >
              <SelectPrimitive.Trigger asChild aria-label={"Sort Selector"}>
                <button
                  className={cx(
                    "flex gap-2 justify-center items-center p-2 font-medium text-white rounded-md",
                    "bg-primary-500 w-full"
                  )}
                >
                  <SelectPrimitive.Value />
                  <SelectPrimitive.Icon className="">
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </SelectPrimitive.Icon>
                </button>
              </SelectPrimitive.Trigger>
              <SelectPrimitive.Content className="z-20">
                <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-offWhite-700 dark:text-offWhite-300">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.18179 8.81819C4.00605 8.64245 4.00605 8.35753 4.18179 8.18179L7.18179 5.18179C7.26618 5.0974 7.38064 5.04999 7.49999 5.04999C7.61933 5.04999 7.73379 5.0974 7.81819 5.18179L10.8182 8.18179C10.9939 8.35753 10.9939 8.64245 10.8182 8.81819C10.6424 8.99392 10.3575 8.99392 10.1818 8.81819L7.49999 6.13638L4.81819 8.81819C4.64245 8.99392 4.35753 8.99392 4.18179 8.81819Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </SelectPrimitive.ScrollUpButton>
                <SelectPrimitive.Viewport className="bg-white dark:bg-offWhite-800 p-2 rounded-lg shadow-lg relative z-50">
                  <SelectPrimitive.Group>
                    {sortValues.map((f, i) => (
                      <SelectPrimitive.Item
                        key={`${f}-${i}`}
                        value={f.value}
                        className={cx(
                          "relative flex items-center px-8 py-2 rounded-md text-sm text-offWhite-700 dark:text-offWhite-300 font-medium focus:bg-offWhite-100 dark:focus:bg-offWhite-900",
                          "radix-disabled:opacity-50",
                          "focus:outline-none select-none"
                        )}
                      >
                        <SelectPrimitive.ItemText>
                          {f.title}
                        </SelectPrimitive.ItemText>
                        <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
                              fill="currentColor"
                              fillRule="evenodd"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        </SelectPrimitive.ItemIndicator>
                      </SelectPrimitive.Item>
                    ))}
                  </SelectPrimitive.Group>
                </SelectPrimitive.Viewport>
                <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-offWhite-700 dark:text-offWhite-300">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.18179 6.18181C4.35753 6.00608 4.64245 6.00608 4.81819 6.18181L7.49999 8.86362L10.1818 6.18181C10.3575 6.00608 10.6424 6.00608 10.8182 6.18181C10.9939 6.35755 10.9939 6.64247 10.8182 6.81821L7.81819 9.81821C7.73379 9.9026 7.61934 9.95001 7.49999 9.95001C7.38064 9.95001 7.26618 9.9026 7.18179 9.81821L4.18179 6.81821C4.00605 6.64247 4.00605 6.35755 4.18179 6.18181Z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </SelectPrimitive.ScrollDownButton>
              </SelectPrimitive.Content>
            </SelectPrimitive.Root>
          </div>
        </div>
        <Grid>
          {data?.pages.map((page: any, index: number) => (
            <Fragment key={index}>
              {page.data.Studio.media.edges.map((edge: any) => (
                <Card
                  key={edge.node.id}
                  href={`/${String(edge.node.type).toLowerCase()}/${
                    edge.node.id
                  }`}
                  imgWidth={156}
                  imgHeight={220}
                  imgSrcSmall={edge.node.coverImage.medium}
                  imgSrc={edge.node.coverImage.large}
                  contentTitle={edge.node.title.userPreferred}
                  contentTitleEnglish={edge.node.title.english}
                  contentSubtitle={edge.node.description}
                  contentProgress={edge.node.mediaListEntry?.progress}
                  contentEpisodes={
                    edge.node.type === "MANGA"
                      ? edge.node.chapters
                      : edge.node.episodes
                  }
                  contentNextAiringEpisode={edge.node.nextAiringEpisode?.episode}
                  contentNextAiringEpisodeTime={
                    edge.node.nextAiringEpisode?.timeUntilAiring
                  }
                  contentFormat={edge.node.format.replaceAll("_", " ")}
                  contentType={edge.node.type}
                  contentStatus={edge.node.status.replaceAll("_", " ")}
                />
              ))}
            </Fragment>
          ))}
        </Grid>
        {hasNextPage && (
          <button
            className="btn | bg-primary-500 w-full"
            onClick={() => {
              fetchNextPage();
            }}
          >
            Load More
          </button>
        )}
      </div>
    );
}