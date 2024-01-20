import { META, ANIME } from "@consumet/extensions";
import type { NextApiRequest, NextApiResponse } from "next";
type Response = [] | {} | undefined;



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.query.id !== undefined) {
      
      const anilist = new META.Anilist()
      const gogoProvider = new ANIME.Gogoanime();
      console.log(`Testinf`);
      const data = await anilist.fetchAnimeInfo(String(req.query.id));
      const providerId = await gogoProvider.fetchAnimeIdFromEpisodeId(data.episodes?.at(0)?.id!);
      const episodes = (await gogoProvider.fetchAnimeInfo(providerId)).episodes;
      console.log(`data ${JSON.stringify(data)}`);
      const episodesListReleventFields = (episodes ?? []).map(episode => ({id: episode.id, title: episode.title, number: episode.number}))

      res.status(200).json(episodesListReleventFields);
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err)
    res.status(200).json([]);
  }
}
