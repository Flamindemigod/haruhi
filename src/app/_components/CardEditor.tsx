'use client';

import { Pencil1Icon } from '@radix-ui/react-icons';
import Tooltip from '~/primitives/Tooltip';
import { SelectNonNullableFields } from '../utils/typescript-utils';
import { CardMedia } from './Card';
import { useState } from 'react';
import MediaEditor from './anime-manga/MediaEditor';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { Portal } from '@radix-ui/react-portal';
import cx from 'classix';

const CardEditor = (props: {
  refetch: () => void;
  show: boolean;
  resetShow: () => void;
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
}) => {
  const [open, onOpenChange] = useState<boolean>(false);
  const matches = useMediaQuery(`(min-width: 640px)`);

  return (
    <>
      <>
        <div className='w-full sm:hidden'>
          {/*Mobile Seasonal View*/}
          {(matches === null || !matches) && !!props.show && (
            <Portal container={document?.getElementById('editor-area')}>
              <div className='flex gap-8 border-b-2 border-solid border-b-primary-500 bg-offWhite-50 p-1 dark:bg-black'>
                <button
                  className={cx(
                    'relative flex w-full flex-row items-center justify-center gap-2 py-1 font-medium',
                    'before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25'
                  )}
                  onClick={() => {
                    onOpenChange(true);
                  }}
                >
                  <Pencil1Icon className='h-5 w-5' /> Open Media List Editor
                </button>
              </div>
            </Portal>
          )}
        </div>
        <div className='hidden w-full sm:block'>
          {/*Desktop Seasonal View*/}
          {(matches === null || matches) && (
            <button
              onClick={() => {
                onOpenChange(true);
              }}
              className='absolute bottom-2 right-2 isolate z-20 h-8 w-8 overflow-clip rounded-full border-2 border-solid border-gray-700/30 p-1 after:absolute after:inset-0 after:-z-50 after:bg-white/10 after:backdrop-blur-md'
            >
              <Tooltip
                content={'Show Media Editor'}
                side='top'
                className='z-[100]'
              >
                <Pencil1Icon className='h-full w-full font-medium text-gray-700 hover:text-green-400' />
              </Tooltip>
            </button>
          )}
        </div>
      </>

      <MediaEditor
        refetch={props.refetch}
        control={{
          open,
          onOpenChange: (val: boolean) => {
            onOpenChange(val);
            if (!val) {
              props.resetShow();
            }
          },
        }}
        mode={(() => {
          if (matches === null || !matches) return 'Mobile';
          if (matches === null || matches) return 'Desktop';
          return 'Desktop';
        })()}
        data={props.data}
      />
    </>
  );
};

export default CardEditor;
