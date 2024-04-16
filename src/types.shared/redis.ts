import { Category } from './anilist';

export const buildRecommendationKey = (
  userId: number,
  type: Category.Anime | Category.Manga
) => {
  return `recommendation/${type}/${userId}` as const;
};
