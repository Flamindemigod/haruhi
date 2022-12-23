import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import cx from "classnames";
import { RxCheck } from "react-icons/rx";

interface Props {
  checked: boolean;
  onChecked: (event: any) => void;
  ariaLabel: string;
}

const Checkbox = (props: Props) => {
  return (
    <CheckboxPrimitive.Root
      id="c1"
      checked={props.checked}
      onCheckedChange={props.onChecked}
      className={cx(
        "flex h-5 w-5 items-center justify-center rounded",
        "radix-state-checked:bg-primary-500 radix-state-unchecked:bg-offWhite-100 dark:radix-state-unchecked:bg-offWhite-900",
        "focus:outline-none focus-visible:ring focus-visible:ring-primary-600 focus-visible:ring-opacity-75"
      )}
    >
      <CheckboxPrimitive.Indicator>
        <RxCheck size={16} className="self-center text-white" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
};

export default Checkbox;
