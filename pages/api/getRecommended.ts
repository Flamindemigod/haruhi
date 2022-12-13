import type { NextApiRequest, NextApiResponse } from "next";
import getRecommendedHelper from "../../utils/getRecommendedHelper";
import makeQuery from "../../utils/makeQuery";
import { shuffle } from "../../utils/shuffle";

type Response = {} | [];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.username !== undefined && req.query.type !== undefined) {
    const query = `
            query userRecommended($perPage: Int = 50, $page: Int = 1, $userName: String) {
              Page(perPage: $perPage, page: $page) {
                pageInfo {
                  hasNextPage
                  total
                }
                mediaList(userName: $userName, type: ${req.query.type}, sort:[SCORE_DESC]) {
                  progress
                  score
                  media {
                    recommendations {
                      edges {
                        node {
                          rating
                          mediaRecommendation {
                            episodes
                            id
                            chapters
                            type
                            format
                            status
                            siteUrl
                            description
                            coverImage {
                              large
                              medium
                            }
                            title {
                              userPreferred
                            }
                            mediaListEntry{
                              id
                            }
                            
                          }
                        }
                      }
                    }
                  }
                }
              }
            }  
        `;
    let variables = {
      perPage: 10,
      page: 0,
      userName: req.query.username,
    };
    let hasNextPage = true;
    let airingArrayAccumalated: any = [];
    let data;
    while (hasNextPage) {
      variables["page"] = variables["page"] + 1;
      data = await makeQuery({
        query,
        variables,
        token: req.cookies.access_token,
      }).then(getRecommendedHelper);
      hasNextPage = data[0];
      airingArrayAccumalated = airingArrayAccumalated.concat(data[1]);
      if (airingArrayAccumalated.length >= 25) {
        hasNextPage = false;
      }
    }
    const mediaIDArray: any = [];
    airingArrayAccumalated = airingArrayAccumalated.filter((c: any) => {
      if (mediaIDArray.includes(c.id)) {
        return false;
      }
      mediaIDArray.push(c.id);
      return true;
    });
    airingArrayAccumalated = shuffle(airingArrayAccumalated);
    res.status(200).json(airingArrayAccumalated);
  } else {
    res.status(400).json({ error: "username and type must be speicfied" });
  }
}
