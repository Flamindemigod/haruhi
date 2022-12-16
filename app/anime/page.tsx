"use client";
import cx from "classnames";
import { useRef, useState } from "react";
import Background from "../../components/Background";
import List from "../../components/Lists/List";
import useIntersectionObserver from "../../primitives/useIntersectionObserver";
import * as TabsPrimitive from "@radix-ui/react-tabs";
const page = () => {
  const [list, setList] = useState<
    "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED"
  >("CURRENT");
  const [sort, setSort] = useState<
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
    | "MEDIA_POPULARITY_DESC"
  >("UPDATED_TIME_DESC");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const bottom = useIntersectionObserver(bottomRef, {});
  const isBottom = !!bottom?.isIntersecting;
  interface Tab {
    title: string;
    value: string;
  }
  const tabs: Tab[] = [
    {
      title: "Current",
      value: "CURRENT",
    },
    {
      title: "Planning",
      value: "PLANNING",
    },
    {
      title: "Completed",
      value: "COMPLETED",
    },
    {
      title: "On Hold",
      value: "PAUSED",
    },
    {
      title: "Dropped",
      value: "DROPPED",
    },
  ];
  return (
    <div className="relative flex flex-wrap bg-black/50">
      <Background
        classes="fixed inset-0"
        backgroundImage="/haruhiHomeBg.webp"
      />
      {/* Sidebar */}
      <div className="flex-grow" style={{ flexBasis: "20rem" }}>
        <div className="dark:text-white justify-center items-center mt-16 p-2">
          <div className="text-xl">Lists</div>
          <TabsPrimitive.Root
            defaultValue="tab1"
            orientation="vertical"
            value={list}
            onValueChange={(val: any) => {
              setList(val);
            }}
          >
            <TabsPrimitive.List
              className={cx(
                "flex flex-col w-full bg-white dark:bg-offWhite-800/50"
              )}
            >
              {tabs.map(({ title, value }) => (
                <TabsPrimitive.Trigger
                  key={`tab-trigger-${value}`}
                  value={value}
                  className={cx(
                    "group",
                    "border-b ",
                    "border-offWhite-300 dark:border-offWhite-600",
                    "radix-state-active:border-r-primary-700 focus-visible:radix-state-active:border-r-transparent radix-state-inactive:bg-offWhite-50 dark:radix-state-active:border-r-primary-100 dark:radix-state-active:bg-offWhite-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-offWhite-800/50",
                    "flex-1 px-3 py-2.5",
                    "focus:radix-state-active:border-b-red",
                    "focus:z-10 focus:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
                  )}
                >
                  <span
                    className={cx(
                      "text-sm font-medium",
                      "text-offWhite-700 dark:text-offWhite-100"
                    )}
                  >
                    {title}
                  </span>
                </TabsPrimitive.Trigger>
              ))}
            </TabsPrimitive.List>
          </TabsPrimitive.Root>
        </div>
      </div>
      {/* Content */}
      <div className="sm:p-4" style={{ flexBasis: "0", flexGrow: "999" }}>
        <List type="ANIME" sort={sort} list={list} isBottom={isBottom} />
        <div ref={bottomRef}></div>
      </div>
    </div>
  );
};

export default page;
