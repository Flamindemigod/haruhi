import type { NextApiRequest, NextApiResponse } from "next";
import { MANGA } from "@consumet/extensions";

type Response = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.title !== undefined) {
    const mangakakalot = new MANGA.Mangasee123();

    const consumetMangaid = await mangakakalot.search(
      String(req.query.title).replaceAll(",", "")
    );
    const consumetMangaInfo = await await mangakakalot.fetchMangaInfo(
      consumetMangaid.results[0].id
    );

    res.status(200).json(consumetMangaInfo.chapters);
  } else {
    res.status(400).json({ error: "idMal must be specified" });
  }
}
