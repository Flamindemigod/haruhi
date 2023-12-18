"use client";

import React, {
  Dispatch,
  Fragment,
  ReactNode,
  RefObject,
  SetStateAction,
  useState,
} from "react";
import { Root as Label } from "@radix-ui/react-label";
import Slider from "~/primitives/Slider";
import RadioGroup from "~/primitives/RadioGroup";
import Select from "~/primitives/Select";
import TextField from "~/primitives/TextField";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
} from "@radix-ui/react-icons";
import Drawer from "~/primitives/Drawer";
import { api } from "~/trpc/react";
import ThreeToggleChip, { TernaryState } from "~/primitives/ThreeToggleChip";
import { useDebounce } from "./useDebounce";
import {
  AnimeFilter,
  MangaFilter,
  CharacterFilter,
  StaffFilter,
  StudioFilter,
  SearchCategory,
  SearchFormatAnime,
  SearchFormatManga,
  SearchSort,
  SearchSeason,
  SearchStatus,
  defaultAnimeFilter,
  defaultMangaFilter,
  defaultCharacterFilter,
  defaultStaffFilter,
  defaultStudioFilter,
} from "~/types.shared/anilist";

export type Filter =
  | AnimeFilter
  | MangaFilter
  | CharacterFilter
  | StaffFilter
  | StudioFilter;

const Wrapper = ({ children }: { children?: ReactNode }) => (
  <div className="flex flex-col gap-2 rounded-md bg-white/10 p-4">
    {children}
  </div>
);

