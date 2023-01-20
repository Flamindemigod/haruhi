import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";
import { verifySession } from "../../utils/supabaseClient";

type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (
    req.cookies["access_token"] === undefined ||
    !(await verifySession(
      parseInt(String(req.headers.userid)),
      String(req.headers.sessionid)
    ))
  ) {
    res.status(401).json({ error: "Unauthorized" });
  } else if (req.query.id === undefined) {
    res.status(400).json({ error: "id must be specified" });
  } else {
    const query = ` mutation deleteMediaEntry($id: Int) {
      DeleteMediaListEntry(id: $id) {
        deleted
      }
    }      `;
    const variables = {
      id: req.query.id,
    };
    let data = await makeQuery({
      query,
      variables,
      token: req.cookies.access_token,
    });
    res.status(200).json(data);
  }
}
