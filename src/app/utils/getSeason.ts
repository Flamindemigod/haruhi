import { Season } from "~/types.shared/anilist";

export default (date: Date): Exclude<Season, Season.any> => {
  const month = date.getMonth() + 1; // JavaScript months are zero-based
  if (month >= 1 && month <= 3) {
    return Season.Winter;
  } else if (month >= 4 && month <= 6) {
    return Season.Spring;
  } else if (month >= 7 && month <= 9) {
    return Season.Summer;
  } else {
    return Season.Fall;
  }
};