const FilterSelector = (
  filter: Filter,
  setFilter: Dispatch<SetStateAction<Filter>>,
  container?: RefObject<HTMLDivElement>,
) => {
  let { data: user } = api.user.getUser.useQuery();
  let { data: genres } = api.anilist.getGenres.useQuery();
  let { data: tags } = api.anilist.getTags.useQuery();
  let category = "";
  const [genreReset, setGenreReset] = useState<boolean>(false);
  const [tagReset, setTagReset] = useState<boolean>(false);
  switch (filter.category) {
    case SearchCategory.anime:
      return (
        <div className="m-2 grid h-full w-full gap-2 overflow-y-scroll p-2">
          {/* Sort */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="sortSelector"
            >
              Sort
            </Label>
            <Select
              value={(filter as AnimeFilter).sort}
              trigger={
                <div className="rounded-md bg-primary-500 p-2 text-center">
                  {(filter as AnimeFilter).sort}
                </div>
              }
              defaultValue={SearchSort.SearchMatch}
              values={Object.values(SearchSort).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              triggerAriaLabel="sortSelector"
              side={"left"}
              onValueChange={(v: SearchSort) => {
                setFilter((state) => ({
                  ...(state as AnimeFilter),
                  sort: v,
                }));
              }}
            />
          </Wrapper>
          {/* Airing Status */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="airingStatusSelector"
            >
              Airing Status
            </Label>
            <RadioGroup
              name="airingStatusSelector"
              orientation="horizontal"
              dataValues={Object.values(SearchStatus).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
              value={(filter as AnimeFilter).status}
              onValueChange={(s: SearchStatus) => {
                setFilter((state) => ({
                  ...state,
                  status: s,
                }));
              }}
            />
          </Wrapper>
          {/* Format */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="formatSelector"
            >
              Format
            </Label>
            <RadioGroup
              name="formatSelector"
              orientation="horizontal"
              dataValues={Object.values(SearchFormatAnime).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
              value={(filter as AnimeFilter).format}
              onValueChange={(f: SearchFormatAnime) => {
                setFilter((state: any) => ({
                  ...state,
                  format: f,
                }));
              }}
            />
          </Wrapper>
          {/* Season Selector */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="seasonSelector"
            >
              Season
            </Label>
            <RadioGroup
              name="seasonSelector"
              orientation="horizontal"
              dataValues={Object.values(SearchSeason).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
              value={(filter as AnimeFilter).season}
              onValueChange={(s: SearchSeason) => {
                setFilter((state) => ({
                  ...state,
                  season: s,
                }));
              }}
            />
          </Wrapper>
          {/* Year Range */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="yearRangeSelector"
            >
              Year Range{" "}
              {`[${(filter as AnimeFilter).minYear} - ${
                (filter as AnimeFilter).maxYear
              }]`}
            </Label>
            <Slider
              id="yearRangeSelector"
              max={2024}
              min={1970}
              step={1}
              value={[
                (filter as AnimeFilter).minYear!,
                (filter as AnimeFilter).maxYear!,
              ]}
              ariaLabel="Year Range Selector"
              onChange={(v) => {
                setFilter((state) => ({
                  ...state,
                  minYear: v.sort().at(0)!,
                  maxYear: v.sort().at(-1)!,
                }));
              }}
              thumbClasses="w-4 h-4"
              trackClasses="dark:bg-primary-400"
            />
          </Wrapper>
          {/* Episodes Range */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="episodeRangeSelector"
            >
              Episode Range{" "}
              {`[${(filter as AnimeFilter).minEpisode} - ${
                (filter as AnimeFilter).maxEpisode === 150
                  ? "150+"
                  : (filter as AnimeFilter).maxEpisode
              }]`}
            </Label>
            <Slider
              id="episodeRangeSelector"
              max={150}
              min={0}
              step={1}
              value={[
                (filter as AnimeFilter).minEpisode!,
                (filter as AnimeFilter).maxEpisode!,
              ]}
              ariaLabel="Episode Range Selector"
              onChange={(v) => {
                setFilter((state) => ({
                  ...state,
                  minEpisode: v.at(0)!,
                  maxEpisode: v.at(-1)!,
                }));
              }}
              thumbClasses="w-4 h-4"
              trackClasses="dark:bg-primary-400"
            />
          </Wrapper>

          {/* Duration Range */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="durationRangeSelector"
            >
              Duration Range{" "}
              {`[${(filter as AnimeFilter).minDuration} - ${
                (filter as AnimeFilter).maxDuration === 200
                  ? "200+"
                  : (filter as AnimeFilter).maxDuration
              }]`}
            </Label>
            <Slider
              id="durationRangeSelector"
              max={200}
              min={0}
              step={1}
              value={[
                (filter as AnimeFilter).minDuration!,
                (filter as AnimeFilter).maxDuration!,
              ]}
              ariaLabel="Duration Range Selector"
              onChange={(v) => {
                setFilter((state) => ({
                  ...state,
                  minDuration: v.at(0)!,
                  maxDuration: v.at(-1)!,
                }));
              }}
              thumbClasses="w-4 h-4"
              trackClasses="dark:bg-primary-400"
            />
          </Wrapper>

          {/*Genre Selection */}
          <Wrapper>
            <div className="flex justify-between">
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="genreSelector"
              >
                Genres
              </Label>
              <button
                className="rounded-md bg-primary-500 p-2"
                onClick={() => {
                  setGenreReset((state) => !state);
                }}
              >
                Reset Genres
              </button>
            </div>
            {genres?.GenreCollection?.map((genre, idx) => (
              <ThreeToggleChip
                key={idx}
                text={genre!}
                initState={(() => {
                  if (
                    (filter as AnimeFilter).genre.whitelist.find(
                      (a) => a === genre,
                    )
                  )
                    return TernaryState.true;
                  if (
                    (filter as AnimeFilter).genre.blacklist.find(
                      (a) => a === genre,
                    )
                  )
                    return TernaryState.false;
                  return TernaryState.null;
                })()}
                reset={genreReset}
                onReset={() => {
                  setFilter((state: any) => ({
                    ...state,
                    genre: {
                      whitelist: state.genre.whitelist.filter(
                        (si: string) => si !== genre,
                      ),
                      blacklist: state.genre.blacklist.filter(
                        (si: string) => si !== genre,
                      ),
                    },
                  }));
                }}
                onChange={(c) => {
                  switch (c) {
                    case TernaryState.true:
                      setFilter((state: any) => ({
                        ...state,
                        genre: {
                          blacklist: state.genre.blacklist.filter(
                            (si: string) => si !== genre,
                          ),
                          whitelist: [...state.genre.whitelist, genre!],
                        },
                      }));

                      break;
                    case TernaryState.false:
                      setFilter((state: any) => ({
                        ...state,
                        genre: {
                          whitelist: state.genre.whitelist.filter(
                            (si: string) => si !== genre,
                          ),
                          blacklist: [...state.genre.blacklist, genre!],
                        },
                      }));

                      break;
                    default:
                      setFilter((state: any) => ({
                        ...state,
                        genre: {
                          whitelist: state.genre.whitelist.filter(
                            (si: string) => si !== genre,
                          ),
                          blacklist: state.genre.blacklist.filter(
                            (si: string) => si !== genre,
                          ),
                        },
                      }));

                      break;
                  }
                }}
              />
            ))}
          </Wrapper>

          {/*Tag Percentage & Selection */}
          <Wrapper>
            <div className="flex justify-between">
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="tagSelector"
              >
                Tags
              </Label>
              <button
                className="rounded-md bg-primary-500 p-2"
                onClick={() => {
                  setFilter((state: any) => ({
                    ...state,
                    tag: {
                      ...state.tag,
                      percentage: 69,
                    },
                  }));
                  setTagReset((state) => !state);
                }}
              >
                Reset Tags
              </button>
            </div>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="tagSelector"
            >
              {`Minimum Tag ${(filter as AnimeFilter).tag.percentage}%`}
            </Label>
            <Slider
              ariaLabel="tagMinSlider"
              min={0}
              step={1}
              max={100}
              value={[(filter as AnimeFilter).tag.percentage]}
              onChange={(v) => {
                setFilter((state: any) => ({
                  ...state,
                  tag: {
                    ...state.tag,
                    percentage: v[0],
                  },
                }));
              }}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {tags
                ?.MediaTagCollection!.filter((v) =>
                  user?.showNSFW ? true : !v!.isAdult,
                )
                .sort((a, b) => a!.category!.localeCompare(b!.category!))
                .map((tag) => {
                  const showCategorySeperator = category !== tag?.category;
                  if (showCategorySeperator) {
                    category = tag?.category!;
                  }
                  return (
                    <Fragment key={tag?.id}>
                      {showCategorySeperator && (
                        <div className="w-full rounded-md p-2 dark:bg-white/10 dark:text-white">
                          {tag?.category}
                        </div>
                      )}
                      <ThreeToggleChip
                        initState={(() => {
                          if (
                            (filter as AnimeFilter).tag.whitelist.find(
                              (a) => a === tag!.name,
                            )
                          )
                            return TernaryState.true;
                          if (
                            (filter as AnimeFilter).tag.blacklist.find(
                              (a) => a === tag!.name,
                            )
                          )
                            return TernaryState.false;
                          return TernaryState.null;
                        })()}
                        text={tag?.name!}
                        reset={tagReset}
                        onReset={() => {
                          setFilter((state: any) => ({
                            ...state,
                            tag: {
                              whitelist: state.tag.whitelist.filter(
                                (si: string) => si !== tag!.name,
                              ),
                              blacklist: state.tag.blacklist.filter(
                                (si: string) => si !== tag!.name,
                              ),
                            },
                          }));
                        }}
                        onChange={(c) => {
                          switch (c) {
                            case TernaryState.true:
                              setFilter((state: any) => ({
                                ...state,
                                tag: {
                                  blacklist: state.tag.blacklist.filter(
                                    (si: string) => si !== tag?.name,
                                  ),
                                  whitelist: [
                                    ...state.tag.whitelist,
                                    tag?.name!,
                                  ],
                                },
                              }));

                              break;
                            case TernaryState.false:
                              setFilter((state: any) => ({
                                ...state,
                                tag: {
                                  whitelist: state.tag.whitelist.filter(
                                    (si: string) => si !== tag!.name,
                                  ),
                                  blacklist: [
                                    ...state.tag.blacklist,
                                    tag!.name!,
                                  ],
                                },
                              }));

                              break;
                            default:
                              setFilter((state: any) => ({
                                ...state,
                                tag: {
                                  whitelist: state.tag.whitelist.filter(
                                    (si: string) => si !== tag!.name,
                                  ),
                                  blacklist: state.tag.blacklist.filter(
                                    (si: string) => si !== tag!.name,
                                  ),
                                },
                              }));

                              break;
                          }
                        }}
                      />
                    </Fragment>
                  );
                })}
            </div>
          </Wrapper>
        </div>
      );
    case SearchCategory.manga:
      return (
        <div className="m-2 grid h-full w-full gap-2 overflow-y-scroll p-2">
          {/* Sort */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="sortSelector"
            >
              Sort
            </Label>
            <Select
              value={(filter as MangaFilter).sort}
              trigger={
                <div className="rounded-md bg-primary-500 p-2 text-center">
                  {(filter as MangaFilter).sort}
                </div>
              }
              defaultValue={SearchSort.SearchMatch}
              values={Object.values(SearchSort).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              triggerAriaLabel="sortSelector"
              side={"left"}
              onValueChange={(v: SearchSort) => {
                setFilter((state) => ({
                  ...(state as MangaFilter),
                  sort: v,
                }));
              }}
            />
          </Wrapper>
          {/* Airing Status */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="airingStatusSelector"
            >
              Airing Status
            </Label>
            <RadioGroup
              name="airingStatusSelector"
              orientation="horizontal"
              dataValues={Object.values(SearchStatus).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
              value={(filter as MangaFilter).status}
              onValueChange={(s: SearchStatus) => {
                setFilter((state) => ({
                  ...state,
                  status: s,
                }));
              }}
            />
          </Wrapper>
          {/* Format */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="formatSelector"
            >
              Format
            </Label>
            <RadioGroup
              name="formatSelector"
              orientation="horizontal"
              dataValues={Object.values(SearchFormatManga).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              icon={<div className="h-3 w-3 rounded-full bg-primary-500" />}
              value={(filter as MangaFilter).format}
              onValueChange={(f: SearchFormatManga) => {
                setFilter((state: any) => ({
                  ...state,
                  format: f,
                }));
              }}
            />
          </Wrapper>

          {/* Year Range */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="yearRangeSelector"
            >
              Year Range{" "}
              {`[${(filter as MangaFilter).minYear} - ${
                (filter as MangaFilter).maxYear
              }]`}
            </Label>
            <Slider
              id="yearRangeSelector"
              max={2024}
              min={1970}
              step={1}
              value={[
                (filter as MangaFilter).minYear!,
                (filter as MangaFilter).maxYear!,
              ]}
              ariaLabel="Year Range Selector"
              onChange={(v) => {
                setFilter((state) => ({
                  ...state,
                  minYear: v.sort().at(0)!,
                  maxYear: v.sort().at(-1)!,
                }));
              }}
              thumbClasses="w-4 h-4"
              trackClasses="dark:bg-primary-400"
            />
          </Wrapper>
          {/* Chapters Range */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="chaptersRangeSelector"
            >
              Chapter Range{" "}
              {`[${(filter as MangaFilter).minChapters} - ${
                (filter as MangaFilter).maxChapters === 300
                  ? "300+"
                  : (filter as MangaFilter).maxChapters
              }]`}
            </Label>
            <Slider
              id="chaptersRangeSelector"
              max={300}
              min={0}
              step={1}
              value={[
                (filter as MangaFilter).minChapters!,
                (filter as MangaFilter).maxChapters!,
              ]}
              ariaLabel="Chapters Range Selector"
              onChange={(v) => {
                setFilter((state) => ({
                  ...state,
                  minChapters: v.at(0)!,
                  maxChapters: v.at(-1)!,
                }));
              }}
              thumbClasses="w-4 h-4"
              trackClasses="dark:bg-primary-400"
            />
          </Wrapper>

          {/* Volumes Range */}
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="volumesRangeSelector"
            >
              Volumes Range{" "}
              {`[${(filter as MangaFilter).minVolumes} - ${
                (filter as MangaFilter).maxVolumes === 50
                  ? "50+"
                  : (filter as MangaFilter).maxVolumes
              }]`}
            </Label>
            <Slider
              id="volumesRangeSelector"
              max={50}
              min={0}
              step={1}
              value={[
                (filter as MangaFilter).minVolumes!,
                (filter as MangaFilter).maxVolumes!,
              ]}
              ariaLabel="Volumes Range Selector"
              onChange={(v) => {
                setFilter((state) => ({
                  ...state,
                  minVolumes: v.at(0)!,
                  maxVolumes: v.at(-1)!,
                }));
              }}
              thumbClasses="w-4 h-4"
              trackClasses="dark:bg-primary-400"
            />
          </Wrapper>

          {/*Genre Selection */}
          <Wrapper>
            <div className="flex justify-between">
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="genreSelector"
              >
                Genres
              </Label>
              <button
                className="rounded-md bg-primary-500 p-2"
                onClick={() => {
                  setGenreReset((state) => !state);
                }}
              >
                Reset Genres
              </button>
            </div>
            {genres?.GenreCollection?.map((genre, idx) => (
              <ThreeToggleChip
                key={idx}
                text={genre!}
                initState={(() => {
                  if (
                    (filter as MangaFilter).genre.whitelist.find(
                      (a) => a === genre,
                    )
                  )
                    return TernaryState.true;
                  if (
                    (filter as MangaFilter).genre.blacklist.find(
                      (a) => a === genre,
                    )
                  )
                    return TernaryState.false;
                  return TernaryState.null;
                })()}
                reset={genreReset}
                onReset={() => {
                  setFilter((state: any) => ({
                    ...state,
                    genre: {
                      whitelist: state.genre.whitelist.filter(
                        (si: string) => si !== genre,
                      ),
                      blacklist: state.genre.blacklist.filter(
                        (si: string) => si !== genre,
                      ),
                    },
                  }));
                }}
                onChange={(c) => {
                  switch (c) {
                    case TernaryState.true:
                      setFilter((state: any) => ({
                        ...state,
                        genre: {
                          blacklist: state.genre.blacklist.filter(
                            (si: string) => si !== genre,
                          ),
                          whitelist: [...state.genre.whitelist, genre!],
                        },
                      }));

                      break;
                    case TernaryState.false:
                      setFilter((state: any) => ({
                        ...state,
                        genre: {
                          whitelist: state.genre.whitelist.filter(
                            (si: string) => si !== genre,
                          ),
                          blacklist: [...state.genre.blacklist, genre!],
                        },
                      }));

                      break;
                    default:
                      setFilter((state: any) => ({
                        ...state,
                        genre: {
                          whitelist: state.genre.whitelist.filter(
                            (si: string) => si !== genre,
                          ),
                          blacklist: state.genre.blacklist.filter(
                            (si: string) => si !== genre,
                          ),
                        },
                      }));

                      break;
                  }
                }}
              />
            ))}
          </Wrapper>

          {/*Tag Percentage & Selection */}
          <Wrapper>
            <div className="flex justify-between">
              <Label
                className="text-lg font-semibold text-primary-500"
                htmlFor="tagSelector"
              >
                Tags
              </Label>
              <button
                className="rounded-md bg-primary-500 p-2"
                onClick={() => {
                  setFilter((state: any) => ({
                    ...state,
                    tag: {
                      ...state.tag,
                      percentage: 69,
                    },
                  }));
                  setTagReset((state) => !state);
                }}
              >
                Reset Tags
              </button>
            </div>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="tagSelector"
            >
              {`Minimum Tag ${(filter as MangaFilter).tag.percentage}%`}
            </Label>
            <Slider
              ariaLabel="tagMinSlider"
              min={0}
              step={1}
              max={100}
              value={[(filter as MangaFilter).tag.percentage]}
              onChange={(v) => {
                setFilter((state: any) => ({
                  ...state,
                  tag: {
                    ...state.tag,
                    percentage: v[0],
                  },
                }));
              }}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {tags
                ?.MediaTagCollection!.filter((v) =>
                  user?.showNSFW ? true : !v!.isAdult,
                )
                .sort((a, b) => a!.category!.localeCompare(b!.category!))
                .map((tag) => {
                  const showCategorySeperator = category !== tag?.category;
                  if (showCategorySeperator) {
                    category = tag?.category!;
                  }
                  return (
                    <Fragment key={tag?.id}>
                      {showCategorySeperator && (
                        <div className="w-full rounded-md p-2 dark:bg-white/10 dark:text-white">
                          {tag?.category}
                        </div>
                      )}
                      <ThreeToggleChip
                        initState={(() => {
                          if (
                            (filter as MangaFilter).tag.whitelist.find(
                              (a) => a === tag!.name,
                            )
                          )
                            return TernaryState.true;
                          if (
                            (filter as MangaFilter).tag.blacklist.find(
                              (a) => a === tag!.name,
                            )
                          )
                            return TernaryState.false;
                          return TernaryState.null;
                        })()}
                        text={tag?.name!}
                        reset={tagReset}
                        onReset={() => {
                          setFilter((state: any) => ({
                            ...state,
                            tag: {
                              whitelist: state.tag.whitelist.filter(
                                (si: string) => si !== tag!.name,
                              ),
                              blacklist: state.tag.blacklist.filter(
                                (si: string) => si !== tag!.name,
                              ),
                            },
                          }));
                        }}
                        onChange={(c) => {
                          switch (c) {
                            case TernaryState.true:
                              setFilter((state: any) => ({
                                ...state,
                                tag: {
                                  blacklist: state.tag.blacklist.filter(
                                    (si: string) => si !== tag?.name,
                                  ),
                                  whitelist: [
                                    ...state.tag.whitelist,
                                    tag?.name!,
                                  ],
                                },
                              }));

                              break;
                            case TernaryState.false:
                              setFilter((state: any) => ({
                                ...state,
                                tag: {
                                  whitelist: state.tag.whitelist.filter(
                                    (si: string) => si !== tag!.name,
                                  ),
                                  blacklist: [
                                    ...state.tag.blacklist,
                                    tag!.name!,
                                  ],
                                },
                              }));

                              break;
                            default:
                              setFilter((state: any) => ({
                                ...state,
                                tag: {
                                  whitelist: state.tag.whitelist.filter(
                                    (si: string) => si !== tag!.name,
                                  ),
                                  blacklist: state.tag.blacklist.filter(
                                    (si: string) => si !== tag!.name,
                                  ),
                                },
                              }));

                              break;
                          }
                        }}
                      />
                    </Fragment>
                  );
                })}
            </div>
          </Wrapper>
        </div>
      );
    case SearchCategory.character:
    case SearchCategory.staff:
      return (
        <div className="m-2 grid h-full w-full gap-2 overflow-y-scroll p-2">
          <Wrapper>
            <Label
              className="text-lg font-semibold text-primary-500"
              htmlFor="showBirthday"
            >
              Show Birthdays
            </Label>
            <ThreeToggleChip
              text={((f: CharacterFilter | StaffFilter) => {
                switch (f.showBirthdaysOnly) {
                  case TernaryState.true:
                    return "Showing Only Birthdays";
                  case TernaryState.false:
                    return "Filtering Out Birthdays";
                  case TernaryState.null:
                    return "Showing All";
                }
              })(filter as CharacterFilter | StaffFilter)}
              onChange={(f) => {
                let state: TernaryState;
                switch (f) {
                  case TernaryState.true:
                    state = TernaryState.true;
                    break;
                  case TernaryState.false:
                    state = TernaryState.false;
                    break;
                  case undefined:
                    state = TernaryState.null;
                    break;
                }
                setFilter((s) => ({
                  ...s,
                  showBirthdaysOnly: state,
                }));
              }}
              initState={((f: CharacterFilter | StaffFilter) => {
                switch (f.showBirthdaysOnly) {
                  case TernaryState.true:
                    return TernaryState.true;
                  case TernaryState.false:
                    return TernaryState.false;
                  case TernaryState.null:
                    return TernaryState.null;
                }
              })(filter as CharacterFilter | StaffFilter)}
            />
          </Wrapper>
        </div>
      );

    case SearchCategory.studio:
      return (
        <div className="m-2 grid h-full w-full gap-2 overflow-y-scroll p-2">
          <Wrapper>
            <div className="grid h-full place-items-center text-xl font-semibold">
              No Filtering Options
            </div>
          </Wrapper>
        </div>
      );
  }
};

export default (
  container?: RefObject<HTMLDivElement>,
): {
  render: React.JSX.Element;
  searchString: string;
  filter: Filter;
} => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debounchedSearchString = useDebounce<string>(searchTerm, 1000);
  const [filters, setFilter] = useState<Filter>(defaultAnimeFilter);
  const setDefault = () => {
    setSearchTerm("");
    setFilter(defaultAnimeFilter);
  };

  return {
    filter: filters,
    searchString: debounchedSearchString,
    render: (
      <TextField
        placeholder="Search..."
        variant="surface"
        rootClasses="outline-primary-500 focus-within:-outline-offset-4 hover:-outline-offset-4 focus-within:outline hover:outline  outline-4 transition-all p-1 dark:bg-white/10"
        startIcon={{
          icon: (
            <Select
              side="top"
              trigger={
                <button className="flex items-center gap-2 bg-primary-500/20 p-2">
                  <MagnifyingGlassIcon className="scale-150" />
                  {filters.category} <ChevronDownIcon />
                </button>
              }
              defaultValue={SearchCategory.anime}
              values={Object.values(SearchCategory).map((v) => ({
                value: v,
                displayTitle: v,
              }))}
              onValueChange={(v) => {
                let filter: Filter;
                switch (v) {
                  case SearchCategory.anime:
                    filter = defaultAnimeFilter;
                    break;
                  case SearchCategory.manga:
                    filter = defaultMangaFilter;
                    break;

                  case SearchCategory.character:
                    filter = defaultCharacterFilter;
                    break;
                  case SearchCategory.staff:
                    filter = defaultStaffFilter;
                    break;
                  case SearchCategory.studio:
                    filter = defaultStudioFilter;
                    break;
                }
                setFilter(() => ({ ...filter }));
              }}
              triggerAriaLabel="Search Field"
              value={filters.category}
            />
          ),
          color: "ruby",
          gap: "4",
        }}
        onValueChange={(e) => {
          setSearchTerm(e);
        }}
        endIcon={{
          icon: (
            <Drawer
              trigger={
                <button className="flex items-center gap-2 bg-primary-500/20 p-2">
                  <MixerHorizontalIcon />
                </button>
              }
              content={FilterSelector(filters, setFilter)}
              className="w-2/3 max-w-lg"
            />
          ),
          color: "ruby",
          gap: "4",
        }}
        value={searchTerm}
        className="focus-within:border-b-1 hover:border-b-1 isolate z-0 mx-2 h-full rounded-md border-0 border-secondary-500 bg-black/20 px-2 py-1 text-primary-400 outline-none transition-all placeholder:text-primary-400 dark:bg-black/50 placeholder:dark:text-primary-500"
      />
    ),
  };
};
