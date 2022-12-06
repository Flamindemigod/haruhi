import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";

type Response = [];
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const query = `query getMediaTrend {
        Page(perPage: 10) {
          pageInfo {
            hasNextPage
          }
          activities(isFollowing: true, sort: ID_DESC) {
            ... on ListActivity {
              createdAt
              id
              user {
                name
                avatar{
                    medium
                }
              }

              status
              progress
              media {
                format
                type
                id
                title {
                  userPreferred
                }
                coverImage {
                  medium
                }
              }
            }
          }
        }
      }`;
  const data = await makeQuery({
    query,
    variables: {},
    token: req.cookies.access_token,
  });
  res.status(200).json(data.data.Page.activities);
}
