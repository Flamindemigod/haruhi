import type { NextApiRequest, NextApiResponse } from "next";
import getAiringHelper from "../../utils/getAiringHelper";
import makeQuery from "../../utils/makeQuery";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (
    req.query.type !== undefined &&
    req.query.status !== undefined &&
    req.query.username !== undefined
  ) {
    let query = `query usersAiringSchedule($perPage: Int = 50, $page: Int = 1, $userName: String) {
        Page(perPage: $perPage, page: $page) {
          pageInfo {
            hasNextPage
          }
          mediaList(userName: $userName, type: ${req.query.type}, status:${req.query.status}, sort: [UPDATED_TIME_DESC]) {
            progress
            status
            media {
              episodes
              id
              status
              siteUrl
              coverImage {
                large
              }
              title {
                userPreferred
              }
              averageScore
              format
              mediaListEntry{
                id
                score
                progress
              }
              airingSchedule {
                edges {
                  node {
                    airingAt
                    timeUntilAiring
                    episode
                  }
                }
              }
            }
          }
        }
      }
    `;

    var variables = {
      perPage: 50,
      page: req.query.page || 1,
      userName: req.query.username,
    };

    let data = await makeQuery({
      query,
      variables,
      token: req.cookies.access_token,
    });
    data.data.Page.mediaList = data.data.Page.mediaList.map(
      (mediaListEntry: any) => getAiringHelper(mediaListEntry)
    );
    res.status(200).json(data.data.Page);
  } else {
    res
      .status(400)
      .json({ error: "username, type, and status must be specified" });
  }
}
