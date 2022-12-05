import type { NextApiRequest, NextApiResponse } from "next";
import { MANGA } from "@consumet/extensions";
import getMalTitle from "../../utils/getMalTitle";

type Response = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.idMal !== undefined) {
    const malTitle = await getMalTitle("manga", String(req.query.idMal));
    const mangakakalot = new MANGA.MangaKakalot();

    const consumetMangaid = await mangakakalot.search(malTitle);
    const consumetMangaInfo = await await mangakakalot.fetchMangaInfo(
      consumetMangaid.results[0].id
    );

    res.status(200).json(consumetMangaInfo.chapters);
  } else {
    res.status(400).json({ error: "idMal must be specified" });
  }
}
