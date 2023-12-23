import { Category, Filter } from "~/types.shared/anilist";
import { api } from "~/trpc/react";
import SearchResultAnime, {
  Props as SearchResultAnimeProps,
} from "./SearchResult.Anime";
import SearchResultManga, {
  Props as SearchResultMangaProps,
} from "./SearchResult.Manga";
import SearchResultCharacter, {
  Props as SearchResultCharacterProps,
} from "./SearchResult.Character";
import SearchResultStaff, {
  Props as SearchResultStaffProps,
} from "./SearchResult.Staff";
import SearchResultStudio, {
  Props as SearchResultStudioProps,
} from "./SearchResult.Studio";
import { ThreeCircles } from "react-loader-spinner";
export type Props = {
  searchString: string;
  filter: Filter;
};

export default (props: Props) => {
  switch (props.filter.category) {
    case Category.anime: {
      const { data, isFetching } = api.anilist.searchAnime.useQuery(
        {
          searchString: props.searchString,
          filters: props.filter,
        },
        {
          refetchInterval: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      );

      if (isFetching) {
        return (
          <div className="h-full">
            <ThreeCircles
              height="100"
              width="100"
              color="var(--clr-primary)"
              wrapperClass="flex flex-col justify-center items-center py-10"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
        );
      }
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
    case Category.manga: {
      const { data, isFetching } = api.anilist.searchManga.useQuery(
        {
          searchString: props.searchString,
          filters: props.filter,
        },
        {
          refetchInterval: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      );
      if (isFetching) {
        return (
          <div className="h-full">
            <ThreeCircles
              height="100"
              width="100"
              color="var(--clr-primary)"
              wrapperClass="flex flex-col justify-center items-center py-10"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
        );
      }
      return (
        <>
          {data?.Page.data.map((d, idx) => (
            <SearchResultManga
              key={idx}
              media={d as SearchResultMangaProps["media"]}
            />
          ))}
        </>
      );
    }
    case Category.character: {
      const { data, isFetching } = api.anilist.searchCharacters.useQuery(
        {
          searchString: props.searchString,
          filters: props.filter,
        },
        {
          refetchInterval: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      );
      if (isFetching) {
        return (
          <div className="h-full">
            <ThreeCircles
              height="100"
              width="100"
              color="var(--clr-primary)"
              wrapperClass="flex flex-col justify-center items-center py-10"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
        );
      }
      return (
        <>
          {data?.Page.data.map((d, idx) => (
            <SearchResultCharacter
              key={idx}
              data={d as SearchResultCharacterProps["data"]}
            />
          ))}
        </>
      );
    }
    case Category.staff: {
      const { data, isFetching } = api.anilist.searchStaff.useQuery(
        {
          searchString: props.searchString,
          filters: props.filter,
        },
        {
          refetchInterval: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      );
      if (isFetching) {
        return (
          <div className="h-full">
            <ThreeCircles
              height="100"
              width="100"
              color="var(--clr-primary)"
              wrapperClass="flex flex-col justify-center items-center py-10"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
        );
      }
      return (
        <>
          {data?.Page.data.map((d, idx) => (
            <SearchResultStaff
              key={idx}
              data={d as SearchResultStaffProps["data"]}
            />
          ))}
        </>
      );
    }
    case Category.studio: {
      const { data, isFetching } = api.anilist.searchStudio.useQuery(
        {
          searchString: props.searchString,
          filters: props.filter,
        },
        {
          refetchInterval: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
        },
      );
      if (isFetching) {
        return (
          <div className="h-full">
            <ThreeCircles
              height="100"
              width="100"
              color="var(--clr-primary)"
              wrapperClass="flex flex-col justify-center items-center py-10"
              visible={true}
              ariaLabel="three-circles-rotating"
            />
          </div>
        );
      }
      return (
        <>
          {data?.Page.data.map((d, idx) => (
            <SearchResultStudio
              key={idx}
              data={d as SearchResultStudioProps["data"]}
            />
          ))}
        </>
      );
    }
  }
};
