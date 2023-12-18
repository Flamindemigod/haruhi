import { z } from "zod";
import {
  CharacterSort,
  Get_GenresQuery,
  Get_TagsQuery,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  Search_Anime_MangaQuery,
  Search_Anime_MangaQueryVariables,
  Search_CharactersDocument,
  Search_CharactersQuery,
  Search_CharactersQueryVariables,
  Search_StaffQuery,
  Search_StaffQueryVariables,
  Search_StudioQuery,
  Search_StudioQueryVariables,
  StaffSort,
  StudioSort,
} from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import convertEnum from "~/app/utils/convertEnum";
import {
  GET_GENRES,
  GET_TAGS,
  SEARCH_ANIME_MANGA,
  SEARCH_CHARACTERS,
  SEARCH_STAFF,
  SEARCH_STUDIO,
} from "~/graphql/queries";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db } from "~/server/db";
import { api } from "~/trpc/server";
import {
  SearchSort,
  SearchFormatAnime,
  SearchSeason,
  SearchStatus,
  searchFilter,
  SearchFormatManga,
} from "~/types.shared/anilist";
export const anilistRouter = createTRPCRouter({
  getGenres: publicProcedure.query(async () => {
    const { data } = await client.query<Get_GenresQuery>({
      query: GET_GENRES,
    });
    return data;
  }),

  getTags: publicProcedure.query(async () => {
    const { data } = await client.query<Get_TagsQuery>({
      query: GET_TAGS,
    });
    return data;
  }),

  search: publicProcedure
    .input(
      z.object({
        searchString: z.string(),
        filters: searchFilter,
      }),
    )
    .query(async ({ ctx,input }) => {
      let userNsfw;
      if (ctx.session?.user){
        let user = await api.user.getUser.query();
        userNsfw = user?.showNSFW
      } else{
        userNsfw = undefined;
      }
      let query;
      let vars;
      let res;
      switch (input.filters.category) {
        case "Anime":
          query = SEARCH_ANIME_MANGA;
          vars = {
            page: 1,
            type: "ANIME",
            isAdult: !userNsfw ? false : undefined,
            sort: convertEnum(SearchSort, MediaSort, input.filters.sort),
            search: !!input.searchString ? input.searchString : undefined,
            status: convertEnum(
              SearchStatus,
              MediaStatus,
              input.filters.status,
            ),
            season: convertEnum(
              SearchSeason,
              MediaSeason,
              input.filters.season,
            ),
            format: convertEnum(
              SearchFormatAnime,
              MediaFormat,
              input.filters.format,
            ),
            yearGreater: input.filters.minYear
              ? input.filters.minYear * 10000
              : undefined,
            yearLesser: input.filters.maxYear
              ? input.filters.maxYear * 10000
              : undefined,
            durationGreater: input.filters.minDuration,
            durationLesser:
              input.filters.maxDuration == 200
                ? undefined
                : input.filters.maxDuration,
            episodeGreater: input.filters.minEpisode,
            episodeLesser:
              input.filters.maxEpisode == 150
                ? undefined
                : input.filters.maxEpisode,
            minimumTagRank: input.filters.tag.percentage,
            tags:
              input.filters.tag.whitelist.length == 0
                ? undefined
                : input.filters.tag.whitelist,
            excludedTags:
              input.filters.tag.blacklist.length == 0
                ? undefined
                : input.filters.tag.blacklist,
            genres:
              input.filters.genre.whitelist.length == 0
                ? undefined
                : input.filters.genre.whitelist,
            excludedGenres:
              input.filters.genre.blacklist.length == 0
                ? undefined
                : input.filters.genre.blacklist,
          } as Search_Anime_MangaQueryVariables;
          let { data: animeData } = await client.query<Search_Anime_MangaQuery>(
            {
              query: query!,
              variables: vars,
            },
          );
          res = animeData;
          break;
        case "Manga":
          query = SEARCH_ANIME_MANGA;
          vars = {
            page: 1,
            type: "MANGA",
            isAdult: !userNsfw ? false : undefined,
            sort: convertEnum(SearchSort, MediaSort, input.filters.sort),
            search: !!input.searchString ? input.searchString : undefined,
            status: convertEnum(
              SearchStatus,
              MediaStatus,
              input.filters.status,
            ),
            format: convertEnum(
              SearchFormatManga,
              MediaFormat,
              input.filters.format,
            ),
            yearGreater: input.filters.minYear
              ? input.filters.minYear * 10000
              : undefined,
            yearLesser: input.filters.maxYear
              ? input.filters.maxYear * 10000
              : undefined,
            volumeGreater: input.filters.minVolumes,
            volumeLesser:
              input.filters.maxVolumes == 500
                ? undefined
                : input.filters.maxVolumes,
            chapterGreater: input.filters.minChapters,
            chapterLesser:
              input.filters.maxChapters == 500
                ? undefined
                : input.filters.maxChapters,
            minimumTagRank: input.filters.tag.percentage,
            tags:
              input.filters.tag.whitelist.length == 0
                ? undefined
                : input.filters.tag.whitelist,
            excludedTags:
              input.filters.tag.blacklist.length == 0
                ? undefined
                : input.filters.tag.blacklist,
            genres:
              input.filters.genre.whitelist.length == 0
                ? undefined
                : input.filters.genre.whitelist,
            excludedGenres:
              input.filters.genre.blacklist.length == 0
                ? undefined
                : input.filters.genre.blacklist,
          } as Search_Anime_MangaQueryVariables;
          const { data: mangaData } =
            await client.query<Search_Anime_MangaQuery>({
              query: query!,
              variables: vars,
            });
          res = mangaData;
          break;
        case "Character":
          query = Search_CharactersDocument;
          vars = {
            page: 1,
            sort: CharacterSort.SearchMatch,
            search: !!input.searchString ? input.searchString : undefined,
            isBirthday: (() => {
              switch (input.filters.showBirthdaysOnly) {
                case "True":
                  return true;
                case "False":
                  return false;
                case "None":
                  return undefined;
              }
            })(),
          } as Search_CharactersQueryVariables;
          const { data: dChar } = await client.query<Search_CharactersQuery>({
            query: query,
            variables: vars,
          });
          res = dChar;
          break;

        case "Staff":
          query = SEARCH_STAFF;
          vars = {
            page: 1,
            sort: StaffSort.SearchMatch,
            search: !!input.searchString ? input.searchString : undefined,
            isBirthday: (() => {
              switch (input.filters.showBirthdaysOnly) {
                case "True":
                  return true;
                case "False":
                  return false;
                case "None":
                  return undefined;
              }
            })(),
          } as Search_StaffQueryVariables;
          const { data: staffData } = await client.query<Search_StaffQuery>({
            query: query,
            variables: vars,
          });
          res = staffData;
          break;
        case "Studio":
          query = SEARCH_STUDIO;
          vars = {
            page: 1,
            sort: StudioSort.SearchMatch,
            search: !!input.searchString ? input.searchString : undefined,
          } as Search_StudioQueryVariables;
          const { data: studioData } = await client.query<Search_StudioQuery>({
            query: query,
            variables: vars,
          });
          res = studioData;
          break;
      }
      return res;
    }),
});
