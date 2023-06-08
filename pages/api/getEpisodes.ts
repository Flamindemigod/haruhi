import type { NextApiRequest, NextApiResponse } from "next";
import { META } from "@consumet/extensions";
type Response = [] | {} | undefined;



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.query.id !== undefined) {
      
      const anilist = new META.Anilist()
      const episodesList = await anilist.fetchEpisodesListById(String(req.query.id), req.query.format === "dub", true)
      const episodesListReleventFields = episodesList.map(episode => ({id: episode.id, title: episode.title, number: episode.number}))

      res.status(200).json(episodesListReleventFields);
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err);
    res.status(200).json([]);
  }
}
