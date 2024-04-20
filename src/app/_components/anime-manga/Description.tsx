'use client';

import { useState } from 'react';

type Props = {
  description: string;
};

export default (props: Props) => {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  return (
    <div
      onClick={() => {
        setExpanded((state) => !state);
      }}
      className='relative isolate grid grid-rows-[8rem] overflow-hidden text-ellipsis p-4 transition-all duration-500 [&[data-expanded=true]]:grid-rows-[1fr]'
      data-expanded={isExpanded}
    >
      <div
        className='line-clamp-6 after:absolute after:inset-0 after:bg-gradient-to-t after:from-black/30 after:to-transparent after:transition-opacity after:duration-500 [&[data-expanded=true]]:line-clamp-none [&[data-expanded=true]]:after:opacity-0'
        dangerouslySetInnerHTML={{ __html: props.description }}
        data-expanded={isExpanded}
      />
      <button className='z-20 w-full text-center font-mono'>
        {!!isExpanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
};
