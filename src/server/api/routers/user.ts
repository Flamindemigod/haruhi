import { User_AuthQuery } from "~/__generated__/graphql";
import { client } from "~/apolloClient";
import { USER_AUTH } from "~/graphql/queries";
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
       
            
            const { data } = await client.query<User_AuthQuery>({
            query: USER_AUTH,
            context: {
              headers: {
                Authorization: "Bearer " + ctx.session.user.token,
              },
            },
          });
          return db.user.update({
            data: {
              showNSFW: data.Viewer?.options?.displayAdultContent as boolean, image: data.Viewer?.avatar?.medium,
              scoreFormat: data.Viewer?.mediaListOptions?.scoreFormat!
            }, where: {
              id: ctx.session.user.id
            },
          });
        }),
    });
  