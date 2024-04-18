import { MediaSort } from '~/__generated__/graphql';
import { SegmentProps, Segment } from '../CardCarosel';
import { Category } from '~/types.shared/anilist';
import { api } from '~/trpc/server';
import TrendingClient from './Trending.Client';

const Page = async () => {
  const data_seasonal_trending = await api.anilist.anime.getTrending.query({
    seasonal: true,
    sort: MediaSort.TrendingDesc,
  });
  const data_popularity = await api.anilist.anime.getTrending.query({
    seasonal: false,
    sort: MediaSort.PopularityDesc,
  });
  const data_popularity_manga = await api.anilist.manga.getTrending.query({
    sort: MediaSort.PopularityDesc,
  });

  return (
    <div className='flex w-full flex-col gap-4 py-4'>
      <TrendingClient type={Category.Anime} data={data_seasonal_trending} />
      <TrendingClient type={Category.Anime} data={data_popularity} alltime />
      <TrendingClient
        type={Category.Manga}
        data={data_popularity_manga}
        alltime
      />
    </div>
  );
};

export default Page;
