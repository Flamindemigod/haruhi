import { z } from "zod";
import { TernaryState } from "~/primitives/ThreeToggleChip";
export enum SearchSeason {
    any = "Any",
    Winter = "Winter",
    Spring = "Spring",
    Summer = "Summer",
    Fall = "Fall",
  }

export enum SearchCategory {
    anime = "Anime",
    manga = "Manga",
    character = "Character",
    staff = "Staff",
    studio = "Studio",
  }
  
  export enum SearchStatus {
    any = "Any",
    Releasing = "Releasing",
    Finished = "Finished",
    NotYetReleased = "Not Yet Released",
    Cancelled = "Cancelled",
    Hiatus = "Hiatus",
  }
  
  export enum SearchFormatManga {
    any = "Any",
    Manga = "Manga",
    Novel = "Novel",
    OneShot = "One Shot",
  }

  export enum SearchFormatAnime {
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
    SearchMatch = 'Search Match',
    TrendingDesc = 'Trending',
    PopularityDesc = 'Popularity',
    ScoreDesc = 'Score',
    StartDateDesc = 'Start Date',
    UpdatedAtDesc = 'Updated At',
  }


  
  export const animeSearchFilter =  z.object(
    {
      sort: z.nativeEnum(SearchSort),
      category: z.string().includes("Anime"),
      status: z.nativeEnum(SearchStatus),
      season: z.nativeEnum(SearchSeason),
      format:z.nativeEnum(SearchFormatAnime),
      minYear: z.optional(z.number().min(1970).max(2024).transform((v) => v === 1970 ? undefined : v)),
      maxYear: z.optional(z.number().min(1970).max(2024).transform((v) => v === 2024 ? undefined : v)),
      minEpisode: z.optional(z.number().min(0).max(150).transform((v) => v === 0 ? undefined : v)),
      maxEpisode: z.optional(z.number().min(0).max(150).transform((v) => v === 150 ? undefined : v)),
      minDuration: z.optional(z.number().min(0).max(200).transform((v) => v === 0 ? undefined : v)),
      maxDuration: z.optional(z.number().min(0).max(200).transform((v) => v === 200 ? undefined : v)),
      genre: z.object({
        whitelist: z.array(z.string()),
        blacklist: z.array(z.string()),
      }),
      tag: z.object({
      percentage: z.number().min(0).max(100).default(69),
        whitelist: z.array(z.string()),
        blacklist: z.array(z.string()),
      }),
    }
  );
  
  export const mangaSearchFilter = z.object( {
    sort: z.nativeEnum(SearchSort),
    category: z.string().includes("Manga"),
    status: z.nativeEnum(SearchStatus),
    format:z.nativeEnum(SearchFormatManga),
    minYear: z.optional(z.number().min(1970).max(2024).transform((v) => v === 1970 ? undefined : v)),
    maxYear: z.optional(z.number().min(1970).max(2024).transform((v) => v === 2024 ? undefined : v)),
    minChapters: z.optional(z.number().min(0).max(500).transform((v) => v === 0 ? undefined : v)),
    maxChapters: z.optional(z.number().min(0).max(500).transform((v) => v === 500 ? undefined : v)),
    minVolumes: z.optional(z.number().min(0).max(50).transform((v) => v === 0 ? undefined : v)),
    maxVolumes: z.optional(z.number().min(0).max(50).transform((v) => v === 50 ? undefined : v)),
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
    category: z.string().includes("Character"),
    showBirthdaysOnly: z.nativeEnum(TernaryState),
  })


  export const staffSearchFilter = z.object({
    category: z.string().includes("Staff"),
    showBirthdaysOnly: z.nativeEnum(TernaryState),
  })


  export const studioSearchFilter = z.object({
    category: z.string().includes("Studio"),
  })


  export type AnimeFilter = z.infer<typeof animeSearchFilter>
  export type MangaFilter = z.infer<typeof mangaSearchFilter>
  export type CharacterFilter = z.infer<typeof characterSearchFilter>
  export type StaffFilter = z.infer<typeof staffSearchFilter>
  export type StudioFilter = z.infer<typeof studioSearchFilter>

 

  export const defaultAnimeFilter: AnimeFilter = {
    sort: SearchSort.SearchMatch,
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


  export const defaultMangaFilter: MangaFilter = {
    sort: SearchSort.SearchMatch,
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

  export const defaultCharacterFilter: CharacterFilter = {
    category: SearchCategory.character,
    showBirthdaysOnly: TernaryState.null,
  };
  
  export const defaultStaffFilter: StaffFilter = {
    category: SearchCategory.staff,
    showBirthdaysOnly: TernaryState.null,
  };
  export const defaultStudioFilter: StudioFilter = {
    category: SearchCategory.studio,
  };


  
  
  