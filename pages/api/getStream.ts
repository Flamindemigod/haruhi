import type { NextApiRequest, NextApiResponse } from "next";
import { META } from "@consumet/extensions";
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.query.id && req.query.episodeNumber && req.query.animeId) {
      const anilist = new META.Anilist();
      const data = await anilist.fetchEpisodeSources(String(req.query.id), parseInt(String(req.query.episodeNumber)), String(req.query.animeId));
      console.log(data)
      return res
        .status(200)
        .json({source:data.sources.filter((el: any) => el.quality === "default"), header: data.headers?.Referer});
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err)
    res.status(500).json([]);
  }
}
