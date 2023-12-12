import {
    createTRPCRouter,
    protectedProcedure,
    publicProcedure,
  } from "~/server/api/trpc";
import { db } from "~/server/db";

// const userRouter = ({
//     me: protectedProcedure.query(async ({ ctx }) => {
//      
//     }),
//   });


  export const userRouter = createTRPCRouter({
    getUser: protectedProcedure.query(async ({ ctx }) => {
        const user = await db.user.findUnique({
                    where: {
                      id: ctx.session.user.id,
                    },
                  });
       
  return user;
    }),
  
   
  });
  