import { z } from "zod";
import { Get_GenresQuery, Get_TagsQuery, MediaFormat, MediaSeason, MediaSort, MediaStatus, Search_Anime_MangaQuery, Search_Anime_MangaQueryVariables } from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import convertEnum from "~/app/utils/convertEnum";
import { GET_GENRES, GET_TAGS,  SEARCH_ANIME_MANGA } from "~/graphql/queries";

import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import { SearchAnimeSort, SearchFormatAnime, SearchSeason, SearchStatus, animeSearchFilter } from "~/types.shared/anilist";


  export const anilistRouter = createTRPCRouter({
    getGenres: publicProcedure.query(async () => {
       const {data}=await client.query<Get_GenresQuery>({
        query: GET_GENRES
       })
       return data;
      }),

    getTags: publicProcedure.query(async () => {
      const {data}=await client.query<Get_TagsQuery>({
        query: GET_TAGS
       })
       return data;
    }),
    
    searchAnime: publicProcedure.input(z.object(
      {
        searchString: z.string(),
        filters:animeSearchFilter
      }
    )).query(async ( { input } ) => {

      const vars = {
        page: 1,
        type: "ANIME",
        sort: convertEnum(SearchAnimeSort, MediaSort, input.filters.sort),
        search: !!input.searchString ? input.searchString : undefined,
        status: convertEnum(SearchStatus, MediaStatus, input.filters.status),
        season: convertEnum(SearchSeason, MediaSeason, input.filters.season),
        format: convertEnum(SearchFormatAnime, MediaFormat, input.filters.format),
        yearGreater: input.filters.minYear ? input.filters.minYear*10000: undefined,
        yearLesser: input.filters.maxYear ? input.filters.maxYear*10000: undefined,  
        episodeGreater: input.filters.minEpisode,
        episodeLesser: input.filters.maxEpisode == 150 ? undefined :input.filters.maxEpisode,  
        minimumTagRank: input.filters.tag.percentage,
        tags:input.filters.tag.whitelist.length == 0 ? undefined :input.filters.tag.whitelist ,
        excludedTags: input.filters.tag.blacklist.length == 0 ? undefined :input.filters.tag.blacklist ,
        genres: input.filters.genre.whitelist.length == 0 ? undefined :input.filters.genre.whitelist ,
        excludedGenres: input.filters.genre.blacklist.length == 0 ? undefined :input.filters.genre.blacklist ,
      }  as Search_Anime_MangaQueryVariables;
      console.log(vars);
      const { data }=  await client.query<Search_Anime_MangaQuery>({
        query:  SEARCH_ANIME_MANGA,
        variables: vars
      })
      
      return data;

    })  
    });
  