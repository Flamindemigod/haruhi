import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.cookies.access_token) {
    const query = `query {
        Viewer {
          id
          name
          avatar {
            medium
          }
          mediaListOptions{
            scoreFormat
          }
        }
      
            }`;
    const data = await makeQuery({
      query,
      variables: {},
      token: req.cookies.access_token,
    });
    res.status(200).json(data);
  } else {
    res.status(401).json({ error: "User needs to be logged in" });
  }
}
