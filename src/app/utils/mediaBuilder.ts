import {
  Media as AniMedia,
  MediaFormat,
  MediaListStatus,
  MediaSeason,
  MediaStatus,
  MediaType,
} from '~/__generated__/graphql';
import generateBlurhash from './generateBlurhash';
import {
  Category,
  FormatAnime,
  FormatManga,
  ListStatus,
  Media,
  Season,
  Status,
} from '~/types.shared/anilist';
import convertEnum from './convertEnum';
import { FuzzyDate } from './fuzzyDate';

const mediaBuilder = async (data: AniMedia, genBlurhash?: boolean) => {
  const media_type = convertEnum(MediaType, Category, data.type);
  const genBlur = genBlurhash ?? true;
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
      blurHash: genBlur
        ? await generateBlurhash(data.coverImage!.medium!)
        : undefined,
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
            data.mediaListEntry.status
          ) as ListStatus,
          startedAt:
            !!data.mediaListEntry.startedAt &&
            !!data.mediaListEntry.startedAt.day &&
            !!data.mediaListEntry.startedAt.month &&
            !!data.mediaListEntry.startedAt.year
              ? new FuzzyDate()
                  .fromFuzzy(data.mediaListEntry.startedAt!)
                  .toDate()
              : null,
          completedAt:
            !!data.mediaListEntry.completedAt &&
            !!data.mediaListEntry.completedAt.day &&
            !!data.mediaListEntry.completedAt.month &&
            !!data.mediaListEntry.completedAt.year
              ? new FuzzyDate()
                  .fromFuzzy(data.mediaListEntry.completedAt!)
                  .toDate()
              : null,
        }
      : null,
  } as Media;
};

export default mediaBuilder;
