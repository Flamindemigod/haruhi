'use client';

import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import Search from './Search';
import { useState } from 'react';
import cx from 'classix';

type Props = {
  className?: string;
};
export default (props: Props) => {
  let [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className={cx(
          'flex items-center justify-center gap-2 overflow-clip rounded-full bg-offWhite-100 p-2 dark:bg-offWhite-900',
          'before:absolute before:inset-0 before:rounded-full  before:shadow-inner before:shadow-primary-400 before:motion-safe:animate-spin',
          props.className
        )}
      >
        <MagnifyingGlassIcon className='h-3/4 w-3/4' />
      </button>
      <Search open={open} onOpenChange={setOpen} />
    </>
  );
};
