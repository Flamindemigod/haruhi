import type { NextApiRequest, NextApiResponse } from "next";
import { MANGA } from "@consumet/extensions";

type Response = any;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.query.title !== undefined) {
    const titleBlacklist = {
      ["Kaguya-sama: Love is War"]: "Kaguya-sama - Love Is War",
      ["Mushoku Tensei: Jobless Reincarnation"]:
        "Mushoku Tensei - Jobless Reincarnation",
      ["Tokyo卍Revengers"]: "Tokyo Revengers",
      [`S-Rank Monster no "Behemoth" dakedo, Neko to Machigawarete Elf Musume no Pet toshite Kurashitemasu`]:
        "I Am Behemoth of the S Rank Monster but I Am Mistaken as a Cat and I Live as a Pet of Elf Girl",
      ["Wanwan Monogatari: Kanemochi no Inu ni Shite to wa Itta ga, Fenrir ni Shiro to wa Itte Nee!"]:
        "Bark Bark Story",

      // ["[Oshi no Ko]"]: "Oshi no Ko",
    };
    const mangakakalot = new MANGA.MangaKakalot();

    const consumetMangaid = await mangakakalot.search(
      titleBlacklist[String(req.query.title) as keyof typeof titleBlacklist] ||
        String(req.query.title).replaceAll(",", "")
    );
    const consumetMangaInfo = await mangakakalot.fetchMangaInfo(
      consumetMangaid.results[0].id
    );

    res.status(200).json(consumetMangaInfo.chapters);
  } else {
    res.status(400).json({ error: "idMal must be specified" });
  }
}
