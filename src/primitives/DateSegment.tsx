import { useRef } from 'react';
import { useDateSegment } from '@react-aria/datepicker';
import {
  DateSegment as DateSegmentProps,
  DateFieldState,
} from '@react-stately/datepicker';
export function DateSegment({
  segment,
  state,
}: {
  segment: DateSegmentProps;
  state: DateFieldState;
}) {
  let ref = useRef<HTMLDivElement>(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null ?
            String(segment.maxValue).length + 'ch'
          : '0',
      }}
      className={`group box-content rounded-sm px-0.5 text-right tabular-nums outline-none focus:bg-primary-500 focus:text-white`}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span
        aria-hidden='true'
        className='dark:offWhte block w-full text-center italic text-gray-500 group-focus:text-white'
        style={{
          visibility: segment.isPlaceholder ? 'visible' : 'hidden',
          height: segment.isPlaceholder ? '' : 0,
          width: segment.isPlaceholder ? '' : 0,
          pointerEvents: 'none',
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? '' : segment.text}
    </div>
  );
}
