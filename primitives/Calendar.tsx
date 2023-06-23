import * as PopoverPrimitive from "@radix-ui/react-popover";
import Calendar from "react-calendar";
import { MdCalendarToday } from "react-icons/md";
import { DateField } from "./DateField";
import { getLocalTimeZone, parseDate } from "@internationalized/date";
import "react-calendar/dist/Calendar.css";
import "./Calendar.css";

function compensateDST(dt: Date) {
  var janOffset = new Date(dt.getFullYear(), 0, 1).getTimezoneOffset();
  var julOffset = new Date(dt.getFullYear(), 6, 1).getTimezoneOffset();
  var dstMinutes = dt.getTimezoneOffset() - Math.max(janOffset, julOffset);
  dt = new Date(dt);
  dt.setMinutes(dt.getMinutes() - dstMinutes);
  return dt;
}

type Props = {
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  date: Date | null;
  setDate: (date: Date) => void;
};

const Calender = (props: Props) => {
  return (
    <div className="flex gap-2 justify-center items-center dark:text-offWhite-100 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 w-44 h-[42px] rounded-md">
      <DateField
        aria-label="Date Field"
        value={
          props.date
            ? parseDate(compensateDST(props.date).toISOString().split("T")[0])
            : undefined
        }
        onChange={(date: any) => {
          props.setDate(date.toDate(getLocalTimeZone()));
        }}
        minValue={
          props.minDate
            ? parseDate(
                compensateDST(props.minDate).toISOString().split("T")[0]
              )
            : undefined
        }
        maxValue={
          props.maxDate
            ? parseDate(
                compensateDST(props.maxDate).toISOString().split("T")[0]
              )
            : undefined
        }
      />
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button className="btn | flex justify-center items-center text-white dark:text-offWhite-100 bg-primary-500 ">
            <MdCalendarToday width={24} height={24} />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.PopoverContent
            className="z-50 bg-white dark:bg-offWhite-700 p-8 drop-shadow-md"
            sideOffset={-10}
          >
            <Calendar
              className={"dark:text-offWhite-100"}
              value={props.date}
              onChange={props.setDate}
              minDate={props.minDate}
              maxDate={props.maxDate}
            />
          </PopoverPrimitive.PopoverContent>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
    </div>
  );
};

export default Calender;
