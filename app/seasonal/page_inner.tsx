"use client";

import { useState } from "react";
import getSeason from "../../utils/getSeason";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import cx from "classnames";
import Lists from "../../components/Seasonal/Lists";

type Season = {
    season: string;
    year: number;
  };

export const PageInner = () => {
    const currentSeason = getSeason();
    const [season, setSeason] = useState<Season>(currentSeason);
    const seasons: Season[] = [
      {
        season: "Winter",
        year:
          currentSeason.season === "WINTER" || currentSeason.season === "SPRING"
            ? currentSeason.year
            : currentSeason.year + 1,
      },
      {
        season: "Spring",
        year: currentSeason.year,
      },
  
      {
        season: "Summer",
        year: currentSeason.year,
      },
      {
        season: "Fall",
        year: currentSeason.year,
      },
    ];
  
    return (
      <div className="flex flex-col justify-center items-center text-black dark:text-white">
        <TabsPrimitive.Root
          defaultValue={currentSeason.season}
          value={season.season}
          onValueChange={(value) => {
            setSeason({
              season: value,
              year: seasons.filter((el) => el.season.toUpperCase() === value)[0]
                .year,
            });
          }}
          className={"w-full "}
        >
          <TabsPrimitive.List
            className={cx("flex w-full  bg-white dark:bg-offWhite-800")}
          >
            {seasons.map(({ season, year }) => (
              <TabsPrimitive.Trigger
                key={`tab-trigger-${season}-${year}`}
                value={season.toUpperCase()}
                className={cx(
                  "group",
                  "border-b border-l border-r",
                  "border-offWhite-300 dark:border-offWhite-600",
                  "radix-state-active:border-b-primary-500 focus-visible:radix-state-active:border-b-transparent radix-state-inactive:bg-offWhite-100 dark:radix-state-active:border-b-primary-500 dark:radix-state-active:bg-offWhite-900 focus-visible:dark:radix-state-active:border-b-transparent dark:radix-state-inactive:bg-offWhite-800",
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
                  {season} - {year}
                </span>
              </TabsPrimitive.Trigger>
            ))}
          </TabsPrimitive.List>
        </TabsPrimitive.Root>
        <Lists season={season.season} year={season.year} />
      </div>
    );
}