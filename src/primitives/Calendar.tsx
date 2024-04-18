import * as PopoverPrimitive from '@radix-ui/react-popover';
import Calendar from 'react-calendar';
import { MdCalendarToday, MdClear } from 'react-icons/md';
import { DateField } from './DateField';
import {
  DateValue,
  getLocalTimeZone,
  parseDate,
} from '@internationalized/date';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function compensateDST(dt: Date) {
  var janOffset = new Date(dt.getFullYear(), 0, 1).getTimezoneOffset();
  var julOffset = new Date(dt.getFullYear(), 6, 1).getTimezoneOffset();
  var dstMinutes = dt.getTimezoneOffset() - Math.max(janOffset, julOffset);
  dt.setMinutes(dt.getMinutes() - dstMinutes);
  return dt;
}

type Props = {
  minDate?: Date;
  maxDate?: Date;
  date?: Date | null;
  setDate: (date: Date | null) => void;
};

const styles =
  'text-md rounded-md p-2 text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 flex gap-2  w-full' as const;

const Calender = (props: Props) => {
  return (
    <div className={styles}>
      <DateField
        className='w-full px-2 py-0.5'
        aria-label='Date Field'
        dateValue={props.date == null ? undefined : compensateDST(props.date)}
        onChange={(date: DateValue) => {
          props.setDate(date.toDate(getLocalTimeZone()));
        }}
        minValue={
          !!props.minDate
            ? parseDate(
                compensateDST(props.minDate).toISOString().split('T')[0]!
              )
            : undefined
        }
        maxValue={
          !!props.maxDate
            ? parseDate(
                compensateDST(props.maxDate).toISOString().split('T')[0]!
              )
            : undefined
        }
      />
      <PopoverPrimitive.Root>
        <PopoverPrimitive.Trigger asChild>
          <button className='w-8 rounded-md bg-white/5 px-2 py-0.5 outline outline-1'>
            <MdCalendarToday width={24} height={24} />
          </button>
        </PopoverPrimitive.Trigger>
        <PopoverPrimitive.Portal>
          <PopoverPrimitive.PopoverContent
            className='z-50 bg-white p-8 drop-shadow-md dark:bg-offWhite-700'
            sideOffset={-10}
          >
            <Calendar
              className={'dark:text-offWhite-100'}
              value={props.date}
              onChange={(val, _) => {
                props.setDate(!!val ? new Date(val.toString()) : null);
              }}
              minDate={props.minDate}
              maxDate={props.maxDate}
            />
          </PopoverPrimitive.PopoverContent>
        </PopoverPrimitive.Portal>
      </PopoverPrimitive.Root>
      <button
        type='button'
        onClick={() => {
          props.setDate(null);
        }}
      >
        <MdClear
          width={24}
          height={24}
          className='h-full w-8 rounded-md bg-red-500/5 px-2 py-0.5 outline outline-1'
        />
      </button>
    </div>
  );
};

export default Calender;
