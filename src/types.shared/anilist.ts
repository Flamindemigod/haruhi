import { z } from "zod";
import {
  Media as AniMedia,
  Staff as AniStaff,
  Character as AniCharacter,
  MediaList as AniMediaList,
  MediaCoverImage,
} from "~/__generated__/graphql";

import { SelectNonNullableFields } from "~/app/utils/typescript-utils";

export enum Season {
  any = "Any",
  Winter = "Winter",
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall",
}

export const getSeason = (date: Date): Exclude<Season, Season.any> => {
  const month = date.getMonth() + 1; // JavaScript months are zero-based
  if (month >= 1 && month <= 3) {
    return Season.Winter;
  } else if (month >= 4 && month <= 6) {
    return Season.Spring;
  } else if (month >= 7 && month <= 9) {
    return Season.Summer;
  } else {
    return Season.Fall;
  }
};
export const YEAR_MAX = new Date().getUTCFullYear() + 1;
export const CURRENT_SEASON = getSeason(new Date());

export const CURRENT_YEAR = new Date().getUTCFullYear();

export const validSeasons = [
  Season.Winter,
  Season.Spring,
  Season.Summer,
  Season.Fall,
] as const;

export enum TernaryState {
  none = "None",
  true = "True",
  false = "False",
}

export enum Category {
  Anime = "Anime",
  Manga = "Manga",
  Character = "Character",
  Staff = "Staff",
  Studio = "Studio",
}

export enum Status {
  any = "Any",
  Releasing = "Releasing",
  Finished = "Finished",
  NotYetReleased = "Not Yet Released",
  Cancelled = "Cancelled",
  Hiatus = "Hiatus",
}

export enum FormatManga {
  any = "Any",
  Manga = "Manga",
  Novel = "Novel",
  OneShot = "One Shot",
}

export enum FormatAnime {
  any = "Any",
  Tv = "TV",
  TvShort = "TV Short",
  Movie = "Movie",
  Special = "Special",
  Ova = "OVA",
  Ona = "ONA",
  Music = "Music",
}

export enum SearchSort {
  SearchMatch = "Search Match",
  TrendingDesc = "Trending",
  PopularityDesc = "Popularity",
  ScoreDesc = "Score",
  StartDateDesc = "Start Date",
  UpdatedAtDesc = "Updated At",
}

export enum ListSort {
  AddedTime = "Added Time",
  AddedTimeDesc = "Added Time Desc",
  FinishedOn = "Finished On",
  FinishedOnDesc = "Finished On Desc",
  MediaPopularity = "Popularity",
  MediaPopularityDesc = "Popularity Desc",
  Progress = "Progress",
  ProgressDesc = "Progress Desc",
  Score = "Score",
  ScoreDesc = "Score Desc",
}

export const animeSearchFilter = z.object({
  sort: z.nativeEnum(SearchSort),
  category: z.literal(Category.Anime),
  status: z.nativeEnum(Status),
  season: z.nativeEnum(Season),
  format: z.nativeEnum(FormatAnime),
  minYear: z.optional(
    z
      .number()
      .min(1970)
      .max(YEAR_MAX)
      .transform((v) => (v === 1970 ? undefined : v)),
  ),
  maxYear: z.optional(
    z
      .number()
      .min(1970)
      .max(YEAR_MAX)
      .transform((v) => (v === YEAR_MAX ? undefined : v)),
  ),
  minEpisode: z.optional(
    z
      .number()
      .min(0)
      .max(150)
      .transform((v) => (v === 0 ? undefined : v)),
  ),
  maxEpisode: z.optional(
    z
      .number()
      .min(0)
      .max(150)
      .transform((v) => (v === 150 ? undefined : v)),
  ),
  minDuration: z.optional(
    z
      .number()
      .min(0)
      .max(200)
      .transform((v) => (v === 0 ? undefined : v)),
  ),
  maxDuration: z.optional(
    z
      .number()
      .min(0)
      .max(200)
      .transform((v) => (v === 200 ? undefined : v)),
  ),
  genre: z.object({
    whitelist: z.array(z.string()),
    blacklist: z.array(z.string()),
  }),
  tag: z.object({
    percentage: z.number().min(0).max(100).default(69),
    whitelist: z.array(z.string()),
    blacklist: z.array(z.string()),
  }),
});

