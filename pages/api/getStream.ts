import type { NextApiRequest, NextApiResponse } from "next";
import { ANIME, META } from "@consumet/extensions";
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  try {
    if (req.query.id && req.query.epId) {
      const provider = new ANIME.Anix();
      const data = await provider.fetchEpisodeSources(
        String(req.query.id),
        String(req.query.epId),
        "sub",
      );
      console.log(data);
      return res.status(200).json({
        source: data.sources.filter((el: any) => el.quality === "default"),
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
