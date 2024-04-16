'use client';

import { SelectNonNullableFields } from '~/app/utils/typescript-utils';
import { CardMedia } from '../Card';
import Drawer from '~/primitives/Drawer';
import Image from 'next/image';
import Background from '../Background';
import Select from '~/primitives/Select';
import { Category, ListStatus } from '~/types.shared/anilist';
import cx from 'classix';
import { CaretDownIcon } from '@radix-ui/react-icons';
import Rating from './Rating';
import Input from '~/primitives/Input';
import { parseInt } from 'lodash';
import Calender from '~/primitives/Calendar';
import { Separator } from '@radix-ui/themes';
import Button from '~/primitives/Button';
import { MdDelete, MdSave } from 'react-icons/md';
interface StatusSelectorProps {
  value: ListStatus | null;
  onValueChange: (val: ListStatus | null) => void;
}

const styles =
  'text-md rounded-md p-2 text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 flex gap-2 items-center justify-center w-full' as const;

const StatusSelector = (props: StatusSelectorProps) => {
  return (
    <Select
      {...props}
      trigger={
        <button className={cx(styles)}>
          {!props.value ? 'Not on List' : props.value}
          <CaretDownIcon />
        </button>
      }
      side='bottom'
      align='center'
      triggerAriaLabel='Media Status Selector'
      values={[
        ...Object.values(ListStatus).map((v) => ({
          value: v,
          displayTitle: v,
        })),
        { displayTitle: 'Not On List', value: null },
      ]}
      sideOffet={5}
      defaultValue={null}
    />
  );
};

type ProgressSelectorProps = {
  data: Props['data'];
  value: number;
  onValueChange: (val: number) => void;
};
const ProgressSelector = (props: ProgressSelectorProps) => {
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
                  : props.data.nextAiringEpisode.episode) ?? 0
            );
          case Category.Manga:
            return !!props.data.chapters ? props.data.chapters : undefined;
        }
      })()}
      id='mediaProgress'
      inputMode='numeric'
      onChange={(e) => {
        props.onValueChange(parseInt(e.target.value));
      }}
    />
  );
};

type RepeatSelectorProps = {
  value: number;
  onValueChange: (val: number) => void;
};
const RepeatSelector = (props: RepeatSelectorProps) => {
  return (
    <Input
      value={props.value}
      type='number'
      min={0}
      id='mediaRepeat'
      inputMode='numeric'
      onChange={(e) => {
        props.onValueChange(parseInt(e.target.value));
      }}
    />
  );
};

type Props = {
  refetch: () => void;
  control: { open: boolean; onOpenChange: (e: boolean) => void };
  container?: HTMLElement;
  mode: 'Desktop' | 'Mobile';
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
};

