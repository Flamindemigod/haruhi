import { MediaSort } from '~/__generated__/graphql';
import { SegmentProps, Segment } from '../CardCarosel';
import { Category } from '~/types.shared/anilist';
import { api } from '~/trpc/server';

const Page = async () => {
  const data_seasonal_trending = await api.anilist.getTrendingAnime.query({
    seasonal: true,
    sort: MediaSort.TrendingDesc,
  });
  const data_popularity = await api.anilist.getTrendingAnime.query({
    seasonal: false,
    sort: MediaSort.PopularityDesc,
  });
  const data_popularity_manga = await api.anilist.getTrendingManga.query({
    sort: MediaSort.PopularityDesc,
  });

  return (
    <div className='flex w-full flex-col gap-4 py-4'>
      <Segment
        title='Trending Anime This Season'
        data={data_seasonal_trending?.Page.data as SegmentProps['data']}
        type={Category.Anime}
      />
      <Segment
        title='Trending Anime of All Time'
        data={data_popularity?.Page.data as SegmentProps['data']}
        type={Category.Anime}
      />
      <Segment
        title='Trending Manga of All Time'
        data={data_popularity_manga?.Page.data as SegmentProps['data']}
        type={Category.Manga}
      />
    </div>
  );
};

export default Page;
