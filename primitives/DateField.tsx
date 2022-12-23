import { useRef } from "react";
import { useLocale } from "@react-aria/i18n";
import { useDateFieldState } from "@react-stately/datepicker";
import { useDateField } from "@react-aria/datepicker";
import { createCalendar } from "@internationalized/date";
import { DateSegment } from "./DateSegment";

export function DateField(props: any) {
  let { locale } = useLocale();
  let state = useDateFieldState({
    ...props,
    locale,
    createCalendar,
  });

  let ref = useRef<any>();
  let { labelProps, fieldProps } = useDateField(props, state, ref);

  return (
    <div className={`flex flex-col items-start ${props.className || ""}`}>
      <span {...labelProps} className="text-sm text-gray-800">
        {props.label}
      </span>
      <div {...fieldProps} ref={ref} className="flex">
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
}
