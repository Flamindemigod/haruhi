"use client";

import { usePathname, useRouter } from "next/navigation";
import { Media } from "~/app/utils/Media";
import { api } from "~/trpc/react";
import { Category, ListSort, ListStatus } from "~/types.shared/anilist";
import ListDesktop from "./List.Desktop";
import ListMobile from "./List.Mobile";

type Props = {
  type: Category.anime | Category.manga;
  list: ListStatus;
  sort: ListSort;
};

const useList = (props: Props) => {
  switch (props.type) {
    case Category.anime:
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

    case Category.manga:
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

  return (
    <>
      <Media className="w-full" lessThan="md">
        {/*Mobile View*/}
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
      </Media>
      <Media className="w-full" greaterThanOrEqual="md">
        {/*Desktop View*/}
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
      </Media>
      ;
    </>
  );
};
