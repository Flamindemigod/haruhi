import { z } from 'zod';
import { client } from '~/apolloClient';
import {
  MediaFormat,
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
import { redis } from '~/server/db';
import { api } from '~/trpc/server';
import {
  FormatAnime,
  FormatManga,
  Status,
  Media,
  SearchResultMedia,
  Category,
  ListStatus,
  ListStatusValidator,
  ListSortValidator,
  ListSort,
} from '~/types.shared/anilist';
import { buildRecommendationKey } from '~/types.shared/redis';
export const mangaRouter = createTRPCRouter({
  getTrending: publicProcedure
    .input(
      z.object({
        sort: z.nativeEnum(MediaSort).default(MediaSort.PopularityDesc),
        format: z.nativeEnum(FormatManga).default(FormatManga.any),
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
      const vars = {
        page: 1,
        sort: input.sort,
        isAdult: !userNsfw ? false : undefined,
        type: 'MANGA',
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
      } as Trending_Anime_MangaQueryVariables;
      let { data: mangaData } = await client.query<Trending_Anime_MangaQuery>({
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
      let dManga: Media[] = [];
      if (!!mangaData.Page) {
        dManga = await Promise.all(
          mangaData.Page.media!.map(async (m) => {
            return (await mediaBuilder(m as AniMedia)) as Media;
          })
        );
      }
      return dManga;
    }),

  getRecommended: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    const userID = user?.aniid!;

    const key = buildRecommendationKey(userID, Category.Manga);

    const data = await redis.get<Media[]>(key);
    if (!!data) {
      return await recommendationGenBlurs(data);
    }

    let mangaAccumulated: Map<number, Media> = new Map();
    let vars = {
      page: 0,
      type: 'MANGA',
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
                Authorization: 'Bearer ' + ctx.session.user.token,
              }
            : {},
        },
      });
      mangaAccumulated = await recommendationBuilder(
        mangaData.Page?.mediaList as MediaList[],
        mangaAccumulated
      );
      break;
    }
    await redis.set(key, [...mangaAccumulated.values()], {
      ex: 60 * 60 * 24, // Time to Expire In Seconds 60*60*24 = 1 day;
    });

    return await recommendationGenBlurs([...mangaAccumulated.values()]);
  }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 0,
      type: 'MANGA',
      userName,
      perPage: 50,
    } as NonNullableFields<User_ListQueryVariables>;
    let data: Media[] = [];
    while (true) {
      if (!!vars.page) {
        vars.page += 1;
      }
      let { data: mangaData } = await client.query<User_ListQuery>({
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
            mangaData.Page?.mediaList
              ?.map(async (m) => {
                if (!!m && !!m.media) {
                  return await mediaBuilder(m.media as AniMedia);
                }
                return null;
              })
              .filter(Boolean) ?? []
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

  getPending: protectedProcedure.query(async ({ ctx }) => {
    const user = await api.user.getUser.query();
    const userName = user?.name;
    let vars = {
      page: 1,
      type: 'MANGA',
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
              Authorization: 'Bearer ' + ctx.session.user.token,
            }
          : {},
      },
    });
    data = (
      await Promise.all(
        mangaData.Page?.mediaList?.map(async (m) => {
          if (!!m && !!m.media) {
            return await mediaBuilder(m.media as AniMedia);
          }
          return null;
        }) ?? []
      )
    ).filter(Boolean) as Media[];
    return data;
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
        type: 'MANGA',
        sort: convertEnum(ListSort, MediaListSort, input.sort),
        userName,
        status: convertEnum(ListStatus, MediaListStatus, input.list),
        isAdult: !userNsfw ? false : undefined,
      } as NonNullableFields<User_ListQueryVariables>;
      let data: Media[] = [];
      let { data: mangaData } = await client.query<User_ListQuery>({
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
        mangaData.Page?.mediaList
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
        nextCursor: !!mangaData.Page?.pageInfo?.hasNextPage
          ? ++input.cursor
          : undefined,
      };
    }),
});