const ContentRender = (
  props: Omit<Props, 'trigger' | 'open' | 'onOpenChange'>
) => {
  return (
    <>
      <div className='relative isolate grid h-64 grid-cols-9 grid-rows-3 overflow-clip'>
        <Background
          classes='col-span-full row-span-full blur-md'
          backgroundImage={props.data.bannerImage}
        />
        <div className='col-start-2 col-end-9 row-span-2 row-start-2 grid grid-flow-row-dense grid-cols-7 overflow-clip bg-black/20 backdrop-blur-lg'>
          <div className='relative col-span-1 col-start-1 aspect-cover'>
            <Image
              fill
              className='mt-auto'
              src={props.data.coverImage.large!}
              blurDataURL={props.data.coverImage.blurHash}
              alt={`Cover of ${props.data.title.userPreferred}`}
              draggable={false}
              placeholder='blur'
            />
          </div>
          <div className='col-start-2 col-end-9 flex flex-col justify-center p-2 text-white'>
            <div className='font-semibold lg:text-xl'>
              {props.data.title.userPreferred}
            </div>
            <div className='text-sm lg:text-lg'>{props.data.title.english}</div>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-4 overflow-y-auto p-2 @container'>
        <div className='w-full'>
          <p>
            Make changes to your list entry of {props.data.title.userPreferred}.
          </p>
          <p>
            Click <span className='text-primary-400'>Save</span> when
            you&apos;re done. Or <span className='text-red-600'>Delete</span> to
            remove it from your lists.
          </p>
        </div>
        <form className='grid w-11/12 gap-2 gap-y-5 rounded-md bg-black/20 p-2 @sm:grid-cols-1 @md:grid-cols-2  @xl:grid-cols-3 @2xl:max-w-2xl'>
          <fieldset>
            <label
              htmlFor='Media Status Selector'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              Status
            </label>
            <StatusSelector
              value={props.data.mediaListEntry?.status ?? null}
              onValueChange={(v) => {
                console.error(
                  'TODO: Add Value Change Handler for Status Selector'
                );
              }}
            />
          </fieldset>
          <fieldset>
            <label
              htmlFor='mediaScore'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              Rating
            </label>
            <Rating
              value={props.data.mediaListEntry?.score ?? undefined}
              setValue={(v) => {
                console.error(
                  'TODO: Add Value Change Handler for Status Selector'
                );
              }}
            />
          </fieldset>
          <fieldset>
            <label
              htmlFor='mediaProgress'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              {(() => {
                switch (props.data.type) {
                  case Category.Anime:
                    return 'Episode Progress';
                  case Category.Manga:
                    return 'Chapter Progress';
                }
              })()}
            </label>
            <ProgressSelector
              data={props.data}
              value={0}
              onValueChange={(v) => {
                console.error(
                  'TODO: Add Value Change Handler for Progress Selector'
                );
              }}
            />
          </fieldset>
          <fieldset>
            <label
              htmlFor='mediaRepeat'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              {(() => {
                switch (props.data.type) {
                  case Category.Anime:
                    return 'Number of Rewatches';
                  case Category.Manga:
                    return 'Number of Rereads';
                }
              })()}
            </label>
            <RepeatSelector
              value={0}
              onValueChange={(v) => {
                console.error(
                  'TODO: Add Value Change Handler for Repeat Selector'
                );
              }}
            />
          </fieldset>
          <fieldset>
            <label
              htmlFor='mediaStart'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              Start Date
            </label>
            <Calender
              date={props.data.mediaListEntry?.startedAt}
              setDate={() => {
                console.error(
                  'TODO: Add Value Change Handler for Start Date Selector'
                );
              }}
            />
          </fieldset>
          <fieldset>
            <label
              htmlFor='mediaEnd'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              End Date
            </label>
            <Calender
              date={props.data.mediaListEntry?.completedAt}
              setDate={() => {
                console.error(
                  'TODO: Add Value Change Handler for End Date Selector'
                );
              }}
            />
          </fieldset>
        </form>
        <Separator my='3' orientation='horizontal' size={'4'} />
        <div className='flex w-full flex-grow flex-row flex-wrap justify-end gap-4 p-2 '>
          <Button className='transition-colors dark:bg-primary-600 dark:hover:bg-primary-500'>
            <MdSave /> Save
          </Button>
          <Button className='transition-colors dark:bg-red-700 dark:hover:bg-red-600'>
            <MdDelete />
            Delete Entry
          </Button>
        </div>
      </div>
    </>
  );
};

const Editor = (props: Props) => {
  return (
    <Drawer
      control={props.control}
      modal
      closeThreshold={0.2}
      className='max-h-screen w-full max-w-screen-lg'
      snapPoints={(() => {
        switch (props.mode) {
          case 'Desktop':
            return undefined;
          case 'Mobile':
            return undefined;
          // return [0.3, 1];
        }
      })()}
      side={(() => {
        switch (props.mode) {
          case 'Desktop':
            return 'right';
          case 'Mobile':
            return 'bottom';
        }
      })()}
      content={<ContentRender {...props} />}
    />
  );
};

export default Editor;
