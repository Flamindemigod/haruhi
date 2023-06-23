import { META } from "@consumet/extensions";
import MangaReader from "@consumet/extensions/dist/providers/manga/mangareader";
import type { NextApiRequest, NextApiResponse } from "next";
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.id !== undefined) {
    const anilist = new META.Anilist.Manga()
    anilist.provider = new MangaReader();
    const data = await anilist.fetchChapterPages(String(req.query.id));
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "id must be specified" });
  }
}
