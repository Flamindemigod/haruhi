import { MediaList } from '~/__generated__/graphql';
import { Media } from '~/types.shared/anilist';
import mediaBuilder from './mediaBuilder';
import generateBlurhash from './generateBlurhash';

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
  prev_mapping: Map<number, Media>
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
      acculatedRecommendations.set(
        recommendation.id,
        await mediaBuilder(recommendation, false)
      );
    }
  }
  return acculatedRecommendations;
}

export const recommendationGenBlurs = async (media: Media[]) => {
  return await Promise.all(
    media.map(async (m) => {
      m.coverImage.blurHash = await generateBlurhash(m.coverImage.medium!);
      return m;
    })
  );
};
