export default (data: any): any => {
  const mediaArray = data.data.Page.mediaList;
  let recommendationList: any = [];
  for (const media in mediaArray) {
    const recommendationEdges = mediaArray[media].media.recommendations.edges;
    for (const edge in recommendationEdges) {
      if (
        mediaArray[media].media.recommendations.edges[edge].node
          .mediaRecommendation
      ) {
        recommendationList =
          mediaArray[media].media.recommendations.edges[edge].node.rating >
            20 &&
          !mediaArray[media].media.recommendations.edges[edge].node
            .mediaRecommendation.mediaListEntry
            ? [
                ...recommendationList,
                mediaArray[media].media.recommendations.edges[edge].node
                  .mediaRecommendation,
              ]
            : recommendationList;
      }
    }
  }

  return [data.data.Page.pageInfo.hasNextPage, recommendationList];
};
