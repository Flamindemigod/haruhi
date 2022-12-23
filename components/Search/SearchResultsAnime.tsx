"use client";

import { Fragment } from "react";
import Card from "../CardMain";
import { useInfiniteQuery } from "@tanstack/react-query";

type Props = {
  searchString: string;
  sort: string;
  filters: any;
};

const SearchResultsAnime = (props: Props) => {
  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["animeSearch", props.searchString, props.sort, props.filters],

    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `http://136.243.175.33:8080/api/getSearchResultsAdvanced?page=${pageParam}&type=ANIME&sort=${
          !!props.searchString || props.sort !== "SEARCH_MATCH"
            ? props.sort
            : "POPULARITY_DESC"
        }${!!props.searchString ? `&search=${props.searchString}` : ""}${
          props.filters.isAdult !== undefined
            ? `&isAdult=${props.filters.isAdult}`
            : ""
        }${!!props.filters.format ? `&format=${props.filters.format}` : ""}${
          !!props.filters.status ? `&status=${props.filters.status}` : ""
        }${
          !!props.filters.countryOfOrigin
            ? `&countryOfOrigin=${props.filters.countryOfOrigin}`
            : ""
        }${!!props.filters.season ? `&season=${props.filters.season}` : ""}${
          !!props.filters.seasonYear
            ? `&seasonYear=${props.filters.seasonYear}`
            : ""
        }${
          props.filters.onList !== undefined
            ? `&onList=${props.filters.onList}`
            : ""
        }${
          props.filters.yearLesser !== new Date().getFullYear() + 1 ||
          props.filters.yearGreater !== 1970
            ? `&yearLesser=${props.filters.yearLesser}0000`
            : ""
        }${
          props.filters.yearGreater !== 1970 ||
          props.filters.yearLesser !== new Date().getFullYear() + 1
            ? `&yearGreater=${props.filters.yearGreater}0000`
            : ""
        }${
          props.filters.episodeLesser !== 150
            ? `&episodeLesser=${props.filters.episodeLesser}`
            : ""
        }${
          props.filters.episodeGreater !== 0
            ? `&episodeGreater=${props.filters.episodeGreater}`
            : ""
        }${
          props.filters.durationLesser !== 170
            ? `&durationLesser=${props.filters.durationLesser}`
            : ""
        }${
          props.filters.durationGreater !== 0
            ? `&durationGreater=${props.filters.durationGreater}`
            : ""
        }${
          !!props.filters.genres.length ? `&genres=${props.filters.genres}` : ""
        }${
          !!props.filters.excludedGenres.length
            ? `&excludedGenres=${props.filters.excludedGenres}`
            : ""
        }${!!props.filters.tags.length ? `&tags=${props.filters.tags}` : ""}${
          !!props.filters.excludedTags.length
            ? `&excludedTags=${props.filters.excludedTags}`
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

export default SearchResultsAnime;
