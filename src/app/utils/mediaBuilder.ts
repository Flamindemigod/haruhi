import {
  Media as AniMedia,
  MediaFormat,
  MediaListStatus,
  MediaSeason,
  MediaStatus,
  MediaType,
} from "~/__generated__/graphql";
import generateBlurhash from "./generateBlurhash";
import {
  Category,
  FormatAnime,
  FormatManga,
  ListStatus,
  Media,
  Season,
  Status,
} from "~/types.shared/anilist";
import convertEnum from "./convertEnum";
import { FuzzyDate } from "./fuzzyDate";

export default async (data: AniMedia) => {
  const media_type = convertEnum(MediaType, Category, data.type);

  const get_format = (f: MediaFormat | null) => {
    switch (media_type) {
      case Category.Anime:
        return convertEnum(MediaFormat, FormatAnime, f) as FormatAnime;
      case Category.Manga:
        return convertEnum(MediaFormat, FormatManga, f) as FormatManga;
    }
    return null;
  };

  return {
    ...data,
    coverImage: {
      ...data.coverImage,
      blurHash: await generateBlurhash(data.coverImage!.medium!),
    },
    type: media_type,
    format: get_format(data.format),
    status: convertEnum(MediaStatus, Status, data.status) as Status,
    season: convertEnum(MediaSeason, Season, data.season) as Season,
    mediaListEntry: !!data.mediaListEntry
      ? {
          ...data.mediaListEntry,
          status: convertEnum(
            MediaListStatus,
            ListStatus,
            data.mediaListEntry.status,
          ),
          startedAt: data.mediaListEntry.startedAt
            ? new FuzzyDate().fromFuzzy(data.mediaListEntry.startedAt!).toDate()
            : null,
          completedAt: data.mediaListEntry.startedAt
            ? new FuzzyDate().fromFuzzy(data.mediaListEntry.startedAt!).toDate()
            : null,
        }
      : null,
  } as Media;
};
