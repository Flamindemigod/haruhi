import { api } from "~/trpc/server";
import { Category } from "~/types.shared/anilist";
import { SegmentProps, Segment } from "../CardCarosel";

export default async () => {
  const data_pending_anime = await api.anilist.getPendingAnime.query();
  const data_pending_manga = await api.anilist.getPendingManga.query();
  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <Segment
        title="Pending Picks"
        data={data_pending_anime as SegmentProps["data"]}
        type={Category.anime}
      />
      <Segment
        title="Unread Gems"
        data={data_pending_manga as SegmentProps["data"]}
        type={Category.manga}
      />
    </div>
  );
};
