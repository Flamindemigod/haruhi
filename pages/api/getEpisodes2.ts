import { ANIME, META } from "@consumet/extensions";
import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";
import similarity from "../../utils/similarity";
import getMalTitle from "../../utils/getMalTitle"

type Response = {};
type Result = {
  id: string;
  title: string;
  subOrDub: "sub" | "dub";
  similarity: number;
};

type titles = {
  english: string;
  romaji: string;
  native: string;
};

type SearchFn = (subString: string) => Promise<Result[]>;

const search = async (names: string[], searchFunction: SearchFn) => {
  let data: Set<Result> = new Set();
  for (const name of names) {
    for (const searchResult of await searchFunction(name)) {
      data.add(searchResult);
    }
  }
  return [...data.values()].sort((a, b) => b.similarity - a.similarity);
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>,
) {
  try {
    if (req.query.id !== undefined) {
      const provider = new ANIME.Zoro();
      const meta = new META.Anilist(provider);


      const id = (await provider.fetchIdFromAnilistId(String(req.query.id))).id
      const episodes = (await provider.fetchAnimeInfo(id)).episodes;
      if (!!episodes) {
        const episodesListReleventFields = episodes.map((episode) => ({
          epId: episode.id,
          title: episode.title,
          number: episode.number,
        }));
        if (episodes.length > 0) return res.status(200).json(episodesListReleventFields);
      }
      return res.status(400).json({ error: "no episodes found" });

    } else {
      return res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: JSON.stringify(err) });
  }
}
