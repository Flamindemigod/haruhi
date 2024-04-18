'use client';

import { Category, Media } from '~/types.shared/anilist';
import { SegmentProps, Segment } from '../CardCarosel';
import { api } from '~/trpc/react';
import { MediaSort } from '~/__generated__/graphql';
type Props = {
  data: Media[];
  alltime?: true;
  type: Category.Anime | Category.Manga;
};

export default (props: Props) => {
  switch (props.type) {
    case Category.Anime:
      if (!!props.alltime) {
        const { data: animeData } = api.anilist.anime.getTrending.useQuery(
          {
            seasonal: false,
            sort: MediaSort.PopularityDesc,
          },
          {
            initialData: props.data,
          }
        );
        return (
          <Segment
            title='Anime You Might Like'
            data={animeData as SegmentProps['data']}
            type={Category.Anime}
          />
        );
      } else {
        const { data: animeData } = api.anilist.anime.getTrending.useQuery(
          {
            seasonal: true,
            sort: MediaSort.TrendingDesc,
          },
          {
            initialData: props.data,
          }
        );
        return (
          <Segment
            title='Trending Anime This Season'
            data={animeData as SegmentProps['data']}
            type={Category.Anime}
          />
        );
      }
    case Category.Manga:
      if (!!props.alltime) {
        const { data: mangaData } = api.anilist.manga.getTrending.useQuery(
          {
            sort: MediaSort.PopularityDesc,
          },
          {
            initialData: props.data,
          }
        );
        return (
          <Segment
            title='Manga You Might Like'
            data={mangaData as SegmentProps['data']}
            type={Category.Manga}
          />
        );
      }
  }
};
