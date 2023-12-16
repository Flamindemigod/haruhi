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
import ThreeToggleChip from "~/primitives/ThreeToggleChip";

export enum SearchCategory {
  anime = "Anime",
  manga = "Manga",
  character = "Character",
  staff = "Staff",
  studio = "Studio",
}

enum SearchSeason {
  any = "Any",
  winter = "Winter",
  spring = "Spring",
  summer = "Summer",
  fall = "Fall",
}

enum SearchStatus {
  any = "Any",
  releasing = "Releasing",
  finished = "Finished",
  notYetReleased = "Not Yet Released",
  cancelled = "Cancelled",
  hiatus = "Hiatus",
}

enum SearchFormatAnime {
  any = "Any",
  tv = "TV",
  tvShort = "TV Short",
  movie = "Movie",
  special = "Special",
  ova = "OVA",
  ona = "ONA",
  music = "Music",
}

enum SearchFormatManga {
  any = "Any",
  manga = "Manga",
  novel = "Novel",
  oneShot = "One Shot",
}

type AnimeFilter = {
  category: SearchCategory.anime;
  status: SearchStatus;
  season: SearchSeason;
  format: SearchFormatAnime;
  minYear: number;
  maxYear: number;
  minEpisode: number;
  maxEpisode: number;
  minDuration: number;
  maxDuration: number;
  genre: {
    whitelist: string[];
    blacklist: string[];
  };
  tag: {
    percentage: number;
    whitelist: string[];
    blacklist: string[];
  };
};

const defaultAnimeFilter: AnimeFilter = {
  category: SearchCategory.anime,
  status: SearchStatus.any,
  season: SearchSeason.any,
  format: SearchFormatAnime.any,
  minYear: 1970,
  maxYear: 2024,
  minEpisode: 0,
  maxEpisode: 150,
  minDuration: 0,
  maxDuration: 200,
  genre: {
    whitelist: [],
    blacklist: [],
  },
  tag: {
    percentage: 69,
    whitelist: [],
    blacklist: [],
  },
};

type MangaFilter = {
  category: SearchCategory.manga;
  status: SearchStatus;
  format: SearchFormatManga;
  minYear: number;
  maxYear: number;
  minChapters: number;
  maxChapters: number;
  minVolumes: number;
  maxVolumes: number;
  genre: {
    whitelist: string[];
    blacklist: string[];
  };
  tag: {
    percentage: number;
    whitelist: string[];
    blacklist: string[];
  };
};

const defaultMangaFilter: MangaFilter = {
  category: SearchCategory.manga,
  status: SearchStatus.any,
  format: SearchFormatManga.any,
  minYear: 1970,
  maxYear: 2024,
  minChapters: 0,
  maxChapters: 500,
  minVolumes: 0,
  maxVolumes: 50,
  genre: {
    whitelist: [],
    blacklist: [],
  },
  tag: {
    percentage: 69,
    whitelist: [],
    blacklist: [],
  },
};

enum TernaryState {
  true,
  false,
  null,
}

type CharacterFilter = {
  category: SearchCategory.character;
  showBirthdaysOnly: TernaryState;
};

const defaultCharacterFilter: CharacterFilter = {
  category: SearchCategory.character,
  showBirthdaysOnly: TernaryState.null,
};

type StaffFilter = {
  category: SearchCategory.staff;
  showBirthdaysOnly: TernaryState;
};

const defaultStaffFilter: StaffFilter = {
  category: SearchCategory.staff,
  showBirthdaysOnly: TernaryState.null,
};

type StudioFilter = {
  category: SearchCategory.studio;
};

const defaultStudioFilter: StudioFilter = {
  category: SearchCategory.studio,
};

