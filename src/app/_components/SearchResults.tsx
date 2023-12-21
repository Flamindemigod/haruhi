import { Category, Filter } from "~/types.shared/anilist";
import { api } from "~/trpc/react";
import SearchResultAnime, {
  Props as SearchResultAnimeProps,
} from "./SearchResult.Anime";
export type Props = {
  searchString: string;
  filter: Filter;
};

export default (props: Props) => {
  switch (props.filter.category) {
    case Category.anime: {
      const { data } = api.anilist.searchAnime.useQuery({
        searchString: props.searchString,
        filters: props.filter,
      });
      return (
        <>
          {data?.Page.data.map((d, idx) => (
            <SearchResultAnime
              key={idx}
              media={d as SearchResultAnimeProps["media"]}
            />
          ))}
        </>
      );
    }
    case Category.manga:
    case Category.character:
    case Category.staff:
    case Category.studio:
  }
};
