import { z } from "zod";
import { Media as AniMedia, Maybe } from "~/__generated__/graphql";
import { Replace } from "~/app/utils/typescript-utils";

export enum TernaryState {
  none = "None",
  true = "True",
  false = "False",
}
export enum Season {
  any = "Any",
  Winter = "Winter",
  Spring = "Spring",
  Summer = "Summer",
  Fall = "Fall",
}

export enum Category {
  anime = "Anime",
  manga = "Manga",
  character = "Character",
  staff = "Staff",
  studio = "Studio",
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

export const animeSearchFilter = z.object({
  sort: z.nativeEnum(SearchSort),
  category: z.literal("Anime"),
  status: z.nativeEnum(Status),
  season: z.nativeEnum(Season),
  format: z.nativeEnum(FormatAnime),
  minYear: z.optional(
    z
      .number()
      .min(1970)
      .max(2024)
      .transform((v) => (v === 1970 ? undefined : v)),
  ),
  maxYear: z.optional(
    z
      .number()
      .min(1970)
      .max(2024)
      .transform((v) => (v === 2024 ? undefined : v)),
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
  category: z.literal(Category.manga),
  status: z.nativeEnum(Status),
  format: z.nativeEnum(FormatManga),
  minYear: z.optional(
    z
      .number()
      .min(1970)
      .max(2024)
      .transform((v) => (v === 1970 ? undefined : v)),
  ),
  maxYear: z.optional(
    z
      .number()
      .min(1970)
      .max(2024)
      .transform((v) => (v === 2024 ? undefined : v)),
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
  category: z.literal(Category.character),
  showBirthdaysOnly: z.nativeEnum(TernaryState),
});

export const staffSearchFilter = z.object({
  category: z.literal(Category.staff),
  showBirthdaysOnly: z.nativeEnum(TernaryState),
});

export const studioSearchFilter = z.object({
  category: z.literal("Studio"),
});

export type AnimeFilter = z.infer<typeof animeSearchFilter>;
export type MangaFilter = z.infer<typeof mangaSearchFilter>;
export type CharacterFilter = z.infer<typeof characterSearchFilter>;
export type StaffFilter = z.infer<typeof staffSearchFilter>;
export type StudioFilter = z.infer<typeof studioSearchFilter>;

export const defaultAnimeFilter: AnimeFilter = {
  sort: SearchSort.SearchMatch,
  category: Category.anime,
  status: Status.any,
  season: Season.any,
  format: FormatAnime.any,
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

export const defaultMangaFilter: MangaFilter = {
  sort: SearchSort.SearchMatch,
  category: Category.manga,
  status: Status.any,
  format: FormatManga.any,
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

export const defaultCharacterFilter: CharacterFilter = {
  category: Category.character,
  showBirthdaysOnly: TernaryState.none,
};

export const defaultStaffFilter: StaffFilter = {
  category: Category.staff,
  showBirthdaysOnly: TernaryState.none,
};
export const defaultStudioFilter: StudioFilter = {
  category: Category.studio,
};

export const searchFilter = z.discriminatedUnion("category", [
  animeSearchFilter,
  mangaSearchFilter,
  characterSearchFilter,
  staffSearchFilter,
  studioSearchFilter,
]);

export type Filter = z.infer<typeof searchFilter>;

export type Media = Replace<
                      Replace<
                        Replace<
                          AniMedia,
                          "format",
                           Maybe<FormatAnime | FormatManga>>,
                        "status",
                        Maybe<Status>
                      >,
                      "season",
                      Maybe<Season>
                    >;
