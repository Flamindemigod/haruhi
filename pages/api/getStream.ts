import type { NextApiRequest, NextApiResponse } from "next";
import { ANIME, StreamingServers } from "@consumet/extensions";
type Response = {};
export const dynamic = 'force-dynamic';
const SERVERS: StreamingServers[] = [
  StreamingServers.BuiltIn,
  StreamingServers.VidStreaming,
  StreamingServers.VidHide,
  StreamingServers.VidCloud,
  StreamingServers.StreamSB
];


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  try {
    if (req.query.id && req.query.epId) {
      const provider = new ANIME.Anix();
      let data;
      for (const server of SERVERS) {
        try {
          data = await provider.fetchEpisodeSources(
            String(req.query.id),
            String(req.query.epId),
            //undefined, 
            server,
            "sub"
          );
          if (data.sources.length > 0) break;
        }
        catch {
          continue
        }
      }
      if (data == undefined) {
        res.status(400).json({ error: "No Valid Data found" });
        return;
      }
      return res.status(200).json({
        source: data.sources.filter((el: any) => el.quality === "default" || el.quality === "auto"),
        header: data.headers,
      });
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json([]);
  }
}
