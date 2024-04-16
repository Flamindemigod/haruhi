'use client';

import Dialog, { Props as DialogProps } from '~/primitives/Dialog';

import useSearch from '../hooks/useSearch';
import { useRef } from 'react';

import SearchResults from './SearchResults';
export type Props = Pick<DialogProps, 'open' | 'onOpenChange'>;

export default (props: Props) => {
  const dialogContentRef = useRef<HTMLDivElement>(null);
  const {
    render: searchRender,
    filter,
    searchString,
  } = useSearch(dialogContentRef);

  return (
    <Dialog
      contentRef={dialogContentRef}
      {...props}
      content={
        <>
          {searchRender}
          <div className='flex flex-col gap-4 rounded-md p-0.5 @container dark:bg-white/10 md:p-2 [&>*:nth-child(even)]:bg-white/10 [&>*:nth-child(odd)]:bg-black/20'>
            <SearchResults filter={filter} searchString={searchString} />
          </div>
        </>
      }
    />
  );
};
