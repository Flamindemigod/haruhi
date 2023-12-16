import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { anilistRouter } from "./routers/anilist";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  anilist: anilistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
