import { SelectNonNullableFields } from '~/app/utils/typescript-utils';
import { CardMedia } from '../Card';
import Input from '~/primitives/Input';
import { Category } from '~/types.shared/anilist';
import median from '~/app/utils/median';

type ProgressSelectorProps = {
  data: SelectNonNullableFields<
    CardMedia,
    keyof Omit<
      CardMedia,
      | 'airingSchedule'
      | 'mediaListEntry'
      | 'averageScore'
      | 'season'
      | 'seasonYear'
      | 'status'
      | 'format'
    >
  >;
  value: number | undefined;
  onValueChange: (val: number) => void;
};
export const ProgressSelector = (props: ProgressSelectorProps) => {
  return (
    <Input
      value={props.value}
      defaultValue={props.data.mediaListEntry?.progress ?? 0}
      type='number'
      min={0}
      max={(() => {
        switch (props.data.type) {
          case Category.Anime:
            return (
              (!!props.data.episodes && !!props.data.nextAiringEpisode
                ? props.data.nextAiringEpisode.episode <= props.data.episodes
                  ? props.data.nextAiringEpisode.episode - 1
                  : props.data.episodes
                : !!props.data.episodes
                  ? props.data.episodes
                  : props.data.nextAiringEpisode.episode) ?? undefined
            );
          case Category.Manga:
            return !!props.data.chapters ? props.data.chapters : undefined;
        }
      })()}
      id='mediaProgress'
      inputMode='numeric'
      onChange={(e) => {
        props.onValueChange(
          median([
            0,
            parseInt(e.target.value),
            (() => {
              switch (props.data.type) {
                case Category.Anime:
                  return (
                    (!!props.data.episodes && !!props.data.nextAiringEpisode
                      ? props.data.nextAiringEpisode.episode <=
                        props.data.episodes
                        ? props.data.nextAiringEpisode.episode - 1
                        : props.data.episodes
                      : !!props.data.episodes
                        ? props.data.episodes
                        : props.data.nextAiringEpisode.episode) ?? undefined
                  );
                case Category.Manga:
                  return !!props.data.chapters
                    ? props.data.chapters
                    : undefined;
              }
            })() ?? 999999999,
          ])
        );
      }}
    />
  );
};
