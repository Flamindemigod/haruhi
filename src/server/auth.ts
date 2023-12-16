import { PrismaAdapter } from "@next-auth/prisma-adapter";
import {gql} from "@apollo/client"
import {
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import { env } from "~/env";
import { db } from "~/server/db";
import { client } from "~/apolloClient";
import { USER_AUTH } from "~/graphql/queries";
import { User_AuthQuery } from "~/__generated__/graphql";


enum ScoreFormat{
  POINT_10_DECIMAL,
  POINT_100,
  POINT_10,
  POINT_5,
  POINT_3,
}

type Viewer ={ 
  id: number
  name: string
  avatar: {
    medium: string
  }
  options:{
    displayAdultContent: boolean
  }
  mediaListOptions: {
    scoreFormat: ScoreFormat
  }
}

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    id: string,
    name: string, 
    token: string,
  }

  interface Session  {
    user: User, 
  }
}


/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user}) => {
      if (session?.user) {
        session.user.id = user.id!;
        const getToken = await db.account.findFirst({
          where: {
            userId: user.id,
          },
        });
  
        let accessToken: string | null = null;
        if (getToken) {
          accessToken = getToken.access_token!;
        }
        session.user.token = accessToken!;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  adapter: PrismaAdapter(db),
  debug: true,
  providers: [
    {
      clientId: env.ANILIST_CLIENT_ID,
      clientSecret: env.ANILIST_SECRET_KEY,
      id: "anilist",
      name: "Anilist",
      type: "oauth",
      authorization: {
        url: "https://anilist.co/api/v2/oauth/authorize",
        params: { scope:"", response_type: "code" },
      },
      userinfo: {
        url: "https://graphql.anilist.co",
        async request(context) {
         
            const { data } = await client.query<User_AuthQuery>({
            query: USER_AUTH,
            context: {
              headers: {
                Authorization: "Bearer " + context.tokens.access_token,
              },
            },
          });
          return {
            name: data.Viewer?.name ?? "",
            aniid: data.Viewer?.id ?? 0,
            image: data.Viewer?.avatar?.medium ?? "",
            scoreFormat: data.Viewer?.mediaListOptions?.scoreFormat! ?? ScoreFormat.POINT_10_DECIMAL,
            showNSFW: data.Viewer?.options?.displayAdultContent ?? false
          };
        },
      },
      token: "https://anilist.co/api/v2/oauth/token",
      profile(profile) {
          return {
          id: profile.aniid,
          name: profile.name,
            scoreFormat: profile.scoreFormat,
            showNSFW: profile.showNSFW,
            aniid: profile.aniid,
          image: profile.image,
          token: profile.token,
        };
      },
    }
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
