"use client";

import { Fragment } from "react";
import Card from "../CardMain";
import { useInfiniteQuery } from "@tanstack/react-query";
import useDebounce from "../../utils/useDebounce";
type Props = {
  searchString: string;
  sort: string;
  filters: any;
};

const SearchResultsManga = (props: Props) => {
  const debouncedFilter = useDebounce(props.filters, 1000);
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["mangaSearch", props.searchString, props.sort, debouncedFilter],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER
        }/api/getSearchResultsAdvanced?page=${pageParam}&type=MANGA&sort=${
          !!props.searchString || props.sort !== "SEARCH_MATCH"
            ? props.sort
            : "POPULARITY_DESC"
        }${!!props.searchString ? `&search=${props.searchString}` : ""}${
          debouncedFilter.isAdult !== undefined
            ? `&isAdult=${debouncedFilter.isAdult}`
            : ""
        }${
          !!debouncedFilter.format ? `&format=${debouncedFilter.format}` : ""
        }${
          !!debouncedFilter.status ? `&status=${debouncedFilter.status}` : ""
        }${
          !!debouncedFilter.countryOfOrigin
            ? `&countryOfOrigin=${debouncedFilter.countryOfOrigin}`
            : ""
        }${
          !!debouncedFilter.season ? `&season=${debouncedFilter.season}` : ""
        }${
          !!debouncedFilter.seasonYear
            ? `&seasonYear=${debouncedFilter.seasonYear}`
            : ""
        }${
          debouncedFilter.onList !== undefined
            ? `&onList=${debouncedFilter.onList}`
            : ""
        }${
          debouncedFilter.yearLesser !== new Date().getFullYear() + 1 ||
          debouncedFilter.yearGreater !== 1970
            ? `&yearLesser=${debouncedFilter.yearLesser}0000`
            : ""
        }${
          debouncedFilter.yearGreater !== 1970 ||
          debouncedFilter.yearLesser !== new Date().getFullYear() + 1
            ? `&yearGreater=${debouncedFilter.yearGreater}0000`
            : ""
        }${
          debouncedFilter.chapterLesser !== 500
            ? `&chapterLesser=${debouncedFilter.chapterLesser}`
            : ""
        }${
          debouncedFilter.chapterGreater !== 0
            ? `&chapterGreater=${debouncedFilter.chapterGreater}`
            : ""
        }${
          debouncedFilter.volumeLesser !== 50
            ? `&volumeLesser=${debouncedFilter.volumeLesser}`
            : ""
        }${
          debouncedFilter.volumeGreater !== 0
            ? `&volumeGreater=${debouncedFilter.volumeGreater}`
            : ""
        }${
          !!debouncedFilter.genres.length
            ? `&genres=${debouncedFilter.genres}`
            : ""
        }${
          !!debouncedFilter.excludedGenres.length
            ? `&excludedGenres=${debouncedFilter.excludedGenres}`
            : ""
        }${
          !!debouncedFilter.tags.length ? `&tags=${debouncedFilter.tags}` : ""
        }${
          !!debouncedFilter.excludedTags.length
            ? `&excludedTags=${debouncedFilter.excludedTags}`
            : ""
        }`
      );
      return res.json();
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.Page.pageInfo.hasNextPage
        ? lastPage.Page.pageInfo.currentPage + 1
        : false;
    },
  });
  return (
    <>
      {data?.pages.map((page: any, index: number) => (
        <Fragment key={index}>
          {page.Page.media.map((media: any) => (
            <Card
              key={media.id}
              href={`/${media.type.toLowerCase()}/${media.id}`}
              imgSrc={media.coverImage.large}
              imgSrcSmall={media.coverImage.medium}
              contentEpisodes={
                media.type === "ANIME" ? media.episodes : media.chapters
              }
              contentFormat={media.format?.replaceAll("_", " ")}
              contentNextAiringEpisode={media.nextAiringEpisode?.episode}
              contentNextAiringEpisodeTime={
                media.nextAiringEpisode?.timeUntilAiring
              }
              contentProgress={media.mediaListEntry?.progress}
              contentStatus={media.status?.replaceAll("_", " ")}
              contentSubtitle={media.description}
              contentTitle={media.title.userPreferred}
              contentTitleEnglish={media.title.english}
              contentType={media.type}
              cardDirection="bottom"
              imgWidth={156}
              imgHeight={220}
            />
          ))}
        </Fragment>
      ))}
      {hasNextPage && (
        <button
          className="btn | flex justify-center items-center bg-primary-500 col-span-full"
          onClick={() => {
            fetchNextPage();
          }}
        >
          Load More...
        </button>
      )}
    </>
  );
};

export default SearchResultsManga;
