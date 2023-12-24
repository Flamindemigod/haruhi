import { MediaSort } from "~/__generated__/graphql";
import { api } from "~/trpc/server";

export default () => {
  const data = api.anilist.getTrendingAnime.query({
    sort: MediaSort.PopularityDesc,
    seasonal: false,
  });
  return <></>;
};
