export default (media: any) => {
  const airingSchedule = media.airingSchedule;

  delete media.airingSchedule;

  if (airingSchedule) {
    const nextAiringIndex = airingSchedule.edges.findIndex(
      (element: any) => element.node.timeUntilAiring > 0
    );
    media["nextAiring"] = airingSchedule.edges[nextAiringIndex];
  } else {
    media["nextAiring"] = null;
  }
  return media;
};
