import { META } from "@consumet/extensions";
import MangaReader from "@consumet/extensions/dist/providers/manga/mangareader";
import type { NextApiRequest, NextApiResponse } from "next";

type Response = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.id !== undefined) {
    const anilist = new META.Anilist.Manga()
    anilist.provider = new MangaReader();
    const manga = (await anilist.fetchMangaInfo(String(req.query.id))).chapters;
    const filteredManga = manga?.filter(manga => manga.id.includes("/en/"))

    res.status(200).json(filteredManga);
  } else {
    res.status(400).json({ error: "id must be specified" });
  }
}
