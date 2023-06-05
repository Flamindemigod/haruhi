import type { NextApiRequest, NextApiResponse } from "next";
import { ANIME, StreamingServers } from "@consumet/extensions";
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.query.id !== undefined) {
      const gogoanime = new ANIME.Gogoanime();
      const data = await gogoanime.fetchEpisodeSources(String(req.query.id));
      console.log(req.query.id)
      console.log(data)
      return res
        .status(200)
        .json({source:data.sources.filter((el: any) => el.quality === "default"), header: data.headers?.Referer});
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    res.status(500).json([]);
  }
}
