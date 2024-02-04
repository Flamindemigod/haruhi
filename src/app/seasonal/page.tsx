import { Season, SeasonValidator, YearValidator } from "~/types.shared/anilist";
import Seasonal from "../_components/seasonal/Seasonal";

export default async ({
  searchParams,
}: {
  searchParams?: {
    season?: Exclude<Season, Season.any>;
    year?: string;
  };
}) => {
  let season = SeasonValidator.parse(searchParams?.season);
  let seasonYear = YearValidator.parse(parseInt(searchParams?.year!));
  // Selector
  // <Prev_Year> <Winter><Spring><Summer><Fall> <Next_Year> // Desktop View
  // <Swipes to Move Up and Down a season> // Mobile View // Preload Seasonal
  return <Seasonal season={season} year={seasonYear} />;
};
