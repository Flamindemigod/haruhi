import type { NextApiRequest, NextApiResponse } from "next";
import getAiringHelper from "../../utils/getAiringHelper";
import makeQuery from "../../utils/makeQuery";

type Response = {} | [];
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.season !== undefined && req.query.year !== undefined) {
    const query = `query getSeasonal($page:Int=1) {
        Page(page:$page, perPage:50) {
          pageInfo {
            hasNextPage
          }
          media(season: ${req.query.season}, seasonYear: ${
      req.query.year
    }, type:ANIME, sort: [POPULARITY_DESC], ${
      req.query.adult === "" ? "" : "isAdult:false"
    }) {
            id
            title {
              userPreferred
            }
            coverImage{
              large
              medium
            }
            episodes
            startDate{
              year
            }
            airingSchedule{
              edges{
                node{
                  episode
                  timeUntilAiring
                }
              }
              
            }
            mediaListEntry{
              progress
              status
            }
          }
        }
      }`;
    let variables = {
      page: 1,
    };
    let hasNextPage = true;
    let accumalatedMedia: any = [];
    while (hasNextPage) {
      const data = await makeQuery({
        query,
        variables,
        token: req.cookies.access_token,
      });
      if (!data) return null;
      if (data.data.Page.pageInfo.hasNextPage) {
        variables["page"] += 1;
      } else {
        hasNextPage = false;
      }
      accumalatedMedia = accumalatedMedia.concat(data.data.Page.media);
    }
    for (const media in accumalatedMedia) {
      accumalatedMedia[media] = getAiringHelper(accumalatedMedia[media]);
    }
    res.status(200).json(accumalatedMedia);
  } else {
    res.status(400).json({ error: "season and year must be speicfied" });
  }
}
