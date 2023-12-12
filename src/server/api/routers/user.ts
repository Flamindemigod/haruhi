import { gql } from "@apollo/client";
import { ScoreFormat } from "@prisma/client";
import { client } from "~/apolloClient";
import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import { db } from "~/server/db";
import { api } from "~/trpc/server";




  export const userRouter = createTRPCRouter({
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await db.user.findUnique({
                    where: {
                      id: ctx.session.user.id,
                    },
                  });
        return user;
      }),
    refreshUser: protectedProcedure.mutation(async ({ ctx }) => {
        const query = gql`
          query {
            Viewer {
              id
              name
              avatar {
                medium
              }
              options{
                displayAdultContent
              }
              mediaListOptions{
                scoreFormat
              }
            }
          }
        `;
            
            const { data } = await client.query<any>({
            query: query,
            context: {
              headers: {
                Authorization: "Bearer " + ctx.session.user.token,
              },
            },
          });
          return db.user.update({
            data: {
              showNSFW: data.Viewer.options.displayAdultContent as boolean, image: data.Viewer.avatar.medium as string,
              scoreFormat: data.Viewer.mediaListOptions.scoreFormat as ScoreFormat
            }, where: {
              id: ctx.session.user.id
            },
          });
        }),
    });
  