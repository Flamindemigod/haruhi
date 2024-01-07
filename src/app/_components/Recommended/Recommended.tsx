import { api } from "~/trpc/server";
import { Category } from "~/types.shared/anilist";
import { SegmentProps, Segment } from "../CardCarosel";

export default async () => {
  const data_recommended_anime = await api.anilist.getRecommendedAnime.query();
  const data_recommended_manga = await api.anilist.getRecommendedManga.query();
  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <Segment
        title="Anime You Might Like"
        data={data_recommended_anime as SegmentProps["data"]}
        type={Category.anime}
      />
      <Segment
        title="Manga You Might Like"
        data={data_recommended_manga as SegmentProps["data"]}
        type={Category.manga}
      />
    </div>
  );
};
