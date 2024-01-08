import { api } from "~/trpc/server";
import { Category } from "~/types.shared/anilist";
import { SegmentProps, Segment } from "../CardCarosel";

export default async () => {
  const data_recommended_manga = await api.anilist.getRecommendedManga.query();
  return (
    <Segment
      title="Manga You Might Like"
      data={data_recommended_manga as SegmentProps["data"]}
      type={Category.manga}
    />
  );
};
