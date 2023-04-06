import type { NextApiRequest, NextApiResponse } from "next";
import { MANGA } from "@consumet/extensions";
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.id !== undefined) {
    const MangaKakalot = new MANGA.MangaDex();
    const data = await MangaKakalot.fetchChapterPages(String(req.query.id));
    res.status(200).json(data);
  } else {
    res.status(400).json({ error: "id must be specified" });
  }
}
