import { ANIME, META } from "@consumet/extensions";
import type { NextApiRequest, NextApiResponse } from "next";
import makeQuery from "../../utils/makeQuery";
import similarity from "../../utils/similarity";

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
      const query = `query getNames($id: Int = 1) {
        Media(id: $id) {
          title {
            english
            romaji
            native
          }
        }
      }          
    `;
      const variables = {
        id: req.query.id,
      };
      const gogoProvider = new ANIME.Gogoanime();
      const anilist = new META.Anilist(gogoProvider);
      const dubbed: boolean = req.query.format === "dub";
      let aniResponse = await makeQuery({
        query,
        variables,
        token: req.cookies.access_token,
      });
      const results = (
        await search(
          Object.values(aniResponse.data.Media.title as titles).filter(Boolean),
          async (e: string) => {
            return (await gogoProvider.search(e)).results.map((l) => {
              return {
                title: l.title,
                id: l.id,
                subOrDub: l.subOrDub,
                similarity: similarity(e, l.title as string),
              } as Result;
            });
          },
        )
      ).filter((a) => (dubbed ? a.subOrDub === "dub" : a.subOrDub === "sub"));
      let episodesListReleventFields;
      let episodes;
      if (results.at(0) !== undefined) {
        episodes =
          (await gogoProvider.fetchAnimeInfo(results.at(0)!.id)).episodes ?? [];
      } else {
        const res = await anilist.fetchAnimeInfo(req.query.id as string);
        console.log(res);
        episodes = res.episodes ?? [];
      }
      console.log(episodes);
      episodesListReleventFields = episodes.map((episode) => ({
        id: episode.id,
        title: episode.title,
        number: episode.number,
      }));
      if (episodes.length > 0) res.status(200).json(episodesListReleventFields);
      res.status(400).json({ error: "no episodes found" });
    } else {
      res.status(400).json({ error: "id must be specified" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: JSON.stringify(err) });
  }
}
