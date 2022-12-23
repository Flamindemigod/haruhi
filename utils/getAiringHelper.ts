export default (mediaListEntry: any) => {
  const airingSchedule = mediaListEntry.media?.airingSchedule;

  delete mediaListEntry.media?.airingSchedule;

  if (airingSchedule) {
    const nextAiringIndex = airingSchedule.edges.findIndex(
      (element: any) => element.node.timeUntilAiring > 0
    );
    mediaListEntry.media["nextAiring"] = airingSchedule.edges[nextAiringIndex];
  } else {
    mediaListEntry.media["nextAiring"] = null;
  }
  return mediaListEntry;
};
