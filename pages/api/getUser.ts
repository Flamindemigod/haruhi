import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";
import { v4 as uuidV4 } from "uuid";
import { supabaseServer } from "../../utils/supabaseClient";
type Response = {};

const createSession = async (userID: number, userName: string) => {
  const sessionID = uuidV4();
  const supabase = supabaseServer();
  const { data, error } = await supabase.from("users").upsert({
    id: userID,
    userName: userName,
    lastUpdatedAt: new Date(),
    sessionId: sessionID,
  });
  if (!error) {
    return sessionID;
  } else {
    console.error(error);
  }
};

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
          options{
            displayAdultContent
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
    const sessionKey = await createSession(
      data.data.Viewer.id,
      data.data.Viewer.name
    );
    res.status(200).json({ ...data, sessionKey: sessionKey });
  } else {
    res.status(401).json({ error: "User needs to be logged in" });
  }
}
