"use client";

import _ from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import Select from "../../primitives/SelectBetter";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import cx from "classnames";
import Filter from "../../components/Search/Filters/Anime-Manga/Filter";
import SearchResultsAnime from "../../components/Search/SearchResultsAnime";
import Grid from "../../components/Search/Grid";
import SearchResultsManga from "../../components/Search/SearchResultsManga";
import FilterStaffCharacter from "../../components/Search/Filters/Staff-Character/Filter";
import SearchResultsStaff from "../../components/Search/SearchResultsStaff";
import SearchResultsCharacter from "../../components/Search/SearchResultsCharacter";



interface Tab {
    title: string;
    value: string;
  }
  
  const tabs: Tab[] = [
    {
      title: "Anime",
      value: "ANIME",
    },
    {
      title: "Manga",
      value: "MANGA",
    },
    {
      title: "Character",
      value: "CHARACTER",
    },
    {
      title: "Staff",
      value: "STAFF",
    },
  ];
  
  const sortValues = (type: string) => {
    switch (type) {
      case "ANIME":
        return [
          { displayTitle: "Id", value: "ID" },
          { displayTitle: "Id Descending", value: "ID_DESC" },
          { displayTitle: "Title Romaji", value: "TITLE_ROMAJI" },
          { displayTitle: "Title Romaji Descending", value: "TITLE_ROMAJI_DESC" },
          { displayTitle: "Title English", value: "TITLE_ENGLISH" },
          {
            displayTitle: "Title English Descending",
            value: "TITLE_ENGLISH_DESC",
          },
          { displayTitle: "Title Native", value: "TITLE_NATIVE" },
          { displayTitle: "Title Native Descending", value: "TITLE_NATIVE_DESC" },
          { displayTitle: "Type", value: "TYPE" },
          { displayTitle: "Type Descending", value: "TYPE_DESC" },
          { displayTitle: "Format", value: "FORMAT" },
          { displayTitle: "Format Descending", value: "FORMAT_DESC" },
          { displayTitle: "Start Date", value: "START_DATE" },
          { displayTitle: "Start Date Descending", value: "START_DATE_DESC" },
          { displayTitle: "End Date", value: "END_DATE" },
          { displayTitle: "End Date Descending", value: "END_DATE_DESC" },
          { displayTitle: "Score", value: "SCORE" },
          { displayTitle: "Score Descending", value: "SCORE_DESC" },
          { displayTitle: "Popularity", value: "POPULARITY" },
          { displayTitle: "Popularity Descending", value: "POPULARITY_DESC" },
          { displayTitle: "Trending", value: "TRENDING" },
          { displayTitle: "Trending Descending", value: "TRENDING_DESC" },
          { displayTitle: "Episodes", value: "EPISODES" },
          { displayTitle: "Episodes Descending", value: "EPISODES_DESC" },
          { displayTitle: "Duration", value: "DURATION" },
          { displayTitle: "Duration Descending", value: "DURATION_DESC" },
          { displayTitle: "Status", value: "STATUS" },
          { displayTitle: "Status Descending", value: "STATUS_DESC" },
          { displayTitle: "Updated At", value: "UPDATED_AT" },
          { displayTitle: "Updated At Descending", value: "UPDATED_AT_DESC" },
          { displayTitle: "Search Match", value: "SEARCH_MATCH" },
          { displayTitle: "Favourites", value: "FAVOURITES" },
          { displayTitle: "Favourites Descending", value: "FAVOURITES_DESC" },
        ];
      case "MANGA":
        return [
          { displayTitle: "Id", value: "ID" },
          { displayTitle: "Id Descending", value: "ID_DESC" },
          { displayTitle: "Title Romaji", value: "TITLE_ROMAJI" },
          { displayTitle: "Title Romaji Descending", value: "TITLE_ROMAJI_DESC" },
          { displayTitle: "Title English", value: "TITLE_ENGLISH" },
          {
            displayTitle: "Title English Descending",
            value: "TITLE_ENGLISH_DESC",
          },
          { displayTitle: "Title Native", value: "TITLE_NATIVE" },
          { displayTitle: "Title Native Descending", value: "TITLE_NATIVE_DESC" },
          { displayTitle: "Type", value: "TYPE" },
          { displayTitle: "Type Descending", value: "TYPE_DESC" },
          { displayTitle: "Format", value: "FORMAT" },
          { displayTitle: "Format Descending", value: "FORMAT_DESC" },
          { displayTitle: "Start Date", value: "START_DATE" },
          { displayTitle: "Start Date Descending", value: "START_DATE_DESC" },
          { displayTitle: "End Date", value: "END_DATE" },
          { displayTitle: "End Date Descending", value: "END_DATE_DESC" },
          { displayTitle: "Score", value: "SCORE" },
          { displayTitle: "Score Descending", value: "SCORE_DESC" },
          { displayTitle: "Popularity", value: "POPULARITY" },
          { displayTitle: "Popularity Descending", value: "POPULARITY_DESC" },
          { displayTitle: "Trending", value: "TRENDING" },
          { displayTitle: "Trending Descending", value: "TRENDING_DESC" },
          { displayTitle: "Status", value: "STATUS" },
          { displayTitle: "Status Descending", value: "STATUS_DESC" },
          { displayTitle: "Chapters", value: "CHAPTERS" },
          { displayTitle: "Chapters Descending", value: "CHAPTERS_DESC" },
          { displayTitle: "Volumes", value: "VOLUMES" },
          { displayTitle: "Volumes Descending", value: "VOLUMES_DESC" },
          { displayTitle: "Updated At", value: "UPDATED_AT" },
          { displayTitle: "Updated At Descending", value: "UPDATED_AT_DESC" },
          { displayTitle: "Search Match", value: "SEARCH_MATCH" },
          { displayTitle: "Favourites", value: "FAVOURITES" },
          { displayTitle: "Favourites Descending", value: "FAVOURITES_DESC" },
        ];
      case "CHARACTER":
        return [
          { displayTitle: "Id", value: "ID" },
          { displayTitle: "Id Descending", value: "ID_DESC" },
          { displayTitle: "Role", value: "ROLE" },
          { displayTitle: "Role Descending", value: "ROLE_DESC" },
          { displayTitle: "Search Match", value: "SEARCH_MATCH" },
          { displayTitle: "Favourites", value: "FAVOURITES" },
          { displayTitle: "Favourites Descending", value: "FAVOURITES_DESC" },
          { displayTitle: "Relevance", value: "RELEVANCE" },
        ];
      case "STAFF":
        return [
          { displayTitle: "Id", value: "ID" },
          { displayTitle: "Id Descending", value: "ID_DESC" },
          { displayTitle: "Role", value: "ROLE" },
          { displayTitle: "Role Descending", value: "ROLE_DESC" },
          { displayTitle: "Language", value: "LANGUAGE" },
          { displayTitle: "Language Descending", value: "LANGUAGE_DESC" },
          { displayTitle: "Search Match", value: "SEARCH_MATCH" },
          { displayTitle: "Favourites", value: "FAVOURITES" },
          { displayTitle: "Favourites Descending", value: "FAVOURITES_DESC" },
          { displayTitle: "Relevance", value: "RELEVANCE" },
        ];
  
      default:
        return [];
    }
  };

  export const PageInner = () => {

    const [searchString, setSearchString] = useState<string>("");
    const [type, setType] = useState<string>("ANIME");
    const [sort, setSort] = useState<string>("SEARCH_MATCH");
    const [filters, setFilters] = useState<any>({
      isAdult: undefined,
      isBirthday: undefined,
      format: "",
      status: "",
      countryOfOrigin: "",
      season: "",
      seasonYear: "",
      onList: undefined,
      yearLesser: new Date().getFullYear() + 1,
      yearGreater: 1970,
      episodeLesser: 150,
      episodeGreater: 0,
      durationLesser: 170,
      durationGreater: 0,
      chapterLesser: 500,
      chapterGreater: 0,
      volumeLesser: 50,
      volumeGreater: 0,
      genres: [],
      excludedGenres: [],
      tags: [],
      excludedTags: [],
    });
  
    const debouncedSetSearchString = useCallback(
      _.debounce((e) => {
        setSearchString(e.target.value);
      }, 1000),
      []
    );
  
    useEffect(() => {}, [type]);
    return (
      <div>
        <div className="p-4">
          <input
            className="w-full text-xl bg-white/50 dark:bg-black/50 p-4 border border-black dark:border-white dark:text-white rounded-md  focus-visible:outline-none focus-visible:ring focus-visible:ring-primary-500 focus-visible:ring-opacity-75"
            placeholder="Search...."
            onChange={debouncedSetSearchString}
          />
          <div className="relative flex flex-col md:flex-row mt-4 dark:text-white">
            {/* Sidebar */}
            <div
              className="flex-grow flex flex-col gap-2"
              style={{ flexBasis: "20rem" }}
            >
              {/* Type Selector */}
              <TabsPrimitive.Root
                defaultValue="tab1"
                orientation="vertical"
                value={type}
                onValueChange={(val: any) => {
                  setType(val);
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
              <div className="">
                <label>Sort:</label>
                <Select
                  defaultValue="SEARCH_MATCH"
                  value={sort}
                  onValueChange={setSort}
                  triggerAriaLabel={"Search Sort Selector"}
                  values={sortValues(type)}
                  buttonClass={"w-full bg-primary-500"}
                />
              </div>
              {(type === "ANIME" || type === "MANGA") && (
                <Filter type={type} filters={filters} setFilter={setFilters} />
              )}
              {(type === "CHARACTER" || type === "STAFF") && (
                <FilterStaffCharacter
                  type={type}
                  filters={filters}
                  setFilter={setFilters}
                />
              )}
            </div>
            {/* Content */}
            <div
              className="sm:p-4 flex flex-col items-center"
              style={{ flexBasis: "0", flexGrow: "999" }}
            >
              {/* {JSON.stringify(filtersAnimeManga)} */}
              <Grid>
                {type === "ANIME" && (
                  <SearchResultsAnime
                    searchString={searchString}
                    filters={filters}
                    sort={sort}
                  />
                )}
                {type === "MANGA" && (
                  <SearchResultsManga
                    searchString={searchString}
                    filters={filters}
                    sort={sort}
                  />
                )}
                {type === "STAFF" && (
                  <SearchResultsStaff
                    searchString={searchString}
                    filters={filters}
                    sort={sort}
                  />
                )}
                {type === "CHARACTER" && (
                  <SearchResultsCharacter
                    searchString={searchString}
                    filters={filters}
                    sort={sort}
                  />
                )}
              </Grid>
            </div>
          </div>
        </div>
      </div>
    );
  }