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
      const provider = new ANIME.Anix();
      let aniResponse = await makeQuery({
        query,
        variables,
        token: req.cookies.access_token,
      });
      const results = await search(
        Object.values(aniResponse.data.Media.title as titles).filter(Boolean),
        async (e: string) => {
          return (await provider.search(e)).results.map((l) => {
            return {
              title: l.title,
              id: l.id,
              similarity: similarity(e, l.title as string),
            } as Result;
          });
        },
      );
      let episodesListReleventFields;
      let episodes: any[];
      if (results.at(0) !== undefined) {
        episodes =
          (await provider.fetchAnimeInfo(results.at(0)!.id)).episodes ?? [];
      } else {
        episodes = [];
      }
      episodesListReleventFields = episodes.map((episode) => ({
        id: results.at(0)?.id,
        epId: episode.id,
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
