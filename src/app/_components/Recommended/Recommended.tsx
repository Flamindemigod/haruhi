import { api } from "~/trpc/server";
import { Category } from "~/types.shared/anilist";
import { SegmentProps, Segment } from "../CardCarosel";
import { Suspense } from "react";
import RecommendedAnime from "./Recommended.Anime";
import RecommendedManga from "./Recommended.Manga";

export default async () => {
  const data_recommended_manga = await api.anilist.getRecommendedManga.query();
  return (
    <div className="flex w-full flex-col gap-4 py-4">
      <Suspense
        fallback={
          <Segment
            title="Anime You Might Like"
            data={[]}
            type={Category.anime}
          />
        }
      >
        <RecommendedAnime />
      </Suspense>
      <Suspense
        fallback={
          <Segment
            title="Manga You Might Like"
            data={[]}
            type={Category.manga}
          />
        }
      >
        <RecommendedManga />
      </Suspense>
    </div>
  );
};
