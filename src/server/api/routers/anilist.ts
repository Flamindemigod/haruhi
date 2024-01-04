import { format } from "path";
import { z } from "zod";
import {
  CharacterSort,
  Get_GenresQuery,
  Get_TagsQuery,
  InputMaybe,
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  Search_Anime_MangaQuery,
  Search_Anime_MangaQueryVariables,
  Search_CharactersQuery,
  Search_CharactersQueryVariables,
  Search_StaffQuery,
  Search_StaffQueryVariables,
  Search_StudioQuery,
  Search_StudioQueryVariables,
  StaffSort,
  Studio,
  StudioSort,
  Trending_Anime_MangaQuery,
  Trending_Anime_MangaQueryVariables,
} from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import convertEnum from "~/app/utils/convertEnum";
import generateBlurhash from "~/app/utils/generateBlurhash";
import getSeason from "~/app/utils/getSeason";
import { RenameByT, Replace } from "~/app/utils/typescript-utils";
import {
  GET_GENRES,
  GET_TAGS,
  SEARCH_ANIME_MANGA,
  SEARCH_CHARACTERS,
  SEARCH_STAFF,
  SEARCH_STUDIO,
  TRENDING_ANIME_MANGA,
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
  FormatAnime,
  FormatManga,
  Season,
  Status,
  Media,
  SearchResultMedia,
  Category,
  animeSearchFilter,
  mangaSearchFilter,
  characterSearchFilter,
  staffSearchFilter,
  studioSearchFilter,
  Character,
  Staff,
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

  searchAnime: publicProcedure
    .input(
      z.object({
        searchString: z.string(),
        filters: animeSearchFilter,
      }),
    )
    .query(async ({ ctx, input }) => {
      let userNsfw;
      if (!!ctx.session?.user) {
        let user = await api.user.getUser.query();
        userNsfw = user?.showNSFW;
      } else {
        userNsfw = undefined;
      }
      const vars = {
        page: 1,
        type: "ANIME",
        isAdult: !userNsfw ? false : undefined,
        sort: convertEnum(SearchSort, MediaSort, input.filters.sort),
        search: !!input.searchString ? input.searchString : undefined,
        status: convertEnum(Status, MediaStatus, input.filters.status),
        season: convertEnum(Season, MediaSeason, input.filters.season),
        format: convertEnum(FormatAnime, MediaFormat, input.filters.format),
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
      let { data: animeData } = await client.query<Search_Anime_MangaQuery>({
        query: SEARCH_ANIME_MANGA,
        variables: vars,
      });

      if (!!animeData.Page) {
        let dAnime: Replace<
          Search_Anime_MangaQuery,
          "Page",
          RenameByT<
            { media: "data" },
            Replace<
              NonNullable<Search_Anime_MangaQuery["Page"]>,
              "media",
              Media[]
            >
          >
        > = {
          ...animeData,
          Page: { ...animeData.Page, data: [] },
        };
        dAnime.Page.data = await Promise.all(
          animeData.Page.media!.map(async (m: any) => {
            return {
              ...m,
              coverImage: {
                ...m.coverImage,
                blurHash: await generateBlurhash(m.coverImage.medium),
              },
              type: Category.anime,
              format: convertEnum(
                MediaFormat,
                FormatAnime,
                m.format,
              ) as FormatAnime,
              status: convertEnum(MediaStatus, Status, m.status) as Status,
              season: convertEnum(MediaSeason, Season, m.season) as Season,
            } as SearchResultMedia;
          }),
        );
        return dAnime;
      }
    }),

  searchManga: publicProcedure
    .input(
      z.object({
        searchString: z.string(),
        filters: mangaSearchFilter,
      }),
    )
    .query(async ({ ctx, input }) => {
      let userNsfw;
      if (!!ctx.session?.user) {
        let user = await api.user.getUser.query();
        userNsfw = user?.showNSFW;
      } else {
        userNsfw = undefined;
      }
      const vars = {
        page: 1,
        type: "MANGA",
        isAdult: !userNsfw ? false : undefined,
        sort: convertEnum(SearchSort, MediaSort, input.filters.sort),
        search: !!input.searchString ? input.searchString : undefined,
        status: convertEnum(Status, MediaStatus, input.filters.status),
        format: convertEnum(FormatManga, MediaFormat, input.filters.format),
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
      let { data: mangaData } = await client.query<Search_Anime_MangaQuery>({
        query: SEARCH_ANIME_MANGA,
        variables: vars,
      });

      if (!!mangaData.Page) {
        let dManga: Replace<
          Search_Anime_MangaQuery,
          "Page",
          RenameByT<
            { media: "data" },
            Replace<
              NonNullable<Search_Anime_MangaQuery["Page"]>,
              "media",
              Media[]
            >
          >
        > = {
          ...mangaData,
          Page: { ...mangaData.Page, data: [] },
        };
        dManga.Page.data = await Promise.all(
          mangaData.Page.media!.map(async (m: any) => {
            return {
              ...m,
              coverImage: {
                ...m.coverImage,
                blurHash: await generateBlurhash(m.coverImage.medium),
              },
              type: Category.manga,
              format: convertEnum(
                MediaFormat,
                FormatManga,
                m.format,
              ) as FormatManga,
              status: convertEnum(MediaStatus, Status, m.status) as Status,
            } as SearchResultMedia;
          }),
        );
        return dManga;
      }
    }),

  searchCharacters: publicProcedure
    .input(
      z.object({
        searchString: z.string(),
        filters: characterSearchFilter,
      }),
    )
    .query(async ({ input }) => {
      const vars = {
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
      let { data: characterData } = await client.query<Search_CharactersQuery>({
        query: SEARCH_CHARACTERS,
        variables: vars,
      });

      if (!!characterData.Page) {
        let dChar: Replace<
          Search_CharactersQuery,
          "Page",
          RenameByT<
            { characters: "data" },
            Replace<
              NonNullable<Search_CharactersQuery["Page"]>,
              "characters",
              Character[]
            >
          >
        > = {
          ...characterData,
          Page: { ...characterData.Page, data: [] },
        };
        dChar.Page.data = await Promise.all(
          characterData.Page.characters!.map(async (m: any) => {
            return {
              ...m,
              image: {
                ...m.image,
                blurHash: await generateBlurhash(m.image.medium),
              },
            } as Character;
          }),
        );
        return dChar;
      }
    }),

  searchStaff: publicProcedure
    .input(
      z.object({
        searchString: z.string(),
        filters: staffSearchFilter,
      }),
    )
    .query(async ({ input }) => {
      const vars = {
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
      let { data: staffData } = await client.query<Search_StaffQuery>({
        query: SEARCH_STAFF,
        variables: vars,
      });

      if (!!staffData.Page) {
        let dStaff: Replace<
          Search_StaffQuery,
          "Page",
          RenameByT<
            { staff: "data" },
            Replace<NonNullable<Search_StaffQuery["Page"]>, "staff", Staff[]>
          >
        > = {
          ...staffData,
          Page: { ...staffData.Page, data: [] },
        };
        dStaff.Page.data = await Promise.all(
          staffData.Page.staff!.map(async (m: any) => {
            return {
              ...m,
              image: {
                ...m.image,
                blurHash: await generateBlurhash(m.image.medium),
              },
            } as Staff;
          }),
        );

        return dStaff;
      }
    }),

  searchStudio: publicProcedure
    .input(
      z.object({
        searchString: z.string(),
        filters: studioSearchFilter,
      }),
    )
    .query(async ({ input }) => {
      const vars = {
        page: 1,
        sort: StudioSort.SearchMatch,
        search: !!input.searchString ? input.searchString : undefined,
      } as Search_StudioQueryVariables;
      let { data: studioData } = await client.query<Search_StudioQuery>({
        query: SEARCH_STUDIO,
        variables: vars,
      });
      if (!!studioData.Page) {
        let dStudio: Replace<
          Search_StudioQuery,
          "Page",
          RenameByT<
            { studios: "data" },
            Replace<
              NonNullable<Search_StudioQuery["Page"]>,
              "studios",
              Studio[]
            >
          >
        > = {
          ...studioData,
          Page: { ...studioData.Page, data: [] },
        };
        dStudio.Page.data = (studioData.Page?.studios ?? []) as Studio[];
        return dStudio;
      }
    }),

  getTrendingAnime: publicProcedure
    .input(
      z.object({
        seasonal: z.boolean().default(false),
        sort: z.nativeEnum(MediaSort).default(MediaSort.PopularityDesc),
        format: z.nativeEnum(FormatAnime).default(FormatAnime.any),
      }),
    )
    .query(async ({ ctx, input }) => {
      let userNsfw;

      if (!!ctx.session?.user) {
        let user = await api.user.getUser.query();
        userNsfw = user?.showNSFW;
      } else {
        userNsfw = undefined;
      }
      const fallback = input.sort === MediaSort.TrendingDesc ? null : undefined;
      const vars = {
        page: 1,
        sort: input.sort,
        isAdult: !userNsfw ? false : undefined,
        type: "ANIME",
        status: convertEnum(
          Status,
          MediaStatus,
          Status.any,
        ) as MediaStatus | null,
        format: convertEnum(
          FormatAnime,
          MediaFormat,
          input.format,
        ) as MediaFormat | null,
        season: input.seasonal
          ? convertEnum(Season, MediaSeason, getSeason(new Date(Date.now())))
          : fallback,
        seasonYear: input.seasonal
          ? new Date(Date.now()).getFullYear()
          : fallback,
      } as Trending_Anime_MangaQueryVariables;
      let { data: animeData } = await client.query<Trending_Anime_MangaQuery>({
        query: TRENDING_ANIME_MANGA,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      if (!!animeData.Page) {
        let dAnime: Replace<
          Trending_Anime_MangaQuery,
          "Page",
          RenameByT<
            { media: "data" },
            Replace<
              NonNullable<Trending_Anime_MangaQuery["Page"]>,
              "media",
              Media[]
            >
          >
        > = {
          ...animeData,
          Page: { ...animeData.Page, data: [] },
        };
        dAnime.Page.data = await Promise.all(
          animeData.Page.media!.map(async (m: any) => {
            return {
              ...m,
              coverImage: {
                ...m.coverImage,
                blurHash: await generateBlurhash(m.coverImage.medium),
              },
              type: Category.anime,
              format: convertEnum(
                MediaFormat,
                FormatAnime,
                m.format,
              ) as FormatAnime,
              status: convertEnum(MediaStatus, Status, m.status) as Status,
              season: convertEnum(MediaSeason, Season, m.season) as Season,
            } as SearchResultMedia;
          }),
        );
        return dAnime;
      }
    }),

  getTrendingManga: publicProcedure
    .input(
      z.object({
        sort: z.nativeEnum(MediaSort).default(MediaSort.PopularityDesc),
        format: z.nativeEnum(FormatManga).default(FormatManga.any),
      }),
    )
    .query(async ({ ctx, input }) => {
      let userNsfw;

      if (!!ctx.session?.user) {
        let user = await api.user.getUser.query();
        userNsfw = user?.showNSFW;
      } else {
        userNsfw = undefined;
      }
      const fallback = input.sort === MediaSort.TrendingDesc ? null : undefined;
      const vars = {
        page: 1,
        sort: input.sort,
        isAdult: !userNsfw ? false : undefined,
        type: "MANGA",
        status: convertEnum(
          Status,
          MediaStatus,
          Status.any,
        ) as MediaStatus | null,
        format: convertEnum(
          FormatAnime,
          MediaFormat,
          input.format,
        ) as MediaFormat | null,
      } as Trending_Anime_MangaQueryVariables;
      let { data: mangaData } = await client.query<Trending_Anime_MangaQuery>({
        query: TRENDING_ANIME_MANGA,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      if (!!mangaData.Page) {
        let dManga: Replace<
          Trending_Anime_MangaQuery,
          "Page",
          RenameByT<
            { media: "data" },
            Replace<
              NonNullable<Trending_Anime_MangaQuery["Page"]>,
              "media",
              Media[]
            >
          >
        > = {
          ...mangaData,
          Page: { ...mangaData.Page, data: [] },
        };
        dManga.Page.data = await Promise.all(
          mangaData.Page.media!.map(async (m: any) => {
            return {
              ...m,
              coverImage: {
                ...m.coverImage,
                blurHash: await generateBlurhash(m.coverImage.medium),
              },
              type: Category.manga,
              format: convertEnum(
                MediaFormat,
                FormatManga,
                m.format,
              ) as FormatAnime,
              status: convertEnum(MediaStatus, Status, m.status) as Status,
              season: convertEnum(MediaSeason, Season, m.season) as Season,
            } as SearchResultMedia;
          }),
        );
        return dManga;
      }
    }),
});
