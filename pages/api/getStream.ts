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
      console.log(req.query.id);
      const data = await gogoanime.fetchEpisodeSources(String(req.query.id));
      return res
        .status(200)
        .json(data.sources.filter((el: any) => el.quality === "default"));
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    res.status(500).json([]);
  }
}
