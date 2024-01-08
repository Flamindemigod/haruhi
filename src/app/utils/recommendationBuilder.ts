import {
  MediaFormat,
  MediaList,
  MediaSeason,
  MediaStatus,
} from "~/__generated__/graphql";
import {
  Category,
  FormatAnime,
  FormatManga,
  Media,
  Season,
  Status,
} from "~/types.shared/anilist";
import generateBlurhash from "./generateBlurhash";
import convertEnum from "./convertEnum";

function* getRecommendations(mediaParent: MediaList) {
  for (let edge of mediaParent.media?.recommendations?.edges!) {
    let node = edge!.node;
    if (
      !!node &&
      node.rating! > 20 &&
      !node.mediaRecommendation?.mediaListEntry!
    ) {
      yield node.mediaRecommendation;
    }
  }
}

export async function recommendationBuilder(
  mediaList: MediaList[],
  prev_mapping: Map<number, Media>,
) {
  let acculatedRecommendations: Map<number, Media> = prev_mapping;
  for (let mediaParent of mediaList) {
    for (let recommendation of getRecommendations(mediaParent)) {
      if (acculatedRecommendations.size >= 25) {
        return acculatedRecommendations;
      }

      if (
        recommendation === null ||
        acculatedRecommendations.has(recommendation.id)
      ) {
        continue;
      }
      switch (recommendation.type) {
        case "ANIME":
          acculatedRecommendations.set(recommendation.id, {
            ...recommendation,
            coverImage: {
              ...recommendation.coverImage,
              blurHash: await generateBlurhash(
                recommendation.coverImage!.medium!,
              ),
            },
            type: Category.anime,
            format: convertEnum(
              MediaFormat,
              FormatAnime,
              recommendation.format,
            ) as FormatAnime,
            status: convertEnum(
              MediaStatus,
              Status,
              recommendation.status,
            ) as Status,
            season: convertEnum(
              MediaSeason,
              Season,
              recommendation.season,
            ) as Season,
          } as Media);

          break;
        case "MANGA":
          acculatedRecommendations.set(recommendation.id, {
            ...recommendation,
            coverImage: {
              ...recommendation.coverImage,
              blurHash: await generateBlurhash(
                recommendation.coverImage!.medium!,
              ),
            },
            type: Category.manga,
            format: convertEnum(
              MediaFormat,
              FormatManga,
              recommendation.format,
            ) as FormatManga,
            status: convertEnum(
              MediaStatus,
              Status,
              recommendation.status,
            ) as Status,
          } as Media);

        default:
          break;
      }
    }
  }
  return acculatedRecommendations;
}
