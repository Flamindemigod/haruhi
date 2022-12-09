import { useRef } from "react";
import { useDateSegment } from "@react-aria/datepicker";

export function DateSegment({ segment, state }: { segment: any; state: any }) {
  let ref = useRef<any>();
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      style={{
        ...segmentProps.style,
        minWidth:
          segment.maxValue != null
            ? String(segment.maxValue).length + "ch"
            : "0",
      }}
      className={`px-0.5 box-content tabular-nums text-right outline-none rounded-sm focus:bg-primary-500 focus:text-white group`}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span
        aria-hidden="true"
        className="block w-full text-center italic text-gray-500 dark:offWhte group-focus:text-white"
        style={{
          visibility: segment.isPlaceholder ? "visible" : "hidden",
          height: segment.isPlaceholder ? "" : 0,
          width: segment.isPlaceholder ? "" : 0,
          pointerEvents: "none",
        }}
      >
        {segment.placeholder}
      </span>
      {segment.isPlaceholder ? "" : segment.text}
    </div>
  );
}
