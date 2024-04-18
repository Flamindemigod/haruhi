'use client';

import { SelectNonNullableFields } from '~/app/utils/typescript-utils';
import { CardMedia } from '../Card';
import Drawer from '~/primitives/Drawer';
import Image from 'next/image';
import Background from '../Background';
import { Category, ListStatus, MediaListEdit } from '~/types.shared/anilist';
import Rating from './Rating';
import Calender from '~/primitives/Calendar';
import { Separator } from '@radix-ui/themes';
import Button from '~/primitives/Button';
import { MdDelete, MdSave } from 'react-icons/md';
import { useReducer } from 'react';
import { StatusSelector } from './Status';
import { ProgressSelector } from './Progress';
import { RepeatSelector } from './Repeat';
import { api } from '~/trpc/react';

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

enum StateActionKind {
  SetStatus,
  SetRating,
  SetProgess,
  SetRepeats,
  SetStart,
  SetEnd,
  SetPrivate,
  SetDelete,
}

type StateAction =
  | {
      type: StateActionKind.SetStatus;
      payload: ListStatus;
    }
  | { type: StateActionKind.SetRating; payload: number }
  | {
      type: StateActionKind.SetProgess;
      payload: number;
    }
  | {
      type: StateActionKind.SetRepeats;
      payload: number;
    }
  | {
      type: StateActionKind.SetStart;
      payload: Date | null;
    }
  | {
      type: StateActionKind.SetEnd;
      payload: Date | null;
    }
  | {
      type: StateActionKind.SetPrivate;
      payload: Boolean;
    }
  | {
      type: StateActionKind.SetDelete;
    };

type State = {
  status?: ListStatus | null;
  rating?: number;
  progress?: number;
  repeats?: number;
  startedAt?: Date | null;
  completedAt?: Date | null;
  private?: true;
  delete?: true;
};

const ContentRender = (
  props: Omit<Props, 'trigger' | 'open' | 'onOpenChange'> & {
    close: () => void;
  }
) => {
  const setMutation = api.anilist.setMediaEntry.useMutation();
  const deleteMutation = api.anilist.deleteMediaEntry.useMutation();
  const reducer = (state: State, action: StateAction): State => {
    switch (action.type) {
      case StateActionKind.SetStatus:
        return {
          ...state,
          status: action.payload,
          delete: action.payload === null ? true : undefined,
        };
      case StateActionKind.SetRating:
        return { ...state, rating: action.payload };
      case StateActionKind.SetProgess:
        return { ...state, progress: action.payload };
      case StateActionKind.SetRepeats:
        return { ...state, repeats: action.payload };
      case StateActionKind.SetStart:
        return { ...state, startedAt: action.payload };
      case StateActionKind.SetEnd:
        return { ...state, completedAt: action.payload };
      case StateActionKind.SetPrivate:
        return {
          ...state,
          private: action.payload === true ? true : undefined,
        };
      case StateActionKind.SetDelete:
        return {
          delete: true,
        };
    }
  };
  const [state, dispatch] = useReducer(reducer, {});
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!!state.delete) {
              if (!!props.data.mediaListEntry?.id) {
                deleteMutation.mutate(
                  { id: props.data.mediaListEntry.id },
                  {
                    onSettled: () => {
                      props.refetch();
                      props.close();
                    },
                  }
                );
              }
            } else {
              const input: MediaListEdit = {
                status: state.status,
                startedAt: state.startedAt ?? undefined,
                completedAt: state.completedAt ?? undefined,
                repeat: state.repeats ?? undefined,
                score: state.rating ?? undefined,
                private: state.private ?? undefined,
                mediaId: props.data.id,
                progress: state.progress ?? undefined,
                id: props.data.mediaListEntry?.id ?? undefined,
                notes: null,
              };
              setMutation.mutate(input, {
                onSettled: () => {
                  props.refetch();
                  props.close();
                },
              });
            }
          }}
          className='grid w-11/12 gap-2 gap-y-5 rounded-md bg-black/20 p-2 @md:grid-cols-1  @xl:grid-cols-2 @2xl:max-w-2xl'
        >
          <fieldset>
            <label
              htmlFor='Media Status Selector'
              className='text-md font-medium text-offWhite-700 dark:text-offWhite-100'
            >
              Status
            </label>
            <StatusSelector
              value={
                state.status === undefined
                  ? props.data.mediaListEntry?.status ?? null
                  : state.status
              }
              onValueChange={(v) => {
                console.log('Status', v);
                dispatch({
                  type: StateActionKind.SetStatus,
                  payload: v,
                } as StateAction);
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
              value={
                state.rating === undefined
                  ? props.data.mediaListEntry?.score ?? undefined
                  : state.rating
              }
              setValue={(v) => {
                dispatch({
                  type: StateActionKind.SetRating,
                  payload: v,
                } as StateAction);
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
              value={state.progress}
              onValueChange={(v) => {
                dispatch({
                  type: StateActionKind.SetProgess,
                  payload: v,
                } as StateAction);
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
              value={state.repeats}
              defaultValue={props.data.mediaListEntry?.repeat ?? undefined}
              onValueChange={(v) => {
                dispatch({
                  type: StateActionKind.SetRepeats,
                  payload: v,
                } as StateAction);
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
              date={(() => {
                if (state.startedAt === null) {
                  return null;
                }
                if (state.startedAt === undefined) {
                  return props.data.mediaListEntry?.startedAt ?? null;
                }
                return state.startedAt;
              })()}
              setDate={(v) => {
                dispatch({
                  type: StateActionKind.SetStart,
                  payload: v,
                });
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
              date={(() => {
                if (state.completedAt === null) {
                  return null;
                }
                if (state.completedAt === undefined) {
                  return props.data.mediaListEntry?.completedAt ?? null;
                }
                return state.completedAt;
              })()}
              setDate={(v) => {
                dispatch({
                  type: StateActionKind.SetEnd,
                  payload: v,
                });
              }}
            />
          </fieldset>
          <Separator
            my='3'
            orientation='horizontal'
            size={'4'}
            className='col-span-full'
          />
          <div className='col-span-full flex w-full flex-grow flex-row flex-wrap justify-end gap-4 p-2 '>
            <Button className='transition-colors dark:bg-primary-600 dark:hover:bg-primary-500'>
              <MdSave /> Save
            </Button>
            <Button
              onClick={() => {
                dispatch({ type: StateActionKind.SetDelete });
              }}
              className='transition-colors dark:bg-red-700 dark:hover:bg-red-600'
            >
              <MdDelete />
              Delete Entry
            </Button>
          </div>
        </form>
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
      content={
        <ContentRender
          close={() => {
            props.control.onOpenChange(false);
          }}
          {...props}
        />
      }
    />
  );
};

export default Editor;
