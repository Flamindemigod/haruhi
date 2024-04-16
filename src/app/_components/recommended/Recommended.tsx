import { SegmentFallback } from '../CardCarosel';
import { Suspense } from 'react';
import RecommendedAnime from './Recommended.Anime';
import RecommendedManga from './Recommended.Manga';

export default async () => {
  return (
    <div className='flex w-full flex-col gap-4 py-4'>
      <Suspense
        fallback={
          <SegmentFallback
            title='Anime You Might Like'
            fallback='Building Anime Recommendations'
          />
        }
      >
        <RecommendedAnime />
      </Suspense>
      <Suspense
        fallback={
          <SegmentFallback
            title='Manga You Might Like'
            fallback='Building Manga Recommendations'
          />
        }
      >
        <RecommendedManga />
      </Suspense>
    </div>
  );
};
