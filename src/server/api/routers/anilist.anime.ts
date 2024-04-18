import { z } from 'zod';
import { client } from '~/apolloClient';
import {
  MediaFormat,
  MediaSeason,
  MediaSort,
  MediaStatus,
  Trending_Anime_MangaQuery,
  Trending_Anime_MangaQueryVariables,
  User_ListQuery,
  User_ListQueryVariables,
  User_RecommendedQuery,
  User_RecommendedQueryVariables,
  MediaList,
  User_Up_NextQueryVariables,
  User_Up_NextQuery,
  SeasonalQueryVariables,
  SeasonalQuery,
  MediaListStatus,
  MediaListSort,
  Media as AniMedia,
} from '~/__generated__/graphql';
import convertEnum from '~/app/utils/convertEnum';
import mediaBuilder from '~/app/utils/mediaBuilder';
import {
  recommendationBuilder,
  recommendationGenBlurs,
} from '~/app/utils/recommendationBuilder';
import {
  NonNullableFields,
  RenameByT,
  Replace,
} from '~/app/utils/typescript-utils';
import {
  SEASONAL,
  TRENDING_ANIME_MANGA,
  USER_LIST,
  USER_RECOMMENDED,
  USER_UP_NEXT,
} from '~/graphql/queries';

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '~/server/api/trpc';
import { db, redis } from '~/server/db';
import { api } from '~/trpc/server';
import {
  FormatAnime,
  Season,
  Status,
  Media,
  SearchResultMedia,
  Category,
  getSeason,
  SeasonValidator,
  YearValidator,
  ListStatus,
  ListStatusValidator,
  ListSortValidator,
  ListSort,
} from '~/types.shared/anilist';
import { buildRecommendationKey } from '~/types.shared/redis';

export const animeRouter = createTRPCRouter({
  getTrending: publicProcedure
    .input(
      z.object({
        seasonal: z.boolean().default(false),
        sort: z.nativeEnum(MediaSort).default(MediaSort.PopularityDesc),
        format: z.nativeEnum(FormatAnime).default(FormatAnime.any),
      })
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
        type: 'ANIME',
        status: convertEnum(
          Status,
          MediaStatus,
          Status.any
        ) as MediaStatus | null,
        format: convertEnum(
          FormatAnime,
          MediaFormat,
          input.format
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
                Authorization: 'Bearer ' + ctx.session.user.token,
              }
            : {},
        },
      });
      let dAnime: Media[] = [];
      if (!!animeData.Page) {
        dAnime = await Promise.all(
          animeData.Page.media!.map(async (m) => {
            return (await mediaBuilder(m as AniMedia)) as Media;
          })
        );
      }
      return dAnime;
    }),
  getRecommended: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    const userID = user?.aniid!;

    const key = buildRecommendationKey(userID, Category.Anime);

    const data = await redis.get<Media[]>(key);
    if (!!data) {
      return await recommendationGenBlurs(data);
    }

    let animeAccumulated: Map<number, Media> = new Map();
    let vars = {
      page: 0,
      type: 'ANIME',
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
                Authorization: 'Bearer ' + ctx.session.user.token,
              }
            : {},
        },
      });
      animeAccumulated = await recommendationBuilder(
        animeData.Page?.mediaList as MediaList[],
        animeAccumulated
      );
      break;
    }

    await redis.set(key, [...animeAccumulated.values()], {
      ex: 60 * 60 * 24, // Time to Expire In Seconds 60*60*24 = 1 day;
    });
    return await recommendationGenBlurs([...animeAccumulated.values()]);
  }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 0,
      type: 'ANIME',
      userName,
      perPage: 50,
    } as NonNullableFields<User_ListQueryVariables>;
    let data: Media[] = [];
    while (true) {
      if (!!vars.page) {
        vars.page += 1;
      }
      let { data: animeData } = await client.query<User_ListQuery>({
        query: USER_LIST,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: 'Bearer ' + ctx.session.user.token,
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
                  return await mediaBuilder(m.media as AniMedia);
                }
                return null;
              })
              .filter(Boolean) ?? []
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
  getPending: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 1,
      type: 'ANIME',
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
              Authorization: 'Bearer ' + ctx.session.user.token,
            }
          : {},
      },
    });
    data = (
      await Promise.all(
        animeData.Page?.mediaList?.map(async (m) => {
          if (!!m && !!m.media) {
            return await mediaBuilder(m.media as AniMedia);
          }
          return null;
        }) ?? []
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
      })
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
                Authorization: 'Bearer ' + ctx.session.user.token,
              }
            : {},
        },
      });
      data = (
        await Promise.all(
          animeData.Page?.media?.map(async (media) => {
            if (!!media) {
              return await mediaBuilder(media as AniMedia);
            }
            return null;
          }) ?? []
        )
      ).filter(Boolean) as Media[];
      return {
        data,
        nextCursor: !!animeData.Page?.pageInfo?.hasNextPage
          ? ++input.cursor
          : undefined,
      };
    }),

  getList: protectedProcedure
    .input(
      z.object({
        cursor: z.number().positive().nullish().default(1),
        list: ListStatusValidator,
        sort: ListSortValidator,
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.cursor) return null;
      let user = await api.user.getUser.query();
      let userName = user!.name;
      let userNsfw = user!.showNSFW;

      let vars = {
        page: input.cursor,
        perPage: 25,
        type: 'ANIME',
        sort: convertEnum(ListSort, MediaListSort, input.sort),
        userName,
        status: convertEnum(ListStatus, MediaListStatus, input.list),
        isAdult: !userNsfw ? false : undefined,
      } as NonNullableFields<User_ListQueryVariables>;
      let data: Media[] = [];
      let { data: animeData } = await client.query<User_ListQuery>({
        query: USER_LIST,
        variables: vars,
        context: {
          headers: !!ctx.session
            ? {
                Authorization: 'Bearer ' + ctx.session.user.token,
              }
            : {},
        },
      });
      data = await Promise.all(
        animeData.Page?.mediaList
          ?.map(async (m) => {
            if (!!m && !!m.media) {
              return await mediaBuilder(m.media as AniMedia);
            }
            return null;
          })
          .filter(async (p) => !!(await p)) as Promise<Media>[]
      );
      return {
        data,
        nextCursor: !!animeData.Page?.pageInfo?.hasNextPage
          ? ++input.cursor
          : undefined,
      };
    }),
});
