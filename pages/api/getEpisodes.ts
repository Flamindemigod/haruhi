import { ANIME } from "@consumet/extensions";
import type { NextApiRequest, NextApiResponse } from "next";
type Response = [] | {} | undefined;



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.query.id !== undefined) {
      
      const anilist = new ANIME.Anify()
      const episodesList = (await anilist.fetchAnimeInfo(String(req.query.id))).episodes ?? [];
      const episodesListReleventFields = episodesList.map(episode => ({id: episode.id, title: episode.title, number: episode.number}))

      res.status(200).json(episodesListReleventFields);
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err)
    res.status(200).json([]);
  }
}
