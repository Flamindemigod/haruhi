import { z } from "zod";
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
  
  export enum SearchAnimeSort {
    SearchMatch = 'Search Match',
    Trending = 'Trending',
    TrendingDesc = 'Trending Desc',
    Popularity = 'Popularity',
    PopularityDesc = 'Popularity Desc',
    TitleEnglish = 'Title English',
    TitleEnglishDesc = 'Title English Desc',
    TitleNative = 'Title Native',
    TitleNativeDesc = 'Title Native Desc',
    TitleRomaji = 'Title Romaji',
    TitleRomajiDesc = 'Title Romaji Desc',
    Favourites = 'Favourites',
    FavouritesDesc = 'Favourites Desc',
    Score = 'Score',
    ScoreDesc = 'Score Desc',
    Id = 'Id',
    IdDesc = 'Id Desc',
    Status = 'Status',
    StatusDesc = 'Status Desc',
    Format = 'Format',
    FormatDesc = 'Format Desc',
    Episodes = 'Episodes',
    EpisodesDesc = 'Episodes Desc',
    Duration = 'Duration',
    DurationDesc = 'Duration Desc',
    StartDate = 'Start Date',
    StartDateDesc = 'Start Date Desc',
    EndDate = 'End Date',
    EndDateDesc = 'End Date Desc',
    UpdatedAt = 'Updated At',
    UpdatedAtDesc = 'Updated At Desc',
  }

  

  
  export const animeSearchFilter =  z.object(
    {
      sort: z.nativeEnum(SearchAnimeSort),
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
  
  export type AnimeFilter = z.infer<typeof animeSearchFilter>