import { api } from '~/trpc/server';
import { Category } from '~/types.shared/anilist';
import PendingClient from './Pending.Client';

export default async () => {
  const data_pending_anime = await api.anilist.anime.getPending.query();
  const data_pending_manga = await api.anilist.manga.getPending.query();
  return (
    <div className='flex w-full flex-col gap-4 py-4'>
      <PendingClient type={Category.Anime} data={data_pending_anime} />
      <PendingClient type={Category.Manga} data={data_pending_manga} />
    </div>
  );
};
