"use client";
import cx from "classnames";
import { useContext, useRef, useState } from "react";
import Background from "../../components/Background";
import List from "../../components/Lists/List";
import useIntersectionObserver from "../../utils/useIntersectionObserver";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import * as SelectPrimitive from "@radix-ui/react-select";
import { useQueryClient } from "@tanstack/react-query";
import { userContext } from "../UserContext";


export const PageInner = () => {
    const user = useContext(userContext);
  const [list, setList] = useState<
    "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED"
  >("CURRENT");
  const queryClient = useQueryClient();
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
  const sortValues: Tab[] = [
    { title: "ID", value: "MEDIA_ID" },
    { title: "ID Descending", value: "MEDIA_ID_DESC" },
    { title: "Score", value: "SCORE" },
    { title: "Score Descending", value: "SCORE_DESC" },
    { title: "Progress", value: "PROGRESS" },
    { title: "Progress Descending", value: "PROGRESS_DESC" },
    { title: "Rewatches", value: "REPEAT" },
    { title: "Rewatches Descending", value: "REPEAT_DESC" },
    { title: "Priority", value: "PRIORITY" },
    { title: "Priority Descending", value: "PRIORITY_DESC" },
    { title: "Started On", value: "STARTED_ON" },
    { title: "Started On Descending", value: "STARTED_ON_DESC" },
    { title: "Completed On", value: "FINISHED_ON" },
    { title: "Completed On Descending", value: "FINISHED_ON_DESC" },
    { title: "Added Time", value: "ADDED_TIME" },
    { title: "Added Time Descending", value: "ADDED_TIME_DESC" },
    { title: "Updated Time", value: "UPDATED_TIME" },
    { title: "Updated Time Descending", value: "UPDATED_TIME_DESC" },
    { title: "Title Romaji", value: "MEDIA_TITLE_ROMAJI" },
    { title: "Title Romaji Descending", value: "MEDIA_TITLE_ROMAJI_DESC" },
    { title: "Title English", value: "MEDIA_TITLE_ENGLISH" },
    { title: "Title English Descending", value: "MEDIA_TITLE_ENGLISH_DESC" },
    { title: "Title Native", value: "MEDIA_TITLE_NATIVE" },
    { title: "Title Native Descending", value: "MEDIA_TITLE_NATIVE_DESC" },
    { title: "Popularity", value: "MEDIA_POPULARITY" },
    { title: "Popularity Descending", value: "MEDIA_POPULARITY_DESC" },
  ];
  return (
    <div className="relative flex flex-col md:flex-row bg-black/50">
      <Background
        classes="fixed inset-0"
        backgroundImage="/haruhiHomeBg.webp"
      />
      {user.userAuth ? (
        <>
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
            <div className="dark:text-white justify-center items-center mt-2 p-2">
              <div className="text-xl">Sort</div>
              <div className="flex gap-2">
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
          </div>
          {/* Content */}
          <div className="sm:p-4" style={{ flexBasis: "0", flexGrow: "999" }}>
            <List type="MANGA" sort={sort} list={list} isBottom={isBottom} />
            <div ref={bottomRef}></div>
          </div>
        </>
      ) : (
        <div className="w-full text-3xl dark:text-white text-center">
          You need to be logged in to see this page
        </div>
      )}
    </div>
  );
}