"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Media } from "~/app/utils/Media";
import median from "~/app/utils/median";
import mod from "~/app/utils/mod";
import {
  CURRENT_SEASON,
  CURRENT_YEAR,
  Season,
  YEAR_MAX,
  validSeasons,
} from "~/types.shared/anilist";
import SeasonalMobile from "./Seasonal.Mobile";
import { api } from "~/trpc/react";
import SeasonalDesktop from "./Seasonal.Desktop";

type Props = {
  season: Exclude<Season, Season.any>;
  year: number;
};

export default (props: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const {
    data: seasonData,
    fetchNextPage,
    isFetching,
  } = api.anilist.getSeasonal.useInfiniteQuery(
    {
      year: props.year,
      season: props.season,
    },
    {
      refetchOnMount: false,
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      initialCursor: 1,
    },
  );

  const setSeason = (season: Exclude<Season, Season.any>, year: number) => {
    const params = new URLSearchParams();
    params.set("season", season as string);
    params.set("year", `${median([1970, year, YEAR_MAX])}`);
    push(`${pathname}?${params.toString()}`);
  };

  const goToPrevSeason = () => {
    const k = validSeasons.indexOf(props.season) - 1;
    const seasonIndex = mod(k, validSeasons.length);
    const seasonYear = k < 0 ? props.year - 1 : props.year;
    const season = validSeasons[seasonIndex];
    setSeason(season ?? CURRENT_SEASON, seasonYear);
  };
  const goToNextSeason = () => {
    const k = validSeasons.indexOf(props.season) + 1;
    const seasonIndex = mod(k, validSeasons.length);
    const seasonYear = k >= validSeasons.length ? props.year + 1 : props.year;
    const season = validSeasons[seasonIndex];
    setSeason(season ?? CURRENT_SEASON, seasonYear);
  };

  const goToCurrentSeason = () => setSeason(CURRENT_SEASON, CURRENT_YEAR);

  return (
    <>
      <Media className="w-full" lessThan="md">
        {/*Mobile Seasonal View*/}
        <SeasonalMobile
          {...props}
          isFetching={isFetching}
          onReachBottom={() => {
            fetchNextPage();
          }}
          setSeason={setSeason}
          setPrevSeason={goToPrevSeason}
          setNextSeason={goToNextSeason}
          setCurrentSeason={goToCurrentSeason}
          data={seasonData?.pages.map((p) => p?.data!).flat() ?? []}
        />
      </Media>
      <Media className="w-full" greaterThanOrEqual="md">
        {/*Desktop Seasonal View*/}
        <SeasonalDesktop
          {...props}
          isFetching={isFetching}
          onReachBottom={() => {
            fetchNextPage();
          }}
          setSeason={setSeason}
          setPrevSeason={goToPrevSeason}
          setNextSeason={goToNextSeason}
          setCurrentSeason={goToCurrentSeason}
          data={seasonData?.pages.map((p) => p?.data!).flat() ?? []}
        />
      </Media>
    </>
  );
};
