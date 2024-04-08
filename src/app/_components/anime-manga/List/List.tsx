"use client";

import { usePathname, useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Category, ListSort, ListStatus } from "~/types.shared/anilist";
import ListDesktop from "./List.Desktop";
import ListMobile from "./List.Mobile";
import { useMediaQuery } from "~/app/hooks/useMediaQuery";

type Props = {
  type: Category.Anime | Category.Manga;
  list: ListStatus;
  sort: ListSort;
};

const useList = (props: Props) => {
  switch (props.type) {
    case Category.Anime:
      return api.anilist.getAnimeList.useInfiniteQuery(
        {
          list: props.list,
          sort: props.sort,
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

    case Category.Manga:
      return api.anilist.getMangaList.useInfiniteQuery(
        {
          list: props.list,
          sort: props.sort,
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
  }
};

export default (props: Props) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const {
    data: listData,
    fetchNextPage,
    isFetching,
    hasNextPage,
  } = useList(props);

  const setParams = (list: ListStatus, sort: ListSort) => {
    const params = new URLSearchParams();
    params.set("list", list as string);
    params.set("sort", sort as string);
    push(`${pathname}?${params.toString()}`);
  };
  const matches = useMediaQuery(`(min-width: 640px)`);
  return (
    <>
      <div className="w-full sm:hidden">
        {/*Mobile View*/}
        {(matches === null || !matches) && (
          <ListMobile
            type={props.type}
            list={props.list}
            data={listData?.pages.map((p) => p?.data!).flat() ?? []}
            sort={props.sort}
            setParams={setParams}
            isFetching={isFetching}
            onReachBottom={() => {
              if (hasNextPage) fetchNextPage();
            }}
          />
        )}
      </div>
      <div className="hidden w-full sm:block">
        {/*Desktop View*/}
        {(matches === null || matches) && (
          <ListDesktop
            type={props.type}
            list={props.list}
            data={listData?.pages.map((p) => p?.data!).flat() ?? []}
            sort={props.sort}
            setParams={setParams}
            isFetching={isFetching}
            onReachBottom={() => {
              if (hasNextPage) fetchNextPage();
            }}
          />
        )}
      </div>
    </>
  );
};
