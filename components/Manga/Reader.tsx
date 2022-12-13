"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect, useRef, useState } from "react";
import ComicViewer from "react-comic-viewer";
import { userContext } from "../../app/UserContext";
import { median } from "../../utils/median";
import Selector from "./Selector";

type Props = {
  entry: any;
};

const Reader = (props: Props) => {
  const queryClient = useQueryClient();
  const user = useContext(userContext);
  const [chapter, setChapter] = useState<number>(1);
  const [chapterId, setChapterId] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const statusUpdated = useRef<boolean>(false);
  const [imgSrc, setImageSrc] = useState<any>(undefined);
  const mangaChapters = useQuery({
    queryKey: ["mangaPages", props.entry.title.english],
    queryFn: async () => {
      const data = await fetch(
        `http://136.243.175.33:8080/api/getMangaChapters?title=${props.entry.title.english}`
      );
      return data.json();
    },
  });
  useEffect(() => {
    if (props.entry.mediaListEntry) {
      setChapter(
        median([
          1,
          props.entry.mediaListEntry.progress + 1,
          props.entry.chapters ? props.entry.chapters : 999999,
        ])
      );
    } else {
      setChapter(1);
    }
  }, []);

  useEffect(() => {
    if (mangaChapters.isSuccess) {
      setChapterId(
        mangaChapters.data.filter((el: any) => {
          const lower = new RegExp(/chapter-/);
          const upper = new RegExp(/$/);

          //prettier-ignore
          return el.id.match(lower.source + chapter + upper.source);
        })![0].id
      );
      queryClient.invalidateQueries({
        queryKey: ["mangaPages"],
        type: "all",
      });
      statusUpdated.current = false;
    }
  }, [chapter, mangaChapters.isSuccess]);

  const mangaPages = useQuery({
    queryKey: ["mangaPages", chapterId],
    queryFn: async () => {
      const data = await fetch(
        `http://136.243.175.33:8080/api/getMangaPanels?id=${chapterId}`
      );
      return data.json();
    },
  });

  const updateChapter = async (
    id: number,
    chapter: number,
    status: string,
    rewatches = 0
  ) => {
    const data = await fetch(
      `http://136.243.175.33:8080/api/setMediaEntry?&mediaId=${id}&status=${status}&progress=${chapter}&repeat=${rewatches}`
    );
    queryClient.invalidateQueries({
      queryKey: ["mediaListEntry"],
      type: "all",
    });

    // if (openToast) {
    //   setOpenToast(false);
    //   setTimeout(() => {
    //     setOpenToast(true);
    //   }, 400);
    // } else {
    //   setOpenToast(true);
    // }
  };
  useEffect(() => {
    if (user.userAuth) {
      console.log(progress / mangaPages.data?.length);

      if (
        progress / mangaPages.data?.length >=
          (user.userPreferenceMangaUpdateTreshold || 0.85) &&
        !statusUpdated.current
      ) {
        statusUpdated.current = true;
        if (chapter === 1) {
          if (props.entry.mediaListEntry) {
            if (props.entry.mediaListEntry.status === "COMPLETED") {
              updateChapter(
                props.entry.id,
                chapter,
                "CURRENT",
                props.entry.mediaListEntry.repeat + 1
              );
            }
          } else {
            updateChapter(
              props.entry.id,
              chapter,
              "CURRENT",
              props.entry.mediaListEntry ? props.entry.mediaListEntry.repeat : 0
            );
          }
        }
        if (chapter === props.entry.chapters) {
          if (chapter === 1) {
            updateChapter(
              props.entry.id,
              chapter,
              "COMPLETED",
              props.entry.mediaListEntry.repeat + 1
            );
          } else {
            updateChapter(
              props.entry.id,
              chapter,
              "COMPLETED",
              props.entry.mediaListEntry.repeat
            );
          }
        } else {
          updateChapter(
            props.entry.id,
            chapter,
            "CURRENT",
            props.entry.mediaListEntry ? props.entry.mediaListEntry.repeat : 0
          );
        }
      }
    }
  }, [progress]);

  return (
    <div className="mt-8 flex flex-col gap-2">
      {(mangaChapters.isFetching || mangaChapters.data?.length) && (
        <>
          {mangaPages.isSuccess && (
            <div className="">
              <ComicViewer
                onChangeCurrentPage={(e) => setProgress(e)}
                pages={mangaPages.data?.map((el: any) => el.img)}
              />
            </div>
          )}
          <div className="flex justify-center items-center">
            <Selector
              chapterList={mangaChapters.data || []}
              value={chapter}
              onValueChange={setChapter}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Reader;
