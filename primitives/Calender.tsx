import * as PopoverPrimitive from "@radix-ui/react-popover";
import Calendar from "react-calendar";
import { MdCalendarToday } from "react-icons/md";
import cx from "classnames";
type Props = {
  date: Date | null;
  setDate: (date: Date) => void;
};

const Calender = (props: Props) => {
  return (
    <div className="flex gap-2 justify-center items-center border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 p-2 w-44 h-[42px] rounded-md">
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button className="dark:text-offWhite-100">
            <MdCalendarToday width={24} height={24} />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.PopoverContent>
          <Calendar
            className={"text-white"}
            value={props.date}
            onChange={props.setDate}
          />
        </PopoverPrimitive.PopoverContent>
      </PopoverPrimitive.Root>
    </div>
  );
};

export default Calender;
