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
  User_CurrentQuery,
  User_CurrentQueryVariables,
  User_RecommendedQuery,
  User_RecommendedQueryVariables,
} from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import convertEnum from "~/app/utils/convertEnum";
import generateBlurhash from "~/app/utils/generateBlurhash";
import getSeason from "~/app/utils/getSeason";
import {
  NonNullableFields,
  RenameByT,
  Replace,
} from "~/app/utils/typescript-utils";
import {
  GET_GENRES,
  GET_TAGS,
  SEARCH_ANIME_MANGA,
  SEARCH_CHARACTERS,
  SEARCH_STAFF,
  SEARCH_STUDIO,
  TRENDING_ANIME_MANGA,
  USER_CURRENT,
  USER_RECOMMENDED,
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

  getRecommendedAnime: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let animeAccumulated: Map<number, Media> = new Map();
    let vars = {
      page: 0,
      type: "ANIME",
      userName,
      perPage: 10,
    } as NonNullableFields<User_RecommendedQueryVariables>;
    while (true) {
      if ([...animeAccumulated.keys()].length > 25) {
        break;
      }
      if (!!vars.page) {
        vars.page += 1;
      }
      let { data: animeData } = await client.query<User_RecommendedQuery>({
        query: USER_RECOMMENDED,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      await Promise.all(
        animeData.Page?.mediaList?.map(async (m) => {
          return await Promise.all(
            m?.media?.recommendations?.edges?.map(async (r) => {
              if (
                !!r &&
                !!r.node &&
                !!r.node?.mediaRecommendation &&
                r?.node?.rating! > 20 &&
                !r.node?.mediaRecommendation?.mediaListEntry
              ) {
                if ([...animeAccumulated.keys()].length > 25) return false;
                const recommendation = r.node.mediaRecommendation;
                animeAccumulated.set(recommendation.id, {
                  ...recommendation,
                  coverImage: {
                    ...recommendation.coverImage,
                    blurHash: await generateBlurhash(
                      recommendation.coverImage!.medium!,
                    ),
                  },
                  type: Category.anime,
                  format: convertEnum(
                    MediaFormat,
                    FormatAnime,
                    recommendation.format,
                  ) as FormatAnime,
                  status: convertEnum(
                    MediaStatus,
                    Status,
                    recommendation.status,
                  ) as Status,
                  season: convertEnum(
                    MediaSeason,
                    Season,
                    recommendation.season,
                  ) as Season,
                } as Media);
              }
              return true;
            }) ?? [],
          );
        }) ?? [],
      );
      return [...animeAccumulated.values()];
    }
  }),

  getRecommendedManga: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let mangaAccumulated: Map<number, Media> = new Map();
    let vars = {
      page: 0,
      type: "MANGA",
      userName,
      perPage: 10,
    } as NonNullableFields<User_RecommendedQueryVariables>;
    while (true) {
      if ([...mangaAccumulated.keys()].length > 25) {
        break;
      }
      if (!!vars.page) {
        vars.page += 1;
      }
      let { data: mangaData } = await client.query<User_RecommendedQuery>({
        query: USER_RECOMMENDED,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      await Promise.all(
        mangaData.Page?.mediaList?.map(async (m) => {
          return await Promise.all(
            m?.media?.recommendations?.edges?.map(async (r) => {
              if (
                !!r &&
                !!r.node &&
                !!r.node?.mediaRecommendation &&
                r?.node?.rating! > 20 &&
                !r.node?.mediaRecommendation?.mediaListEntry
              ) {
                if ([...mangaAccumulated.keys()].length > 25) return false;
                const recommendation = r.node.mediaRecommendation;
                mangaAccumulated.set(recommendation.id, {
                  ...recommendation,
                  coverImage: {
                    ...recommendation.coverImage,
                    blurHash: await generateBlurhash(
                      recommendation.coverImage!.medium!,
                    ),
                  },
                  type: Category.manga,
                  format: convertEnum(
                    MediaFormat,
                    FormatManga,
                    recommendation.format,
                  ) as FormatManga,
                  status: convertEnum(
                    MediaStatus,
                    Status,
                    recommendation.status,
                  ) as Status,
                } as Media);
              }
              return true;
            }) ?? [],
          );
        }) ?? [],
      );
      return [...mangaAccumulated.values()];
    }
  }),

  getCurrentAnime: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 0,
      type: "ANIME",
      userName,
      perPage: 25,
    } as NonNullableFields<User_CurrentQueryVariables>;
    let data: Media[] = [];
    while (true) {
      if (!!vars.page) {
        vars.page += 1;
      }
      let { data: animeData } = await client.query<User_CurrentQuery>({
        query: USER_CURRENT,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      data = [
        ...data,
        ...((
          await Promise.all(
            animeData.Page?.mediaList
              ?.map(async (m) => {
                if (!!m && !!m.media) {
                  return {
                    ...m.media,
                    coverImage: {
                      ...m.media.coverImage,
                      blurHash: await generateBlurhash(
                        m.media.coverImage!.medium!,
                      ),
                    },
                    type: Category.anime,
                    format: convertEnum(
                      MediaFormat,
                      FormatAnime,
                      m.media.format,
                    ) as FormatAnime,
                    status: convertEnum(
                      MediaStatus,
                      Status,
                      m.media.status,
                    ) as Status,
                    season: convertEnum(
                      MediaSeason,
                      Season,
                      m.media.season,
                    ) as Season,
                  } as Media;
                }
                return null;
              })
              .filter((d) => (d === null ? false : true)) ?? [],
          )
        ).sort((a, b) => {
          let a_max: number;
          let b_max: number;
          switch (a!.status) {
            case Status.Releasing:
              a_max = a!.nextAiringEpisode?.episode ?? a!.episodes ?? 0;
              break;
            default:
              a_max = a!.episodes ?? 0;
              break;
          }
          switch (b!.status) {
            case Status.Releasing:
              b_max = b!.nextAiringEpisode?.episode ?? b!.episodes ?? 0;
              break;
            default:
              b_max = b!.episodes ?? 0;
              break;
          }
          const aPending = a_max - (a?.mediaListEntry?.progress ?? 0);
          const bPending = b_max - (b?.mediaListEntry?.progress ?? 0);
          return bPending - aPending;
        }) as Media[]),
      ];
      if (!animeData.Page?.pageInfo?.hasNextPage) {
        break;
      }
    }
    return data;
  }),

  getCurrentManga: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 0,
      type: "MANGA",
      userName,
      perPage: 25,
    } as NonNullableFields<User_CurrentQueryVariables>;
    let data: Media[] = [];
    while (true) {
      if (!!vars.page) {
        vars.page += 1;
      }
      let { data: mangaData } = await client.query<User_CurrentQuery>({
        query: USER_CURRENT,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      data = [
        ...data,
        ...((
          await Promise.all(
            mangaData.Page?.mediaList
              ?.map(async (m) => {
                if (!!m && !!m.media) {
                  return {
                    ...m.media,
                    coverImage: {
                      ...m.media.coverImage,
                      blurHash: await generateBlurhash(
                        m.media.coverImage!.medium!,
                      ),
                    },
                    type: Category.manga,
                    format: convertEnum(
                      MediaFormat,
                      FormatManga,
                      m.media.format,
                    ) as FormatManga,
                    status: convertEnum(
                      MediaStatus,
                      Status,
                      m.media.status,
                    ) as Status,
                  } as Media;
                }
                return null;
              })
              .filter((d) => (d === null ? false : true)) ?? [],
          )
        ).sort((a, b) => {
          if (!a?.chapters && !b?.chapters) {
            return 0;
          } else if (!a?.chapters) {
            return 1;
          } else if (!b?.chapters) {
            return -1;
          } else {
            const aPending = a.chapters - (a?.mediaListEntry?.progress ?? 0);
            const bPending = b.chapters - (b?.mediaListEntry?.progress ?? 0);
            return bPending - aPending;
          }
        }) as Media[]),
      ];
      if (!mangaData.Page?.pageInfo?.hasNextPage) {
        break;
      }
    }
    return data;
  }),
});
