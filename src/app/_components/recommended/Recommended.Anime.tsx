import { api } from "~/trpc/server";
import { Category } from "~/types.shared/anilist";
import { SegmentProps, Segment } from "../CardCarosel";

export default async () => {
  const data_recommended_anime = await api.anilist.getRecommendedAnime.query();
  return (
    <Segment
      title="Anime You Might Like"
      data={data_recommended_anime as SegmentProps["data"]}
      type={Category.Anime}
    />
  );
};
