'use client';

import { Category, Media } from '~/types.shared/anilist';
import { SegmentProps, Segment } from '../CardCarosel';
import { api } from '~/trpc/react';
type Props = {
  data: Media[];
  type: Category.Anime | Category.Manga;
};

export default (props: Props) => {
  switch (props.type) {
    case Category.Anime:
      const { data: animeData } = api.anilist.anime.getRecommended.useQuery(
        undefined,
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
    case Category.Manga:
      const { data: mangaData } = api.anilist.manga.getRecommended.useQuery(
        undefined,
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
};
