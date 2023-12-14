import { parseInt } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";
import { verifySession } from "../../utils/supabaseClient";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  console.log(req.headers);
  try {
    if (
      true||(
      req.cookies["access_token"] &&
      (await verifySession(
        parseInt(String(req.headers.userid)),
        String(req.headers.sessionid)
      )))
    ) {
      const query = `mutation saveMediaEntry($id: Int, $mediaId: Int, $status: MediaListStatus, $score: Float, $progress: Int, $repeat: Int, $startedAt: FuzzyDateInput, $completedAt: FuzzyDateInput) {
         SaveMediaListEntry(id: $id, mediaId: $mediaId, status: $status, score: $score, progress: $progress, repeat: $repeat, startedAt: $startedAt, completedAt: $completedAt) {
           id
         }
       }`;
      const variables = {
        mediaId: req.query.mediaId,
        status: req.query.status,
        score: req.query.score,
        progress: req.query.progress,
        repeat: req.query.repeat,
        startedAt:
          req.query.startedAt && JSON.parse(String(req.query.startedAt)),
        completedAt:
          req.query.completedAt && JSON.parse(String(req.query.completedAt)),
      };
      let data = await makeQuery({
        query,
        variables,
        token: req.cookies.access_token,
      });
      res.status(200).json(data);
    } else {
      res.status(401).json({ error: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
