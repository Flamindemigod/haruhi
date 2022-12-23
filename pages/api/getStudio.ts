import type { NextApiRequest, NextApiResponse } from "next";
import applyRateLimit from "../../utils/applyRateLimit";
import makeQuery from "../../utils/makeQuery";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    await applyRateLimit(req, res);
  } catch {
    return res.status(429).send("Too many requests");
  }
  if (req.query.id !== undefined) {
    const query = `query ($id: Int, $page: Int, $sort: [MediaSort], $onList: Boolean) {
        Studio(id: $id) {
          id
          name
          isAnimationStudio
          favourites
          isFavourite
          media(page: $page, sort: $sort, onList: $onList) {
            pageInfo {
              currentPage
              hasNextPage
            }
            edges {
              isMainStudio
              node {
                id
                title {
                  userPreferred
                  english
                }
                coverImage {
                  large
                  medium
                }
                startDate {
                  year
                  month
                  day
                }
                endDate {
                  year
                  month
                  day
                }
                season
                description(asHtml:true)
                type
                format
                status(version: 2)
                episodes
                duration
                chapters
                volumes
                mediaListEntry {
                  progress
                  id
                  status
                }
                nextAiringEpisode {
                  airingAt
                  timeUntilAiring
                  episode
                }
              }
            }
          }
        }
      }`;
    const variables = {
      id: req.query.id,
      page: req.query.page ?? 1,
      onList: req.query.onList === "true" ? true : undefined,
      sort: req.query.sort || "START_DATE_DESC",
    };
    let data = await makeQuery({
      query,
      variables,
      token: req.cookies.access_token,
    });
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "id must be specified" });
  }
}
