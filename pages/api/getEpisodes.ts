import type { NextApiRequest, NextApiResponse } from "next";
import getMalTitle from "../../utils/getMalTitle";
import { ANIME } from "@consumet/extensions";
type Response = [] | {} | undefined;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    if (req.query.idMal !== undefined) {
      const malTitle = await getMalTitle("anime", String(req.query.idMal));
      const gogoanime = new ANIME.Gogoanime();

      const consumetAnimeid = await gogoanime.search(malTitle);

      const consumetAnimeIdResults = consumetAnimeid.results.filter(
        (el: any) => el.subOrDub === (req.query.format || "sub")
      );
      const consumetAnimeInfo = await gogoanime.fetchAnimeInfo(
        consumetAnimeIdResults[0].id
      );

      res.status(200).json(consumetAnimeInfo.episodes);
    } else {
      res.status(400).json({ error: "idMal must be specified" });
    }
  } catch (err) {
    res.status(200).json([]);
  }
}
