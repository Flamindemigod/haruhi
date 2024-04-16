'use client';

import { Portal } from '@radix-ui/react-portal';
import cx from 'classix';
import { useEffect, useState } from 'react';
import Select from '~/primitives/Select';
import { ListSort, ListStatus } from '~/types.shared/anilist';

type Props = {
  list: ListStatus;
  sort: ListSort;
  setParams: (list: ListStatus, sort: ListSort) => void;
};

export default (props: Props) => {
  const [_, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <Portal container={document?.getElementById('nav-top-panel')}>
      <div className='flex gap-8 border-b-2 border-solid border-b-primary-500 bg-offWhite-50 p-1 dark:bg-black'>
        <Select
          defaultValue={ListStatus.Current}
          onValueChange={(v) => {
            props.setParams(v, props.sort);
          }}
          triggerAriaLabel={'List Selector'}
          align='center'
          trigger={
            <button
              className={cx(
                'relative w-full py-1 font-medium',
                'before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25'
              )}
            >
              {props.list}
            </button>
          }
          side={'top'}
          values={Object.values(ListStatus).map((e) => ({
            value: e,
            displayTitle: e,
          }))}
          value={props.list}
        />
        <Select
          defaultValue={ListSort.AddedTimeDesc}
          onValueChange={(v) => {
            props.setParams(props.list, v);
          }}
          triggerAriaLabel={'Sort Selector'}
          align='center'
          trigger={
            <button
              className={cx(
                'relative w-full py-1 font-medium',
                'before:absolute before:inset-0 before:bg-gradient-to-l before:from-transparent before:via-offWhite-800/25 before:to-transparent before:blur-lg dark:before:via-offWhite-400/25'
              )}
            >
              {props.sort}
            </button>
          }
          side={'top'}
          values={Object.values(ListSort).map((e) => ({
            value: e,
            displayTitle: e,
          }))}
          value={props.sort}
        />
      </div>
    </Portal>
  );
};
