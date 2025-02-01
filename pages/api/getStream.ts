import type { NextApiRequest, NextApiResponse } from "next";
import { ANIME, StreamingServers } from "@consumet/extensions";
import { URLSearchParams } from "url";
type Response = {};
export const dynamic = 'force-dynamic';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  try {
    console.log(decodeURIComponent(String(req.query.epId)))
    if (req.query.epId) {
      const provider = new ANIME.Zoro();
      const data = await provider.fetchEpisodeSources(decodeURIComponent(String(req.query.epId)))
      if (data == undefined) {
        res.status(400).json({ error: "No Valid Data found" });
        return;
      }
      if (data.sources.length == 0) return res.status(400).json({ error: "No Sources Found" });
      return res.status(200).json({
        source: data.sources[0],
        header: data.headers ?? "",
        subtitle: data.subtitles?.filter((v) => v.lang === "English").at(0),
        intro: data.intro,
        outro: data.outro,
      })
    }
    res.status(400).json({ error: "id must be specified" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
}
