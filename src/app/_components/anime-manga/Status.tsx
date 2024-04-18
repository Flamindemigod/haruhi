import { CaretDownIcon } from '@radix-ui/react-icons';
import cx from 'classix';
import Select from '~/primitives/Select';
import { ListStatus } from '~/types.shared/anilist';

const styles =
  'text-md rounded-md p-2 text-offWhite-700 placeholder:text-offWhite-500 dark:text-offWhite-100 dark:placeholder:text-offWhite-200 border border-offWhite-400 focus-visible:border-transparent dark:border-offWhite-700 dark:bg-offWhite-700 flex gap-2 items-center justify-center w-full' as const;

interface StatusSelectorProps {
  value: ListStatus | null;
  onValueChange: (val: ListStatus | null) => void;
}
export const StatusSelector = (props: StatusSelectorProps) => {
  return (
    <Select
      {...props}
      trigger={
        <button className={cx(styles)}>
          {!props.value ? 'Not on List' : props.value}
          <CaretDownIcon />
        </button>
      }
      side='bottom'
      align='center'
      triggerAriaLabel='Media Status Selector'
      values={[
        ...Object.values(ListStatus).map((v) => ({
          value: v,
          displayTitle: v,
        })),
        { displayTitle: 'Not On List', value: null },
      ]}
      sideOffet={5}
      defaultValue={null}
    />
  );
};