type Filter =
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
              value={filter.status}
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
              value={filter.format}
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
              value={filter.season}
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
              Year Range {`[${filter.minYear} - ${filter.maxYear}]`}
            </Label>
            <Slider
              id="yearRangeSelector"
              max={2024}
              min={1970}
              step={1}
              value={[filter.minYear, filter.maxYear]}
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
              {`[${filter.minEpisode} - ${
                filter.maxEpisode === 150 ? "150+" : filter.maxEpisode
              }]`}
            </Label>
            <Slider
              id="episodeRangeSelector"
              max={150}
              min={0}
              step={1}
              value={[filter.minEpisode, filter.maxEpisode]}
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
              {`[${filter.minDuration} - ${
                filter.maxDuration === 200 ? "200+" : filter.maxDuration
              }]`}
            </Label>
            <Slider
              id="durationRangeSelector"
              max={200}
              min={0}
              step={1}
              value={[filter.minDuration, filter.maxDuration]}
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
                  if (filter.genre.whitelist.find((a) => a === genre))
                    return "Enabled";
                  if (filter.genre.blacklist.find((a) => a === genre))
                    return "Disabled";
                  return undefined;
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
                    case "Enabled":
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
                    case "Disabled":
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
              Minimum Tag%
            </Label>
            <Slider
              ariaLabel="tagMinSlider"
              min={0}
              step={1}
              max={100}
              value={[filter.tag.percentage]}
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
                          if (filter.tag.whitelist.find((a) => a === tag!.name))
                            return "Enabled";
                          if (filter.tag.blacklist.find((a) => a === tag!.name))
                            return "Disabled";
                          return undefined;
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
                            case "Enabled":
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
                            case "Disabled":
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
              value={filter.status}
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
              value={filter.format}
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
              Year Range {`[${filter.minYear} - ${filter.maxYear}]`}
            </Label>
            <Slider
              id="yearRangeSelector"
              max={2024}
              min={1970}
              step={1}
              value={[filter.minYear, filter.maxYear]}
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
              {`[${filter.minChapters} - ${
                filter.maxChapters === 300 ? "300+" : filter.maxChapters
              }]`}
            </Label>
            <Slider
              id="chaptersRangeSelector"
              max={300}
              min={0}
              step={1}
              value={[filter.minChapters, filter.maxChapters]}
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
              {`[${filter.minVolumes} - ${
                filter.maxVolumes === 200 ? "200+" : filter.maxVolumes
              }]`}
            </Label>
            <Slider
              id="volumesRangeSelector"
              max={200}
              min={0}
              step={1}
              value={[filter.minVolumes, filter.maxVolumes]}
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
                  if (filter.genre.whitelist.find((a) => a === genre))
                    return "Enabled";
                  if (filter.genre.blacklist.find((a) => a === genre))
                    return "Disabled";
                  return undefined;
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
                    case "Enabled":
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
                    case "Disabled":
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
              Minimum Tag%
            </Label>
            <Slider
              ariaLabel="tagMinSlider"
              min={0}
              step={1}
              max={100}
              value={[filter.tag.percentage]}
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
                          if (filter.tag.whitelist.find((a) => a === tag!.name))
                            return "Enabled";
                          if (filter.tag.blacklist.find((a) => a === tag!.name))
                            return "Disabled";
                          return undefined;
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
                            case "Enabled":
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
                            case "Disabled":
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
      return <></>;
    case SearchCategory.staff:
      return <></>;
    case SearchCategory.studio:
      return <></>;
  }
};

export default (
  container?: RefObject<HTMLDivElement>,
): {
  render: React.JSX.Element;
  filter: Filter;
} => {
  const [searchTerm, setSearchTerm] = useState<string>();

  const [filters, setFilter] = useState<Filter>({
    category: SearchCategory.anime,
    format: SearchFormatAnime.any,
    genre: {
      blacklist: [],
      whitelist: [],
    },
    minDuration: 0,
    maxDuration: 200,
    maxEpisode: 150,
    minEpisode: 0,
    maxYear: 2024,
    minYear: 1970,
    season: SearchSeason.any,
    status: SearchStatus.any,
    tag: {
      percentage: 69,
      blacklist: [],
      whitelist: [],
    },
  });

  const setDefault = () => {
    setSearchTerm("");
    setFilter({
      category: SearchCategory.anime,
      format: SearchFormatAnime.any,
      genre: {
        blacklist: [],
        whitelist: [],
      },
      minDuration: 0,
      maxDuration: 200,
      maxEpisode: 150,
      minEpisode: 0,
      maxYear: 2024,
      minYear: 1970,
      season: SearchSeason.any,
      status: SearchStatus.any,
      tag: {
        percentage: 69,
        blacklist: [],
        whitelist: [],
      },
    });
  };

  return {
    filter: filters,
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
