"use client";

import List from "../../components/Lists/List";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import useIntersectionObserver from "../../primitives/useIntersectionObserver";
import cx from "classnames";
import { useRef } from "react";

interface Tab {
  title: string;
  value: string;
}

const page = () => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const bottom = useIntersectionObserver(bottomRef, {});
  const isBottom = !!bottom?.isIntersecting;
  const tabs: Tab[] = [
    {
      title: "Current",
      value: "tab1",
    },
    {
      title: "Planning",
      value: "tab2",
    },

    {
      title: "Completed",
      value: "tab3",
    },
    {
      title: "On Hold",
      value: "tab4",
    },
    {
      title: "Dropped",
      value: "tab5",
    },
  ];
  return (
    <div className="relative ">
      <TabsPrimitive.Root defaultValue="tab1">
        <TabsPrimitive.List
          className={cx(
            "flex w-full rounded-t-lg bg-white dark:bg-offWhite-800"
          )}
        >
          {tabs.map(({ title, value }) => (
            <TabsPrimitive.Trigger
              key={`tab-trigger-${value}`}
              value={value}
              className={cx(
                "group",
                "first:rounded-tl-lg last:rounded-tr-lg",
                "border-b first:border-r last:border-l",
                "border-offWhite-300 dark:border-offWhite-600",
                "radix-state-active:border-b-offWhite-700 focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-offWhite-50 dark:radix-state-active:border-b-offWhite-100 dark:radix-state-active:bg-offWhite-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-offWhite-800",
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

        <TabsPrimitive.Content
          key={`tab-content-1`}
          value={"tab1"}
          className={cx("rounded-b-lg bg-white py-4 dark:bg-offWhite-800")}
        >
          <List
            isBottom={isBottom}
            list={"CURRENT"}
            type={"ANIME"}
            sort={"UPDATED_TIME_DESC"}
          />
        </TabsPrimitive.Content>
        <TabsPrimitive.Content
          key={`tab-content-2`}
          value={"tab2"}
          className={cx("rounded-b-lg bg-white py-4 dark:bg-offWhite-800")}
        >
          <List
            isBottom={isBottom}
            list={"PLANNING"}
            type={"ANIME"}
            sort={"UPDATED_TIME_DESC"}
          />
        </TabsPrimitive.Content>
        <TabsPrimitive.Content
          key={`tab-content-3`}
          value={"tab3"}
          className={cx("rounded-b-lg bg-white py-4 dark:bg-offWhite-800")}
        >
          <List
            isBottom={isBottom}
            list={"COMPLETED"}
            type={"ANIME"}
            sort={"UPDATED_TIME_DESC"}
          />
        </TabsPrimitive.Content>
        <TabsPrimitive.Content
          key={`tab-content-4`}
          value={"tab4"}
          className={cx("rounded-b-lg bg-white py-4 dark:bg-offWhite-800")}
        >
          <List
            isBottom={isBottom}
            list={"PAUSED"}
            type={"ANIME"}
            sort={"UPDATED_TIME_DESC"}
          />
        </TabsPrimitive.Content>
        <TabsPrimitive.Content
          key={`tab-content-5`}
          value={"tab5"}
          className={cx("rounded-b-lg bg-white py-4 dark:bg-offWhite-800")}
        >
          <List
            isBottom={isBottom}
            list={"DROPPED"}
            type={"ANIME"}
            sort={"UPDATED_TIME_DESC"}
          />
        </TabsPrimitive.Content>
      </TabsPrimitive.Root>
      <div ref={bottomRef}></div>
    </div>
  );
};

export default page;
