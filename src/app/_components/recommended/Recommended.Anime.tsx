import { api } from '~/trpc/server';
import { Category } from '~/types.shared/anilist';
import RecommendedClient from './Recommended.Client';

export default async () => {
  const data_recommended_anime = await api.anilist.manga.getRecommended.query();
  return (
    <RecommendedClient type={Category.Anime} data={data_recommended_anime} />
  );
};
