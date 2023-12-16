import { Get_GenresQuery, Get_TagsQuery } from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import { GET_GENRES, GET_TAGS } from "~/graphql/queries";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import { db } from "~/server/db";
import { api } from "~/trpc/server";

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
    });
  