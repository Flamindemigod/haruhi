import { api } from '~/trpc/server';
import { Category } from '~/types.shared/anilist';
import CurrentClient from './Current.Client';

export default async () => {
  const data_current_anime = await api.anilist.getCurrentAnime.query();
  const data_current_manga = await api.anilist.getCurrentManga.query();
  return (
    <div className='flex w-full flex-col gap-4 py-4'>
      <CurrentClient type={Category.Anime} data={data_current_anime} />
      <CurrentClient type={Category.Manga} data={data_current_manga} />
    </div>
  );
};
