import { api } from "~/trpc/server";
import { Category } from "~/types.shared/anilist";
import { SegmentProps, Segment } from "../CardCarosel";

export default async () => {
  const data_current_anime = await api.anilist.getCurrentAnime.query();
  const data_current_manga = await api.anilist.getCurrentManga.query();
  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <Segment
        title="Currently Watching"
        data={data_current_anime as SegmentProps["data"]}
        type={Category.anime}
      />
      <Segment
        title="Currently Reading"
        data={data_current_manga as SegmentProps["data"]}
        type={Category.manga}
      />
    </div>
  );
};