export const mangaSearchFilter = z.object({
  sort: z.nativeEnum(SearchSort),
  category: z.literal(Category.Manga),
  status: z.nativeEnum(Status),
  format: z.nativeEnum(FormatManga),
  minYear: z.optional(
    z
      .number()
      .min(1970)
      .max(YEAR_MAX)
      .transform((v) => (v === 1970 ? undefined : v)),
  ),
  maxYear: z.optional(
    z
      .number()
      .min(1970)
      .max(YEAR_MAX)
      .transform((v) => (v === YEAR_MAX ? undefined : v)),
  ),
  minChapters: z.optional(
    z
      .number()
      .min(0)
      .max(500)
      .transform((v) => (v === 0 ? undefined : v)),
  ),
  maxChapters: z.optional(
    z
      .number()
      .min(0)
      .max(500)
      .transform((v) => (v === 500 ? undefined : v)),
  ),
  minVolumes: z.optional(
    z
      .number()
      .min(0)
      .max(50)
      .transform((v) => (v === 0 ? undefined : v)),
  ),
  maxVolumes: z.optional(
    z
      .number()
      .min(0)
      .max(50)
      .transform((v) => (v === 50 ? undefined : v)),
  ),
  genre: z.object({
    whitelist: z.array(z.string()),
    blacklist: z.array(z.string()),
  }),
  tag: z.object({
    percentage: z.number().min(0).max(100).default(69),
    whitelist: z.array(z.string()),
    blacklist: z.array(z.string()),
  }),
});

export const characterSearchFilter = z.object({
  category: z.literal(Category.Character),
  showBirthdaysOnly: z.nativeEnum(TernaryState),
});

export const staffSearchFilter = z.object({
  category: z.literal(Category.Staff),
  showBirthdaysOnly: z.nativeEnum(TernaryState),
});

export const studioSearchFilter = z.object({
  category: z.literal(Category.Studio),
});

export type AnimeFilter = z.infer<typeof animeSearchFilter>;
export type MangaFilter = z.infer<typeof mangaSearchFilter>;
export type CharacterFilter = z.infer<typeof characterSearchFilter>;
export type StaffFilter = z.infer<typeof staffSearchFilter>;
export type StudioFilter = z.infer<typeof studioSearchFilter>;

export const defaultAnimeFilter: AnimeFilter = {
  sort: SearchSort.SearchMatch,
  category: Category.Anime,
  status: Status.any,
  season: Season.any,
  format: FormatAnime.any,
  minYear: 1970,
  maxYear: YEAR_MAX,
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

export const defaultMangaFilter: MangaFilter = {
  sort: SearchSort.SearchMatch,
  category: Category.Manga,
  status: Status.any,
  format: FormatManga.any,
  minYear: 1970,
  maxYear: YEAR_MAX,
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

export const defaultCharacterFilter: CharacterFilter = {
  category: Category.Character,
  showBirthdaysOnly: TernaryState.none,
};

export const defaultStaffFilter: StaffFilter = {
  category: Category.Staff,
  showBirthdaysOnly: TernaryState.none,
};
export const defaultStudioFilter: StudioFilter = {
  category: Category.Studio,
};

export const searchFilter = z.discriminatedUnion("category", [
  animeSearchFilter,
  mangaSearchFilter,
  characterSearchFilter,
  staffSearchFilter,
  studioSearchFilter,
]);

export type Filter = z.infer<typeof searchFilter>;

export interface MediaList
  extends Omit<AniMediaList, "startedAt" | "completedAt" | "status"> {
  status: ListStatus;
  startedAt: Date | null;
  completedAt: Date | null;
}

export interface CoverImage extends MediaCoverImage {
  blurHash?: string;
}

export interface Media
  extends Omit<
    AniMedia,
    "coverImage" | "mediaListEntry" | "type" | "format" | "status" | "season"
  > {
  mediaListEntry: MediaList | null;
  coverImage: CoverImage;
  status: Omit<Status, Status.any>;
  type: Category.Anime | Category.Manga;
  format: FormatAnime | FormatManga;
  season?: Season;
}

export type SearchResultMedia = SelectNonNullableFields<
  Media,
  | "id"
  | "isAdult"
  | "title"
  | "coverImage"
  | "status"
  | "type"
  | "studios"
  | "genres"
>;

export type Staff = Omit<AniStaff, "image"> & {
  image: {
    large?: string;
    medium?: string;
    blurHash?: string;
  };
};

export type Character = Omit<AniCharacter, "image"> & {
  image: {
    large?: string;
    medium?: string;
    blurHash?: string;
  };
};

export const SeasonValidator = z
  .enum([Season.Summer, Season.Spring, Season.Winter, Season.Fall])
  .catch(CURRENT_SEASON);

export const YearValidator = z
  .number()
  .finite()
  .safe()
  .int()
  .lte(YEAR_MAX)
  .gte(1970)
  .catch(new Date().getUTCFullYear());

/** Media list watching/reading status enum. */
export enum ListStatus {
  /** Finished watching/reading */
  Completed = "Completed",
  /** Currently watching/reading */
  Current = "Current",
  /** Stopped watching/reading before completing */
  Dropped = "Dropped",
  /** Paused watching/reading */
  Paused = "Paused",
  /** Planning to watch/read */
  Planning = "Planning",
  /** Re-watching/reading */
  Repeating = "Repeating",
}

export const ListSortValidator = z
  .nativeEnum(ListSort)
  .catch(ListSort.AddedTimeDesc);

export const ListStatusValidator = z
  .nativeEnum(ListStatus)
  .catch(ListStatus.Current);
