import { useRef } from "react";
import { useLocale } from "@react-aria/i18n";
import { useDateFieldState, DateFieldStateOptions } from "@react-stately/datepicker";
import { useDateField } from "@react-aria/datepicker";
import { createCalendar, parseDate } from "@internationalized/date";
import { DateSegment } from "./DateSegment";
import cx from "classix";

interface Props extends Omit<DateFieldStateOptions, "locale" | "createCalendar">{
  className?: string
  dateValue?: Date;
}

export function DateField(props: Props) {
  let { locale } = useLocale();
  let state = useDateFieldState({
    ...props,
    value: !!props.dateValue ? parseDate(props.dateValue.toISOString().slice(0, 10)) : undefined,
    locale,
    createCalendar,
  });

  let ref = useRef<HTMLDivElement>(null);
  let { labelProps, fieldProps } = useDateField(props, state, ref);

  return (
    <div className={cx("flex flex-col items-start", props.className)}>
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
