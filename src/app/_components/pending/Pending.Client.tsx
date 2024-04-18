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
      const { data: animeData } = api.anilist.anime.getPending.useQuery(
        undefined,
        {
          initialData: props.data,
        }
      );
      return (
        <Segment
          title='Pending Picks'
          data={animeData as SegmentProps['data']}
          type={Category.Anime}
        />
      );
    case Category.Manga:
      const { data: mangaData } = api.anilist.manga.getPending.useQuery(
        undefined,
        {
          initialData: props.data,
        }
      );
      return (
        <Segment
          title='Unread Gems'
          data={mangaData as SegmentProps['data']}
          type={Category.Manga}
        />
      );
  }
};
