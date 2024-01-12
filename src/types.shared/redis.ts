import { Category } from "./anilist";

export const buildRecommendationKey = (
  userId: number,
  type: Category.anime | Category.manga,
) => {
  return `recommendation/${type}/${userId}` as const;
};
