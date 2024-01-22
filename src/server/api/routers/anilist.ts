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
  MediaList,
  User_Up_NextQueryVariables,
  User_Up_NextQuery,
  SeasonalQueryVariables,
  SeasonalQuery,
  MediaListStatus,
} from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import convertEnum from "~/app/utils/convertEnum";
import generateBlurhash from "~/app/utils/generateBlurhash";
import { recommendationBuilder } from "~/app/utils/recommendationBuilder";
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
  SEASONAL,
  TRENDING_ANIME_MANGA,
  USER_CURRENT,
  USER_RECOMMENDED,
  USER_UP_NEXT,
} from "~/graphql/queries";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { db, redis } from "~/server/db";
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
  getSeason,
  SeasonValidator,
  YearValidator,
  ListStatus,
} from "~/types.shared/anilist";
import { buildRecommendationKey } from "~/types.shared/redis";
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
              mediaListEntry: !!m.mediaListEntry
                ? {
                    ...m.mediaListEntry,
                    status: convertEnum(
                      MediaListStatus,
                      ListStatus,
                      m.mediaListEntry.status,
                    ),
                  }
                : null,
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
              mediaListEntry: !!m.mediaListEntry
                ? {
                    ...m.mediaListEntry,
                    status: convertEnum(
                      MediaListStatus,
                      ListStatus,
                      m.mediaListEntry.status,
                    ),
                  }
                : null,
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
              mediaListEntry: !!m.mediaListEntry
                ? {
                    ...m.mediaListEntry,
                    status: convertEnum(
                      MediaListStatus,
                      ListStatus,
                      m.mediaListEntry.status,
                    ),
                  }
                : null,
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
              mediaListEntry: !!m.mediaListEntry
                ? {
                    ...m.mediaListEntry,
                    status: convertEnum(
                      MediaListStatus,
                      ListStatus,
                      m.mediaListEntry.status,
                    ),
                  }
                : null,
            } as SearchResultMedia;
          }),
        );
        return dManga;
      }
    }),

  getRecommendedAnime: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    const userID = user?.aniid!;

    const key = buildRecommendationKey(userID, Category.anime);

    const data = await redis.get<Media[]>(key);
    if (!!data) {
      return data;
    }

    let animeAccumulated: Map<number, Media> = new Map();
    let vars = {
      page: 0,
      type: "ANIME",
      userName,
      perPage: 25,
    } as NonNullableFields<User_RecommendedQueryVariables>;
    while (true) {
      if (animeAccumulated.size > 25) {
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
      animeAccumulated = await recommendationBuilder(
        animeData.Page?.mediaList as MediaList[],
        animeAccumulated,
      );
      break;
    }

    await redis.set(key, [...animeAccumulated.values()], {
      ex: 60 * 60 * 24, // Time to Expire In Seconds 60*60*24 = 1 day;
    });
    return [...animeAccumulated.values()];
  }),

  getRecommendedManga: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    const userID = user?.aniid!;

    const key = buildRecommendationKey(userID, Category.manga);

    const data = await redis.get<Media[]>(key);
    if (!!data) {
      return data;
    }

    let mangaAccumulated: Map<number, Media> = new Map();
    let vars = {
      page: 0,
      type: "MANGA",
      userName,
      perPage: 10,
    } as NonNullableFields<User_RecommendedQueryVariables>;
    while (true) {
      if (mangaAccumulated.size > 25) {
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
      mangaAccumulated = await recommendationBuilder(
        mangaData.Page?.mediaList as MediaList[],
        mangaAccumulated,
      );
      break;
    }
    await redis.set(key, [...mangaAccumulated.values()], {
      ex: 60 * 60 * 24, // Time to Expire In Seconds 60*60*24 = 1 day;
    });

    return [...mangaAccumulated.values()];
  }),

  getCurrentAnime: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 0,
      type: "ANIME",
      userName,
      perPage: 50,
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
                    mediaListEntry: !!m.media.mediaListEntry
                      ? {
                          ...m.media.mediaListEntry,
                          status: convertEnum(
                            MediaListStatus,
                            ListStatus,
                            m.media.mediaListEntry.status,
                          ),
                        }
                      : null,
                  } as Media;
                }
                return null;
              })
              .filter(Boolean) ?? [],
          )
        ).sort((a, b) => {
          let a_max: number;
          let b_max: number;
          switch (a!.status) {
            case Status.Releasing:
              if (
                a?.nextAiringEpisode?.episode! - 1 >
                a?.mediaListEntry?.progress!
              ) {
                return -1;
              }
              a_max = a!.nextAiringEpisode?.episode ?? a!.episodes ?? 0;
              break;
            default:
              a_max = a!.episodes ?? 0;
              break;
          }
          switch (b!.status) {
            case Status.Releasing:
              if (
                b!.nextAiringEpisode?.episode! - 1 >
                b!.mediaListEntry?.progress!
              ) {
                return 1;
              }
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
      break;
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
      perPage: 50,
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
                    mediaListEntry: !!m.media.mediaListEntry
                      ? {
                          ...m.media.mediaListEntry,
                          status: convertEnum(
                            MediaListStatus,
                            ListStatus,
                            m.media.mediaListEntry.status,
                          ),
                        }
                      : null,
                  } as Media;
                }
                return null;
              })
              .filter(Boolean) ?? [],
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

  getPendingAnime: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 1,
      type: "ANIME",
      userName,
      perPage: 25,
    } as NonNullableFields<User_Up_NextQueryVariables>;
    let data: Media[] = [];
    let { data: animeData } = await client.query<User_Up_NextQuery>({
      query: USER_UP_NEXT,
      variables: vars,
      context: {
        headers: !!ctx.session
          ? {
              Authorization: "Bearer " + ctx.session.user.token,
            }
          : {},
      },
    });
    data = (
      await Promise.all(
        animeData.Page?.mediaList?.map(async (m) => {
          if (!!m && !!m.media) {
            return {
              ...m.media,
              coverImage: {
                ...m.media.coverImage,
                blurHash: await generateBlurhash(m.media.coverImage!.medium!),
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
              mediaListEntry: !!m.media.mediaListEntry
                ? {
                    ...m.media.mediaListEntry,
                    status: convertEnum(
                      MediaListStatus,
                      ListStatus,
                      m.media.mediaListEntry.status,
                    ),
                  }
                : null,
            } as Media;
          }
          return null;
        }) ?? [],
      )
    ).filter(Boolean) as Media[];
    return data;
  }),

  getPendingManga: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 1,
      type: "MANGA",
      userName,
      perPage: 25,
    } as NonNullableFields<User_Up_NextQueryVariables>;
    let data: Media[] = [];
    let { data: mangaData } = await client.query<User_Up_NextQuery>({
      query: USER_UP_NEXT,
      variables: vars,
      context: {
        headers: !!ctx.session
          ? {
              Authorization: "Bearer " + ctx.session.user.token,
            }
          : {},
      },
    });
    data = (
      await Promise.all(
        mangaData.Page?.mediaList?.map(async (m) => {
          if (!!m && !!m.media) {
            return {
              ...m.media,
              coverImage: {
                ...m.media.coverImage,
                blurHash: await generateBlurhash(m.media.coverImage!.medium!),
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
              mediaListEntry: !!m.media.mediaListEntry
                ? {
                    ...m.media.mediaListEntry,
                    status: convertEnum(
                      MediaListStatus,
                      ListStatus,
                      m.media.mediaListEntry.status,
                    ),
                  }
                : null,
            } as Media;
          }
          return null;
        }) ?? [],
      )
    ).filter(Boolean) as Media[];
    return data;
  }),

  getSeasonal: publicProcedure
    .input(
      z.object({
        cursor: z.number().positive().nullish().default(1),
        season: SeasonValidator,
        year: YearValidator,
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input.cursor) return null;
      let userNsfw;
      if (!!ctx.session?.user) {
        let user = await api.user.getUser.query();
        userNsfw = user?.showNSFW;
      } else {
        userNsfw = undefined;
      }

      let vars = {
        page: input.cursor,
        perPage: 25,
        season: convertEnum(Season, MediaSeason, input.season),
        seasonYear: input.year,
        isAdult: !userNsfw ? false : undefined,
      } as NonNullableFields<SeasonalQueryVariables>;
      let data: Media[] = [];
      let { data: animeData } = await client.query<SeasonalQuery>({
        query: SEASONAL,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: "Bearer " + ctx.session.user.token,
              }
            : {},
        },
      });
      data = (
        await Promise.all(
          animeData.Page?.media?.map(async (media) => {
            if (!!media) {
              return {
                ...media,
                coverImage: {
                  ...media.coverImage,
                  blurHash: await generateBlurhash(media.coverImage!.medium!),
                },
                type: Category.anime,
                format: convertEnum(
                  MediaFormat,
                  FormatAnime,
                  media.format,
                ) as FormatAnime,
                status: convertEnum(
                  MediaStatus,
                  Status,
                  media.status,
                ) as Status,
                season: convertEnum(
                  MediaSeason,
                  Season,
                  media.season,
                ) as Season,
                mediaListEntry: !!media.mediaListEntry
                  ? {
                      ...media.mediaListEntry,
                      status: convertEnum(
                        MediaListStatus,
                        ListStatus,
                        media.mediaListEntry.status,
                      ),
                    }
                  : null,
              } as Media;
            }
            return null;
          }) ?? [],
        )
      ).filter(Boolean) as Media[];
      return {
        data,
        nextCursor: !!animeData.Page?.pageInfo?.hasNextPage
          ? ++input.cursor
          : undefined,
      };
    }),
});
